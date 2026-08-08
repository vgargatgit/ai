const els = {
  status: document.querySelector('#status'),
  date: document.querySelector('#edition-date'),
  time: document.querySelector('#edition-time'),
  signalCard: document.querySelector('#signal-card'),
  signal: document.querySelector('#signal-text'),
  stories: document.querySelector('#stories'),
  takeaway: document.querySelector('#takeaway'),
  takeawayText: document.querySelector('#takeaway-text'),
  archiveToggle: document.querySelector('#archive-toggle'),
  archiveClose: document.querySelector('#archive-close'),
  archivePanel: document.querySelector('#archive-panel'),
  archiveBackdrop: document.querySelector('#archive-backdrop'),
  archiveList: document.querySelector('#archive-list'),
};

const make = (tag, className, text) => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
};

function safeSourceUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' ? url.href : null;
  } catch {
    return null;
  }
}

function renderStory(story, index) {
  const article = make('article', 'story');

  const rank = make('div', 'story-rank', 'STORY');
  rank.append(make('strong', '', String(story.rank ?? index + 1).padStart(2, '0')));

  const content = make('div', 'story-content');
  content.append(make('h2', '', story.title || 'Untitled story'));

  if (Array.isArray(story.tags) && story.tags.length) {
    const tags = make('div', 'story-tags');
    story.tags.slice(0, 4).forEach((tag) => tags.append(make('span', '', tag)));
    content.append(tags);
  }

  const copy = make('div', 'story-copy');
  copy.append(make('p', '', story.summary || ''));
  copy.append(make('h3', '', 'Why it matters'));
  copy.append(make('p', '', story.whyItMatters || ''));
  content.append(copy);

  const footer = make('div', 'story-footer');
  const attentionClass = ['red', 'amber', 'blue', 'green'].includes(story.attentionLevel)
    ? story.attentionLevel
    : 'blue';
  footer.append(make('span', `attention ${attentionClass}`, `● ${story.attention || 'Worth watching'}`));

  const sourceUrl = safeSourceUrl(story.sourceUrl);
  if (sourceUrl) {
    const link = make('a', 'source-link', `${story.sourceName || 'Source'} ↗`);
    link.href = sourceUrl;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    footer.append(link);
  }

  content.append(footer);
  article.append(rank, content);
  return article;
}

async function loadBriefing(path) {
  els.status.textContent = 'Loading briefing…';
  els.stories.replaceChildren();

  const response = await fetch(path, { cache: 'no-store' });
  if (!response.ok) throw new Error(`Briefing request failed (${response.status})`);
  const briefing = await response.json();

  els.date.textContent = briefing.displayDate || briefing.date || 'Daily edition';
  els.time.textContent = briefing.edition || 'Morning IST';
  els.signal.textContent = briefing.signal || '';
  els.signalCard.hidden = !briefing.signal;

  (briefing.stories || []).forEach((story, index) => {
    els.stories.append(renderStory(story, index));
  });

  els.takeawayText.textContent = briefing.takeaway || '';
  els.takeaway.hidden = !briefing.takeaway;
  els.status.textContent = '';
  document.title = `AI Daily Briefing — ${briefing.displayDate || briefing.date || 'Latest'}`;
}

async function loadArchive() {
  try {
    const response = await fetch('./data/index.json', { cache: 'no-store' });
    if (!response.ok) return;
    const archive = await response.json();
    els.archiveList.replaceChildren();

    (archive.editions || []).forEach((edition) => {
      const link = make('a', 'archive-item');
      link.href = `?date=${encodeURIComponent(edition.date)}`;
      link.append(make('span', 'archive-date', edition.displayDate || edition.date));
      link.append(make('span', 'archive-signal', edition.signal || 'AI/ML daily briefing'));
      els.archiveList.append(link);
    });
  } catch (error) {
    console.error('Could not load archive', error);
  }
}

function setArchive(open) {
  els.archivePanel.classList.toggle('open', open);
  els.archivePanel.setAttribute('aria-hidden', String(!open));
  els.archiveToggle.setAttribute('aria-expanded', String(open));
  els.archiveBackdrop.hidden = !open;
}

els.archiveToggle.addEventListener('click', () => setArchive(true));
els.archiveClose.addEventListener('click', () => setArchive(false));
els.archiveBackdrop.addEventListener('click', () => setArchive(false));
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') setArchive(false);
});

(async () => {
  try {
    const params = new URLSearchParams(window.location.search);
    const date = params.get('date');
    const path = date && /^\d{4}-\d{2}-\d{2}$/.test(date)
      ? `./data/briefings/${date}.json`
      : './data/latest.json';

    await Promise.all([loadBriefing(path), loadArchive()]);
  } catch (error) {
    console.error(error);
    els.status.textContent = 'The briefing could not be loaded. Try refreshing, or check the repository workflow status.';
  }
})();
