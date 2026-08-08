# AI Daily Briefing

A static, automatically updated AI/ML briefing published with GitHub Pages.

## Live site

Once GitHub Pages is enabled for this repository, the project site is:

`https://vgargatgit.github.io/ai/`

## What it does

- Publishes five high-signal AI/ML stories per day.
- Prioritizes major developments, deep technical advances, and practical tools/releases.
- Keeps a dated archive in `site/data/briefings/`.
- Uses the OpenAI Responses API with the built-in web search tool to research each edition.
- Deploys the static site with GitHub Pages; no application server is required.

## One-time setup

1. In **Settings → Pages → Build and deployment → Source**, select **GitHub Actions**.
2. In **Settings → Secrets and variables → Actions**, create a repository secret named `OPENAI_API_KEY`.
3. Do not put the API key in this repository. The daily workflow reads it only from GitHub Actions secrets.
4. Optionally run **Actions → Daily AI briefing → Run workflow** once to test generation.

The scheduled workflow runs at `02:00 UTC` each day, which is `07:30 IST`, so the refreshed edition should normally be available in the morning. GitHub cron jobs can occasionally start later than the scheduled minute.

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
scripts/
  generate_briefing.py
.github/workflows/
  daily-briefing.yml
  pages.yml
```

## Local preview

From the repository root:

```bash
python3 -m http.server 8000 --directory site
```

Then open `http://localhost:8000`.

## Generate locally

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
export OPENAI_API_KEY='...'
python scripts/generate_briefing.py
```

You can override the model with `OPENAI_MODEL`.
