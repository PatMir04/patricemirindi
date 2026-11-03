#!/usr/bin/env python3
"""Apply shared site chrome to every page: Avenir/Midnight theme, one nav, chatbot, SEO tags.

Idempotent: safe to run again after editing pages. Usage: python3 tools/normalize_pages.py
"""
import re
from pathlib import Path

DOCS = Path(__file__).resolve().parent.parent / "docs"
SITE = "https://patricemirindi.com"
FONT_LINK = ('<link href="https://fonts.googleapis.com/css2?family=Nunito+Sans:opsz,wght@6..12,400;'
             '6..12,600;6..12,700&display=swap" rel="stylesheet">')

NAV = [
    ("about.html", "About"),
    ("work-experience.html", "Experience"),
    ("skills-expertise.html", "Skills"),
    ("key-projects.html", "Projects"),
    ("data-analytics.html", "Dashboard"),
    ("blog.html", "Insights"),
    ("contact.html", "Contact"),
]

# Pages that get shared chrome (index.html and blog pages are generated with it already)
PAGES = ["about.html", "work-experience.html", "skills-expertise.html", "key-projects.html",
         "data-analytics.html", "contact.html", "sdg-dashboard.html", "404.html"]


def nav_html(page, prefix=""):
    items = []
    for href, label in NAV:
        cls = "nav-link"
        if href == "contact.html":
            cls += " nav-cta"
        if href == page:
            cls += " active"
        aria = ' aria-current="page"' if href == page else ""
        items.append(f'<li class="nav-item"><a href="{prefix}{href}" class="{cls}"{aria}>{label}</a></li>')
    return '<ul class="nav-menu">\n                ' + "\n                ".join(items) + "\n            </ul>"


def normalize(page):
    path = DOCS / page
    s = path.read_text(encoding="utf-8")
    prefix = "/" if page == "404.html" else ""

    # Fonts: Avenir stack via theme.css, Nunito Sans as the web fallback
    s = re.sub(r'<link [^>]*fonts\.googleapis\.com/css2\?family=(Inter|Orbitron)[^>]*>', FONT_LINK, s)
    if "family=Nunito+Sans" not in s:
        s = s.replace("</head>", f"    {FONT_LINK}\n</head>", 1)
    if "assets/css/theme.css" not in s:
        s = s.replace("</head>", f'    <link rel="stylesheet" href="{prefix}assets/css/theme.css">\n</head>', 1)
    if page == "404.html":
        s = s.replace('href="assets/', 'href="/assets/').replace('src="assets/', 'src="/assets/')

    # One navigation everywhere
    s = re.sub(r'<ul class="nav-menu">.*?</ul>', lambda m: nav_html(page, prefix), s, count=1, flags=re.S)
    s = re.sub(r'<div class="hamburger">(.*?)</div>',
               r'<button class="hamburger" type="button" aria-label="Open menu">\1</button>', s, count=1, flags=re.S)

    # Chatbot: one knowledge-based assistant; drop old and missing scripts
    s = re.sub(r'\s*<script src="[^"]*assets/js/(chatbot|agricultural-expert-chatbot|data-enhanced-chatbot)\.js"></script>', "", s)
    if "knowledge-chat.js" not in s:
        s = s.replace("</body>", f'    <script src="{prefix}assets/js/knowledge-chat.js" defer></script>\n</body>', 1)

    # SEO basics
    if page != "404.html":
        url = f"{SITE}/{page}"
        if 'rel="canonical"' not in s:
            s = s.replace("</title>", f'</title>\n    <link rel="canonical" href="{url}">', 1)
        if 'property="og:image"' not in s:
            title = re.search(r"<title>(.*?)</title>", s, re.S).group(1).strip()
            desc = re.search(r'<meta name="description" content="([^"]*)"', s)
            og = (f'\n    <meta property="og:type" content="website">'
                  f'\n    <meta property="og:url" content="{url}">'
                  f'\n    <meta property="og:title" content="{title}">'
                  + (f'\n    <meta property="og:description" content="{desc.group(1)}">' if desc else "")
                  + f'\n    <meta property="og:image" content="{SITE}/assets/img/og-card.jpg">'
                  f'\n    <meta name="twitter:card" content="summary_large_image">')
            s = s.replace(f'<link rel="canonical" href="{url}">', f'<link rel="canonical" href="{url}">{og}', 1)
    s = s.replace('src="assets/img/patricemirindi.jpg"', 'src="assets/img/patricemirindi-640.jpg" width="640" height="640"')
    path.write_text(s, encoding="utf-8")


if __name__ == "__main__":
    for p in PAGES:
        normalize(p)
    print("normalized", len(PAGES), "pages")
