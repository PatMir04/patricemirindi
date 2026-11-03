#!/usr/bin/env python3
"""Static health check for the patricemirindi.com repo (GitHub Pages from /docs).

Usage: python3 site_check.py /path/to/repo [--stale "Winnipeg" --stale "Vancouver" ...]
Exit code 0 = no errors, 1 = errors found. Needs `node` on PATH for JS syntax checks.
"""
import argparse, json, os, re, shutil, subprocess, sys, tempfile
from html.parser import HTMLParser
from urllib.parse import urlparse
from xml.etree import ElementTree as ET

MAX_ASSET_KB = 300          # any single file in docs/ above this is flagged
MAX_IMAGE_KB = 200
SITE = "https://patricemirindi.com"


class Refs(HTMLParser):
    def __init__(self):
        super().__init__()
        self.refs, self.inline_js, self._in_js, self._buf = [], [], False, []
        self.title, self._in_title, self.meta, self.links, self.h1 = "", False, {}, {}, 0

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == "script":
            if a.get("src"):
                self.refs.append(a["src"])
            elif a.get("type", "text/javascript") in ("text/javascript", "module", ""):
                self._in_js, self._buf = True, []
        for k in ("href", "src"):
            if tag in ("link", "img", "a", "source") and a.get(k):
                self.refs.append(a[k])
        if tag == "title":
            self._in_title = True
        if tag == "meta":
            key = a.get("name") or a.get("property")
            if key:
                self.meta[key] = a.get("content", "")
        if tag == "link" and a.get("rel"):
            self.links[a["rel"]] = a.get("href", "")
        if tag == "h1":
            self.h1 += 1

    def handle_endtag(self, tag):
        if tag == "script" and self._in_js:
            self.inline_js.append("".join(self._buf))
            self._in_js = False
        if tag == "title":
            self._in_title = False

    def handle_data(self, data):
        if self._in_js:
            self._buf.append(data)
        if self._in_title:
            self.title += data


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("repo")
    ap.add_argument("--stale", action="append", default=[],
                    help="string that should no longer appear on the site (repeatable)")
    args = ap.parse_args()
    docs = os.path.join(args.repo, "docs")
    errors, warns = [], []
    node = shutil.which("node")
    if not node:
        warns.append("node not found: JS syntax checks skipped")

    def js_ok(code, label):
        if not node:
            return
        with tempfile.NamedTemporaryFile("w", suffix=".js", delete=False) as f:
            f.write(code)
        r = subprocess.run([node, "--check", f.name], capture_output=True, text=True)
        os.unlink(f.name)
        if r.returncode:
            msg = next((l for l in r.stderr.splitlines() if "Error" in l), r.stderr.strip()[:120])
            errors.append(f"JS syntax: {label}: {msg}")

    pages = sorted(f for f in os.listdir(docs) if f.endswith(".html"))
    blog_dir = os.path.join(docs, "blog")
    blog_pages = sorted("blog/" + f for f in os.listdir(blog_dir) if f.endswith(".html")) if os.path.isdir(blog_dir) else []
    linked_from_nav = set()
    for page in pages + blog_pages:
        p = Refs()
        p.feed(open(os.path.join(docs, page), encoding="utf-8").read())
        for i, code in enumerate(p.inline_js):
            if code.strip():
                js_ok(code, f"{page} inline #{i + 1}")
        for ref in p.refs:
            if re.match(r"^(https?:|mailto:|tel:|#|data:|javascript:)", ref) or not ref:
                continue
            path = ref.split("#")[0].split("?")[0]
            if not path:
                continue
            base = docs if path.startswith("/") else os.path.join(docs, os.path.dirname(page))
            target = os.path.normpath(os.path.join(base, path.lstrip("/")))
            if not os.path.exists(target):
                errors.append(f"Missing file: {page} -> {ref}")
            elif path.endswith(".html") and os.path.basename(path) != os.path.basename(page):
                linked_from_nav.add(os.path.basename(path))
        if not p.title.strip():
            errors.append(f"No <title>: {page}")
        if page != "404.html":
            if "description" not in p.meta:
                warns.append(f"No meta description: {page}")
            if "canonical" not in p.links:
                warns.append(f"No canonical link: {page}")
            if "og:image" not in p.meta:
                warns.append(f"No og:image: {page}")
            elif not p.meta["og:image"].startswith("http"):
                warns.append(f"Relative og:image: {page}")
            if p.h1 != 1:
                warns.append(f"{p.h1} <h1> elements: {page}")
        for s in re.findall(r"https://cdn\.[^\"']+latest[^\"']*", open(os.path.join(docs, page)).read()):
            warns.append(f"Unpinned library: {page} -> {s}")

    for page in pages:
        if page not in ("index.html", "404.html") and page not in linked_from_nav:
            warns.append(f"Orphan page (no link from any other page): {page}")

    # JS files that are actually loaded
    for root, _, files in os.walk(os.path.join(docs, "assets", "js")):
        for f in files:
            if f.endswith(".js"):
                js_ok(open(os.path.join(root, f), encoding="utf-8").read(), f"assets/js/{f}")

    # Big files
    for root, _, files in os.walk(docs):
        for f in files:
            fp = os.path.join(root, f)
            kb = os.path.getsize(fp) / 1024
            rel = os.path.relpath(fp, docs)
            limit = MAX_IMAGE_KB if re.search(r"\.(jpe?g|png|webp|gif)$", f, re.I) else MAX_ASSET_KB
            if kb > limit:
                errors.append(f"Heavy file: {rel} is {kb:,.0f} KB (limit {limit} KB)")
            if kb < 0.1 and re.search(r"\.(jpe?g|png|webp|csv)$", f, re.I):
                errors.append(f"Empty/corrupt file: {rel} ({os.path.getsize(fp)} bytes)")

    # Simulated data presented as real
    for root, _, files in os.walk(os.path.join(docs, "assets", "js")):
        for f in files:
            src = open(os.path.join(root, f), encoding="utf-8", errors="ignore").read()
            if re.search(r"generate\w*Score|Math\.random\(\)\s*\*\s*\d+\s*-", src):
                warns.append(f"Possible simulated data in assets/js/{f} — never label it real or live")

    # Sitemap coverage and domain
    sm = os.path.join(docs, "sitemap.xml")
    if os.path.exists(sm):
        ns = {"s": "http://www.sitemaps.org/schemas/sitemap/0.9"}
        locs = [u.find("s:loc", ns).text for u in ET.parse(sm).getroot().findall("s:url", ns)]
        mods = [u.findtext("s:lastmod", "", ns) for u in ET.parse(sm).getroot().findall("s:url", ns)]
        for loc in locs:
            if not loc.startswith(SITE):
                warns.append(f"Sitemap URL not on {SITE}: {loc}")
        listed = {(urlparse(l).path.lstrip("/") or "index.html") for l in locs}
        for page in pages:
            if page not in listed and page not in ("404.html", "sdg-dashboard.html"):
                warns.append(f"Not in sitemap: {page}")
        for page in blog_pages:
            if page not in listed:
                warns.append(f"Not in sitemap: {page}")
        if mods:
            warns.append(f"Sitemap newest lastmod: {max(mods)} (update when content changes)")
    else:
        errors.append("No sitemap.xml")

    # Private terms (e.g. an employer name) come from the environment, never from the repo
    for term in [t.strip() for t in os.environ.get("PRIVATE_BLOCKLIST", "").split(",") if t.strip()]:
        for root, _, files in os.walk(docs):
            for f in files:
                if f.endswith((".html", ".js", ".json", ".xml")):
                    if term.lower() in open(os.path.join(root, f), encoding="utf-8", errors="ignore").read().lower():
                        errors.append(f"Private term found in {os.path.relpath(os.path.join(root, f), docs)}")

    # Stale strings
    for s in args.stale:
        hits = []
        for root, _, files in os.walk(docs):
            for f in files:
                if f.endswith((".html", ".js", ".json")):
                    if s in open(os.path.join(root, f), encoding="utf-8", errors="ignore").read():
                        hits.append(os.path.relpath(os.path.join(root, f), docs))
        if hits:
            errors.append(f"Stale text '{s}' in: {', '.join(sorted(hits))}")

    print(json.dumps({"errors": errors, "warnings": warns,
                      "summary": f"{len(errors)} errors, {len(warns)} warnings, {len(pages)} pages"}, indent=1))
    sys.exit(1 if errors else 0)


if __name__ == "__main__":
    main()
