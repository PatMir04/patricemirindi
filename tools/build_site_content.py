#!/usr/bin/env python3
"""Build the blog, RSS feeds, sitemap and chatbot knowledge base from content/.

Inputs
  content/posts/*.md   one file per article per language (see content/README.md)
  content/faq.json     curated Q&A for the chatbot (EN + FR)
  docs/data/*.json     profile, skills, experience; data/key_projects.json
Outputs (all under docs/)
  blog/<slug>.html, blog/<slug>.fr.html, blog/posts.json, blog/feed.xml, blog/feed.fr.xml,
  data/knowledge.json, sitemap.xml

Usage: python3 tools/build_site_content.py [--check]
  --check  build to memory and fail if any output differs from what is committed (used in CI),
           and run the content policy lint.
Requires: pip install markdown
"""
import datetime as dt
import html
import json
import os
import re
import subprocess
import sys
from email.utils import format_datetime
from pathlib import Path

import markdown

ROOT = Path(__file__).resolve().parent.parent
DOCS = ROOT / "docs"
POSTS_DIR = ROOT / "content" / "posts"
SITE = "https://patricemirindi.com"
WPM = 220

# ---------------------------------------------------------------- content policy
# Articles stay positive and professional: no political, religious or sexual views.
# A hit fails the build unless the post lists the term in `review_ok` after a human check.
BANNED = [
    r"election", r"elected", r"voters?", r"voting", r"ballot", r"partisan", r"left-wing", r"right-wing",
    r"liberal party", r"conservative party", r"ndp", r"bloc qu[eé]b[eé]cois", r"republicans?", r"democrats?",
    r"trump", r"biden", r"poilievre", r"carney", r"trudeau", r"abortion", r"immigration policy",
    r"religion", r"religious", r"church", r"mosque", r"synagogue", r"temple", r"god", r"islam\w*", r"christian\w*",
    r"jewish", r"hindu\w*", r"buddhis\w*", r"sexual\w*", r"porn\w*", r"gender ideology",
    r"[ée]lections?", r"[ée]lecteurs?", r"parti politique", r"religieu\w*", r"[ée]glise", r"mosqu[ée]e", r"sexuel\w*",
]
BANNED_RE = re.compile(r"\b(" + "|".join(BANNED) + r")\b", re.I)
# Extra private terms (e.g. an employer name) come from the environment, never from the repo.
PRIVATE = [t.strip() for t in os.environ.get("PRIVATE_BLOCKLIST", "").split(",") if t.strip()]

UI = {
    "en": {"read": "min read", "sources": "Sources", "related": "Related work", "other": "Lire en français",
           "about_h": "About the author", "about_p": "Patrice Mirindi is a bilingual data analyst and development "
           "economist in Ottawa. He builds dashboards, data pipelines and impact analyses for public-sector, "
           "non-profit and development teams.", "cta": "Start a conversation", "back": "All articles",
           "date_locale": "en-CA", "insights": "Insights", "see": "See all projects"},
    "fr": {"read": "min de lecture", "sources": "Sources", "related": "Projets liés", "other": "Read in English",
           "about_h": "À propos de l'auteur", "about_p": "Patrice Mirindi est analyste de données et économiste "
           "du développement bilingue, basé à Ottawa. Il conçoit des tableaux de bord, des flux de données et des "
           "analyses d'impact pour le secteur public, les organismes sans but lucratif et le développement "
           "international.", "cta": "Discutons de votre projet", "back": "Tous les articles",
           "date_locale": "fr-CA", "insights": "Analyses", "see": "Voir tous les projets"},
}
# Article series: the scheduled writer rotates through these in order.
SERIES = {
    "fabric": {"en": "Microsoft Fabric & Power BI", "fr": "Microsoft Fabric et Power BI"},
    "development": {"en": "Economic development", "fr": "Développement économique"},
    "code": {"en": "Code tips", "fr": "Astuces de code"},
    "projects": {"en": "From the field", "fr": "Sur le terrain"},
    "trends": {"en": "Trends in data & development", "fr": "Tendances données et développement"},
}
MONTHS_FR = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre",
             "novembre", "décembre"]


def fmt_date(d, lang):
    d = dt.date.fromisoformat(d)
    if lang == "fr":
        return f"{d.day} {MONTHS_FR[d.month - 1]} {d.year}"
    return d.strftime("%B %-d, %Y")


def parse_post(path):
    raw = path.read_text(encoding="utf-8")
    m = re.match(r"^---\n(.*?)\n---\n(.*)$", raw, re.S)
    if not m:
        raise SystemExit(f"{path.name}: missing front matter")
    meta = {}
    for line in m.group(1).splitlines():
        if not line.strip() or line.lstrip().startswith("#"):
            continue
        key, _, val = line.partition(":")
        val = val.strip()
        try:
            meta[key.strip()] = json.loads(val)
        except json.JSONDecodeError:
            meta[key.strip()] = val.strip('"')
    for req in ("title", "slug", "lang", "date", "summary", "series"):
        if req not in meta:
            raise SystemExit(f"{path.name}: front matter needs '{req}'")
    meta.setdefault("tags", [])
    meta.setdefault("sources", [])
    meta.setdefault("related_projects", [])
    meta.setdefault("published", True)
    meta.setdefault("review_ok", [])
    meta["body_md"] = m.group(2).strip()
    meta["words"] = len(re.findall(r"\w+", meta["body_md"]))
    meta["readMinutes"] = max(1, round(meta["words"] / WPM))
    meta["file"] = path.name
    return meta


def lint(post):
    problems = []
    text = " ".join([post["title"], post["summary"], post["body_md"]])
    ok = {t.lower() for t in post["review_ok"]}
    for hit in sorted({h.lower() for h in BANNED_RE.findall(text)}):
        if hit not in ok:
            problems.append(f"{post['file']}: off-policy term '{hit}' (political/religious/sexual). "
                            "Rewrite, or add it to review_ok after a human check.")
    for term in PRIVATE:
        if term.lower() in text.lower():
            problems.append(f"{post['file']}: contains a private term from PRIVATE_BLOCKLIST")
    if post["series"] not in SERIES:
        problems.append(f"{post['file']}: series must be one of {', '.join(SERIES)}")
    if post["lang"] not in ("en", "fr"):
        problems.append(f"{post['file']}: lang must be en or fr")
    if not post["sources"]:
        problems.append(f"{post['file']}: every article needs at least one source")
    for s in post["sources"]:
        if not str(s.get("url", "")).startswith("https://"):
            problems.append(f"{post['file']}: source without an https URL: {s}")
    if post["words"] < 400:
        problems.append(f"{post['file']}: only {post['words']} words; articles need 400+")
    return problems


def post_url(post):
    return f"/blog/{post['slug']}{'.fr' if post['lang'] == 'fr' else ''}.html"


NAV = [("/about.html", "About"), ("/work-experience.html", "Experience"), ("/skills-expertise.html", "Skills"),
       ("/key-projects.html", "Projects"), ("/data-analytics.html", "Dashboard"), ("/blog.html", "Insights"),
       ("/contact.html", "Contact")]


def nav():
    li = []
    for href, label in NAV:
        cls = "nav-link" + (" nav-cta" if label == "Contact" else "") + (" active" if label == "Insights" else "")
        li.append(f'<li class="nav-item"><a href="{href}" class="{cls}">{label}</a></li>')
    return "\n                ".join(li)


def page(post, other):
    t = UI[post["lang"]]
    e = html.escape
    url = SITE + post_url(post)
    body = markdown.markdown(post["body_md"], extensions=["extra", "sane_lists", "toc"])
    alt = ""
    switch = ""
    if other:
        alt = (f'<link rel="alternate" hreflang="{post["lang"]}" href="{url}">\n    '
               f'<link rel="alternate" hreflang="{other["lang"]}" href="{SITE + post_url(other)}">')
        switch = f'<a class="lang-switch" href="{post_url(other)}" hreflang="{other["lang"]}">{t["other"]}</a>'
    sources = "".join(f'<li><a href="{e(s["url"])}" rel="noopener" target="_blank">{e(s["title"])}</a>'
                      f'{(" — " + e(s["publisher"])) if s.get("publisher") else ""}</li>' for s in post["sources"])
    related = ""
    if post["related_projects"]:
        items = "".join(f"<li>{e(p)}</li>" for p in post["related_projects"])
        related = (f'<aside class="related"><h2>{t["related"]}</h2><ul>{items}</ul>'
                   f'<a href="/key-projects.html">{t["see"]}</a></aside>')
    series_label = SERIES[post["series"]][post["lang"]]
    tags = f'<a href="/blog.html?series={post["series"]}">{e(series_label)}</a>' + "".join(f" · {e(x)}" for x in post["tags"][:2])
    ld = json.dumps({"@context": "https://schema.org", "@type": "BlogPosting", "headline": post["title"],
                     "datePublished": post["date"], "inLanguage": post["lang"], "url": url,
                     "description": post["summary"], "author": {"@type": "Person", "name": "Patrice Mirindi",
                                                                "url": SITE + "/"}}, ensure_ascii=False)
    return f"""<!DOCTYPE html>
<html lang="{post['lang']}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{e(post['title'])} | Patrice Mirindi</title>
    <meta name="description" content="{e(post['summary'])}">
    <link rel="canonical" href="{url}">
    {alt}
    <meta property="og:type" content="article">
    <meta property="og:url" content="{url}">
    <meta property="og:title" content="{e(post['title'])}">
    <meta property="og:description" content="{e(post['summary'])}">
    <meta property="og:image" content="{SITE}/assets/img/og-card.jpg">
    <meta name="twitter:card" content="summary_large_image">
    <link href="https://fonts.googleapis.com/css2?family=Nunito+Sans:opsz,wght@6..12,400;6..12,600;6..12,700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="/assets/css/style.css">
    <link rel="stylesheet" href="/assets/css/theme.css">
    <link rel="stylesheet" href="/assets/css/article.css">
    <script type="application/ld+json">{ld}</script>
</head>
<body class="article-page">
    <nav class="navbar" aria-label="Main">
        <div class="nav-container">
            <div class="nav-logo"><a href="/">Patrice Mirindi</a></div>
            <ul class="nav-menu">
                {nav()}
            </ul>
            <button class="hamburger" type="button" aria-label="Open menu"><span class="bar"></span><span class="bar"></span><span class="bar"></span></button>
        </div>
    </nav>
    <main class="article-wrap">
        <article>
            <p class="eyebrow">{tags}</p>
            <h1>{e(post['title'])}</h1>
            <p class="meta"><time datetime="{post['date']}">{fmt_date(post['date'], post['lang'])}</time> · {post['readMinutes']} {t['read']} {switch}</p>
            <p class="standfirst">{e(post['summary'])}</p>
            <div class="prose">
{body}
            </div>
            {related}
            <section class="sources"><h2>{t['sources']}</h2><ol>{sources}</ol></section>
            <section class="author">
                <img src="/assets/img/patricemirindi-640.jpg" width="72" height="72" alt="">
                <div><h2>{t['about_h']}</h2><p>{t['about_p']}</p>
                <a class="pill pill-accent" href="/contact.html">{t['cta']}</a></div>
            </section>
            <p><a class="back" href="/blog.html">← {t['back']}</a></p>
        </article>
    </main>
    <footer class="footer"><div class="container"><div class="footer-bottom"><p>&copy; Patrice Mirindi · Ottawa, ON · <a href="/blog/feed.xml">RSS</a></p></div></div></footer>
    <script src="/assets/js/main.js"></script>
    <script src="/assets/js/knowledge-chat.js" defer></script>
</body>
</html>
"""


def rss(posts, lang):
    items = []
    for p in posts:
        if p["lang"] != lang:
            continue
        d = dt.datetime.fromisoformat(p["date"] + "T12:00:00+00:00")
        items.append(f"<item><title>{html.escape(p['title'])}</title><link>{SITE + post_url(p)}</link>"
                     f"<guid>{SITE + post_url(p)}</guid><pubDate>{format_datetime(d)}</pubDate>"
                     f"<description>{html.escape(p['summary'])}</description></item>")
    title = "Insights — Patrice Mirindi" if lang == "en" else "Analyses — Patrice Mirindi"
    return (f'<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0"><channel><title>{title}</title>'
            f"<link>{SITE}/blog.html</link><description>Data, tools and development.</description>"
            f"<language>{lang}</language>{''.join(items)}</channel></rss>\n")


def strip_md(md):
    text = re.sub(r"```.*?```", " ", md, flags=re.S)
    text = re.sub(r"!\[[^\]]*\]\([^)]*\)", " ", text)
    text = re.sub(r"\[([^\]]+)\]\([^)]*\)", r"\1", text)
    text = re.sub(r"[#*>`|]", " ", text)
    return re.sub(r"\s+", " ", text).strip()


def knowledge(posts):
    docs = []

    def add(kind, title, url, text, lang="en", tags=()):
        text = re.sub(r"\s+", " ", text).strip()
        if text:
            docs.append({"id": f"{kind}-{len(docs)}", "type": kind, "lang": lang, "title": title, "url": url,
                         "tags": list(tags), "text": text})

    for p in posts:
        for sec in re.split(r"\n(?=##\s)", "\n" + p["body_md"]):
            hm = re.match(r"\s*##\s+([^\n]+)", sec)
            head = hm.group(1).strip() if hm else ""
            for m in re.finditer(r"```([\w+-]*)\n(.*?)```", sec, re.S):
                before = strip_md(re.sub(r"```.*?```", " ", sec[:m.start()], flags=re.S).replace(head, "", 1))
                lead = " ".join(re.findall(r"[^.!?]+[.!?]", before)[-2:]).strip() or before[-300:]
                docs.append({"id": f"snippet-{len(docs)}", "type": "snippet", "lang": p["lang"],
                             "title": p["title"] + (f" — {head}" if head else ""), "url": post_url(p),
                             "tags": p["tags"] + [m.group(1) or "code", SERIES[p["series"]][p["lang"]]],
                             "text": f"{head}. {lead}".strip(". "), "code": m.group(2).strip()[:1500],
                             "codeLang": m.group(1) or ""})
        sections = re.split(r"\n(?=##\s)", "\n" + p["body_md"])
        add("article", p["title"], post_url(p), p["summary"], p["lang"], p["tags"])
        for sec in sections:
            sec = sec.strip()
            if not sec:
                continue
            head = re.match(r"##\s+(.*)", sec)
            title = f"{p['title']} — {head.group(1)}" if head else p["title"]
            for chunk in re.findall(r"(?:\S+\s+){0,120}\S+", strip_md(sec)):
                add("article", title, post_url(p), chunk, p["lang"], p["tags"])

    for proj in json.loads((ROOT / "data" / "key_projects.json").read_text(encoding="utf-8")):
        parts = [proj.get("description", ""), "Objectives: " + "; ".join(proj.get("objectives", [])),
                 "Outcomes: " + "; ".join(proj.get("outcomes", [])),
                 "Tools: " + ", ".join(proj.get("technologies", []))]
        add("project", proj["title"], "/key-projects.html", " ".join(parts), "en", [proj.get("category", "")])

    projects_html = (DOCS / "key-projects.html").read_text(encoding="utf-8")
    for card in re.findall(r'class="project-card[^"]*"(.*?)(?=class="project-card|<footer)', projects_html, re.S):
        t = re.search(r"<h3>(.*?)</h3>", card, re.S)
        paras = [re.sub(r"<[^>]+>", "", x).strip() for x in re.findall(r"<p[^>]*>(.*?)</p>", card, re.S)]
        loc = re.findall(r'fa-map-marker-alt"></i>\s*<span>(.*?)</span>', card)
        if t:
            add("project", html.unescape(t.group(1)), "/key-projects.html",
                html.unescape(" ".join([*(loc[:1] and [f"Location: {loc[0]}."]), *[p for p in paras if len(p) > 30]][:4])))

    skills = json.loads((DOCS / "data" / "skills_expertise.json").read_text(encoding="utf-8"))
    for group in skills.get("technical_skills", {}).values():
        names = ", ".join(s["name"] + (f" ({s['level']})" if s.get("level") else "") for s in group.get("skills", []))
        add("skills", group.get("category", "Skills"), "/skills-expertise.html", f"{group.get('category')}: {names}.")
    for key, group in skills.items():
        if key == "technical_skills":
            continue
        add("skills", key.replace("_", " ").title(), "/skills-expertise.html", json.dumps(group, ensure_ascii=False)
            .replace('"', " ").replace("{", " ").replace("}", " ").replace("[", " ").replace("]", " "))

    for job in json.loads((DOCS / "data" / "work_experience.json").read_text(encoding="utf-8")):
        who = f"{job['title']}" + (f", {job['company']}" if job.get("company") else "")
        add("experience", who, "/work-experience.html",
            f"{who} ({job.get('period', '')}, {job.get('location', '')}). {job.get('description', '')} "
            + " ".join(job.get("achievements", [])))

    faq = json.loads((ROOT / "content" / "faq.json").read_text(encoding="utf-8"))
    for item in faq:
        add("faq", item["q"], item.get("url", "/contact.html"), item["a"], item.get("lang", "en"), item.get("tags", []))

    for d in docs:
        for term in PRIVATE:
            if term.lower() in d["text"].lower():
                raise SystemExit(f"knowledge base would contain a private term (in {d['title']}) — fix the source")
    return {"generated": dt.date.today().isoformat(), "count": len(docs), "docs": docs}


def git_date(path):
    try:
        out = subprocess.run(["git", "log", "-1", "--format=%cs", "--", str(path)], cwd=ROOT,
                             capture_output=True, text=True).stdout.strip()
        return out or None
    except OSError:
        return None


def sitemap(posts):
    pages = ["", "about.html", "work-experience.html", "skills-expertise.html", "key-projects.html",
             "data-analytics.html", "blog.html", "contact.html"]
    rows = []
    for pg in pages:
        lm = git_date(DOCS / (pg or "index.html"))
        rows.append(f"  <url><loc>{SITE}/{pg}</loc>" + (f"<lastmod>{lm}</lastmod>" if lm else "") + "</url>")
    for p in posts:
        rows.append(f"  <url><loc>{SITE + post_url(p)}</loc><lastmod>{p['date']}</lastmod></url>")
    return ('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
            + "\n".join(rows) + "\n</urlset>\n")


def main():
    check = "--check" in sys.argv
    posts = [parse_post(p) for p in sorted(POSTS_DIR.glob("*.md"))]
    problems = [x for p in posts for x in lint(p)]
    slugs = {}
    for p in posts:
        slugs.setdefault(p["slug"], {})[p["lang"]] = p
    for slug, langs in slugs.items():
        if set(langs) != {"en", "fr"}:
            problems.append(f"{slug}: needs both an English and a French file")
    if problems:
        print("\n".join(problems))
        raise SystemExit(1)

    published = sorted([p for p in posts if p["published"]], key=lambda p: p["date"], reverse=True)
    outputs = {}
    for p in published:
        other_lang = "fr" if p["lang"] == "en" else "en"
        other = slugs[p["slug"]].get(other_lang)
        outputs[DOCS / post_url(p).lstrip("/")] = page(p, other if other and other["published"] else None)
    index = [{"slug": p["slug"], "lang": p["lang"], "title": p["title"], "summary": p["summary"],
              "date": p["date"], "series": p["series"], "seriesLabel": SERIES[p["series"]][p["lang"]],
              "tags": p["tags"], "url": post_url(p), "readMinutes": p["readMinutes"],
              "published": True} for p in published]
    outputs[DOCS / "blog" / "posts.json"] = json.dumps(index, indent=1, ensure_ascii=False) + "\n"
    outputs[DOCS / "blog" / "feed.xml"] = rss(published, "en")
    outputs[DOCS / "blog" / "feed.fr.xml"] = rss(published, "fr")
    kb = knowledge(published)
    outputs[DOCS / "sitemap.xml"] = sitemap([p for p in published])

    if check:
        stale = [str(path.relative_to(ROOT)) for path, text in outputs.items()
                 if not path.exists() or path.read_text(encoding="utf-8") != text]
        kb_path = DOCS / "data" / "knowledge.json"
        if kb_path.exists():
            old = json.loads(kb_path.read_text(encoding="utf-8"))
            if old.get("docs") != kb["docs"]:
                stale.append(str(kb_path.relative_to(ROOT)))
        else:
            stale.append("docs/data/knowledge.json")
        stale = [s for s in stale if not s.endswith("sitemap.xml")]  # lastmod depends on git history depth
        if stale:
            print("Outputs are out of date; run python3 tools/build_site_content.py and commit:\n  " + "\n  ".join(stale))
            raise SystemExit(1)
        print(f"content OK: {len(published)} published posts, {kb['count']} knowledge entries")
        return

    (DOCS / "blog").mkdir(exist_ok=True)
    for path, text in outputs.items():
        path.write_text(text, encoding="utf-8")
    (DOCS / "data" / "knowledge.json").write_text(json.dumps(kb, ensure_ascii=False, indent=0) + "\n", encoding="utf-8")
    print(f"built {len(published)} posts, {kb['count']} knowledge entries")


if __name__ == "__main__":
    main()
