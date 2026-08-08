# AI Daily Briefing

A static, automatically updated AI/ML briefing published with GitHub Pages.

## Live site

Once GitHub Pages is enabled for this repository, the project site is:

`https://vgargatgit.github.io/ai/`

## What it does

- Publishes five high-signal AI/ML stories per day.
- Prioritizes major developments, deep technical advances, and practical tools/releases.
- Keeps a dated archive in `site/data/briefings/`.
- Uses a ChatGPT scheduled task to research each morning's briefing and commit the generated JSON directly to this repository.
- Deploys the static site with GitHub Pages; no application server or OpenAI API key is required.

## Publishing flow

```text
ChatGPT scheduled task
        |
        | research current AI/ML developments
        v
site/data/briefings/YYYY-MM-DD.json
site/data/latest.json
site/data/index.json
        |
        | commit to main
        v
GitHub Pages workflow
        |
        v
https://vgargatgit.github.io/ai/
```

The ChatGPT task is scheduled for the morning in Asia/Kolkata and is responsible for both generating the five-story briefing and committing the content files. The Pages workflow only deploys the static `site/` directory when site content changes.

## One-time setup

In **Settings → Pages → Build and deployment → Source**, select **GitHub Actions**.

No `OPENAI_API_KEY` repository secret is required for the daily briefing.

## Structure

```text
site/
  index.html
  styles.css
  app.js
  data/
    latest.json
    index.json
    briefings/YYYY-MM-DD.json
.github/workflows/
  pages.yml
```

## Local preview

From the repository root:

```bash
python3 -m http.server 8000 --directory site
```

Then open `http://localhost:8000`.

## Content model

Each daily edition contains exactly five ranked stories plus:

- a concise cross-story `signal`
- a technical `whyItMatters` explanation for each story
- an attention label and level
- a credible source name and HTTPS URL
- topical tags
- a final cross-story `takeaway`

The site renders generated story text as text rather than trusted HTML.
