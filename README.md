# patricemirindi.com

Personal site of Patrice Mirindi — systems analyst, developer and development economist in Ottawa. Static HTML, CSS and JavaScript served by GitHub Pages from `docs/` on `main`, at the custom domain in `docs/CNAME`.

## How it fits together

| Part | Where | Notes |
| --- | --- | --- |
| Pages | `docs/*.html` | Shared nav, theme and SEO tags applied by `tools/normalize_pages.py` |
| Look | `docs/assets/css/theme.css` | Midnight theme: navy `#0B1B33` + orange `#FF7A1A`, Avenir with Nunito Sans fallback |
| Articles | `content/posts/*.md` | One file per language (EN + FR) per article, in five series — see `content/README.md` |
| Generated | `docs/blog/`, `docs/data/knowledge.json`, `docs/sitemap.xml` | Built by `tools/build_site_content.py`; never edit by hand |
| Chatbot | `docs/assets/js/knowledge-chat.js` | Runs in the browser, answers from `knowledge.json` (articles, code snippets, projects, skills, FAQ) |
| Chatbot FAQ | `content/faq.json` | Curated questions and answers, EN + FR |
| Dashboard | `docs/data-analytics.html`, `docs/assets/js/dashboard.js` | Live World Bank Indicators API, shareable URLs, CSV export |
| Checks | `tools/site_check.py`, `tests/smoke.mjs`, `.github/workflows/site-checks.yml` | Run on GitHub for every pull request, after every deploy and weekly |

## Common tasks

```bash
pip install markdown
python3 tools/build_site_content.py           # rebuild blog, feeds, sitemap, chatbot knowledge
python3 tools/build_site_content.py --check   # lint articles and confirm generated files are current
python3 tools/normalize_pages.py              # re-apply shared nav/theme/SEO to the main pages
python3 tools/site_check.py .                 # static health check (broken files, heavy files, SEO, JS syntax)
cd tests && npm ci && node smoke.mjs           # browser tests (needs Google Chrome)
```

## Publishing

Changes go through pull requests. GitHub Actions must pass before merging; GitHub Pages publishes `main` automatically, and a follow-up job tests the live site.

## Editorial rules

Articles are positive and practical, cite primary sources, and contain no political, religious or sexual views. The build fails on off-policy terms. Private terms that must never appear on the site can be added as a comma-separated `PRIVATE_BLOCKLIST` repository secret; they are never stored in the repo.
