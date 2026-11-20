#!/usr/bin/env python3
"""Build the chat index chunks from the site's knowledge base.

Offline alternative to the worker's /admin/reindex endpoint (which is the
recommended path — it embeds and upserts in one call, no local keys needed).

This script reads docs/data/knowledge.json, chunks every entry, and writes
chatbot-worker/index/chunks.ndjson (one JSON object per line: id, text,
metadata). If CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_API_TOKEN are set in the
environment, it also calls the Workers AI REST API (@cf/baai/bge-m3) to
embed the chunks and writes vectors.ndjson ready for:

    npx wrangler vectorize insert patrice-chat-index --file vectors.ndjson

Your Cloudflare credentials stay in your shell environment — never in the
repo. Run from the repository root:

    python3 tools/build_chat_index.py
"""
import json
import os
import re
import sys
import urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
KB = os.path.join(ROOT, "docs", "data", "knowledge.json")
OUT_DIR = os.path.join(ROOT, "chatbot-worker", "index")
MAX_CHARS = 1000


def chunk_text(text):
    sents = re.findall(r"[^.!?]+[.!?]+", text or "") or [text or ""]
    chunks, cur = [], ""
    for s in sents:
        if len(cur + s) > MAX_CHARS and cur:
            chunks.append(cur.strip())
            cur = ""
        cur += s
    if cur.strip():
        chunks.append(cur.strip())
    return chunks


def main():
    with open(KB, encoding="utf-8") as f:
        kb = json.load(f)
    items = []
    for d in kb.get("docs", []):
        for i, piece in enumerate(chunk_text(d.get("text", ""))):
            items.append({
                "id": f"{d['id']}-{i}",
                "text": piece,
                "metadata": {
                    "title": d.get("title", ""),
                    "url": d.get("url", ""),
                    "lang": d.get("lang", "en"),
                    "type": d.get("type", ""),
                    "text": piece,
                },
            })
    os.makedirs(OUT_DIR, exist_ok=True)
    chunks_path = os.path.join(OUT_DIR, "chunks.ndjson")
    with open(chunks_path, "w", encoding="utf-8") as f:
        for it in items:
            f.write(json.dumps(it, ensure_ascii=False) + "\n")
    print(f"wrote {len(items)} chunks -> {chunks_path}")

    account = os.environ.get("CLOUDFLARE_ACCOUNT_ID")
    token = os.environ.get("CLOUDFLARE_API_TOKEN")
    if not (account and token):
        print("CLOUDFLARE_ACCOUNT_ID / CLOUDFLARE_API_TOKEN not set: "
              "chunks only. Either set them and re-run, or use the worker's "
              "POST /admin/reindex endpoint instead.")
        return
    url = f"https://api.cloudflare.com/client/v4/accounts/{account}/ai/run/@cf/baai/bge-m3"
    vectors_path = os.path.join(OUT_DIR, "vectors.ndjson")
    with open(vectors_path, "w", encoding="utf-8") as out:
        for i in range(0, len(items), 50):
            batch = items[i:i + 50]
            req = urllib.request.Request(
                url,
                data=json.dumps({"text": [b["text"] for b in batch]}).encode("utf-8"),
                headers={"authorization": f"Bearer {token}", "content-type": "application/json"},
                method="POST",
            )
            with urllib.request.urlopen(req) as resp:
                data = json.load(resp)["result"]["data"]
            for b, vec in zip(batch, data):
                out.write(json.dumps({"id": b["id"], "values": vec, "metadata": b["metadata"]},
                                     ensure_ascii=False) + "\n")
    print(f"wrote vectors -> {vectors_path}")
    print("insert with: npx wrangler vectorize insert patrice-chat-index "
          f"--file {os.path.relpath(vectors_path, ROOT)}")


if __name__ == "__main__":
    sys.exit(main())
