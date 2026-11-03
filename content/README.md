# Site content

Articles and chatbot answers live here. `tools/build_site_content.py` turns them into the blog pages, RSS feeds, sitemap and the chatbot's knowledge base (`docs/data/knowledge.json`). Never edit those generated files by hand.

## Articles

One Markdown file per article per language, both sharing a `slug`:

```
content/posts/2026-11-03-findex-2025.en.md
content/posts/2026-11-03-findex-2025.fr.md
```

Front matter: one `key: value` per line; values in JSON (strings in quotes, lists in brackets).

```
---
title: "What the latest Global Findex tells us about financial inclusion"
slug: "findex-2025"
lang: "en"
date: "2026-11-03"
summary: "One or two sentences shown on cards, in search results and in the chatbot."
tags: ["Financial inclusion", "Data"]
related_projects: ["Financial Resilience Assessment Framework"]
sources: [{"title": "The Global Findex Database 2025", "publisher": "World Bank", "url": "https://..."}]
published: true
review_ok: []
---

Body in Markdown. Use ## for section headings.
```

The French file uses the same `slug`, `date`, `tags` and `sources`, with `lang: "fr"` and French `title`, `summary` and body. Set `published: false` to keep a draft out of the site.

## Editorial policy

- Positive and practical: what is new, why it matters, how it connects to real work.
- Every statistic links to a primary source (World Bank, IMF, FAO, OECD, Statistics Canada, UN agencies, official product documentation) with its year.
- 700–1,200 words. Plain language. No invented quotes, clients, results or numbers.
- No political, religious or sexual views, and no commentary on parties, politicians or elections. The build fails on such terms; a human may approve a neutral, necessary use by listing the term in `review_ok`.
- Never name or describe Patrice's current employer or its internal work.

## Build

```
pip install markdown
python3 tools/build_site_content.py          # write outputs
python3 tools/build_site_content.py --check  # what CI runs: lint + outputs up to date
```
