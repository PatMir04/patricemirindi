# AI chat for patricemirindi.com — Cloudflare Worker (free tier)

An AI layer **on top of** the site's existing client-side assistant — never a
replacement for it. The page tries this worker first (short timeout); on any
error, quota, or weak retrieval it silently falls back to the built-in
assistant, so the chat can never be dead.

```
question ─► Worker /chat ─► embed (Workers AI, bge-m3, EN/FR)
                         ─► Vectorize search over the site's own content
                         ─► answer from retrieved chunks only (Llama 3.1 8B)
                             └─ on Workers AI quota error ─► Groq Llama 3.3 70B
                         ─► { fallback: true } whenever unsure ─► built-in bot
```

## Guardrails

- **Site-first, no invention.** Answers about Patrice use only retrieved
  chunks of his public site content (the same `knowledge.json` the built-in
  bot uses). Weak retrieval → fallback, and the built-in bot offers its
  About menu.
- **The current employer is never named** — by construction (the index only
  contains public site content), by system prompt, and by an optional
  `PRIVATE_TERMS` secret that is post-filtered from every answer.
- **Research mode** (`mode: "research"`) answers beyond-site questions via
  Groq, with the answer explicitly labelled as general research, not site
  facts.
- **Abuse/budget guards:** per-IP soft rate limit (20/min) and a daily
  neuron budget guard that degrades to the built-in bot at ~90% of the free
  10,000 neurons/day (both need the optional KV namespace).
- **CORS** is locked to `patricemirindi.com`.

## Free-tier math (checked 2026-11-20 — verify in your dashboard)

Cloudflare free: 100k Worker requests/day; **Workers AI 10,000 neurons/day
is the binding constraint**; Vectorize free holds 5M stored dimensions and
30M queried dimensions/month (our index is ~150 chunks × 1024 dims — noise).

Rough neuron costs (estimates — the dashboard shows actuals):

| Step | Estimate |
|---|---|
| Embed one question (bge-m3) | ~5 neurons |
| One short chat, Llama 3.1 8B (~600 tokens in/out) | ~50 neurons |
| **One answered question, total** | **~55 neurons** |
| **Capacity on 10,000/day** | **~180 questions/day** |
| Same chat on Llama 3.3 70B | ~10× more → only dozens/day |

That is why the 8B model is the default (`CHAT_MODEL` in `wrangler.toml`)
and Groq is the overflow: Groq's free tier allows **1,000 requests/day and
100k tokens/day on Llama 3.3 70B** (14,400/day on 8B), no card required.
For a personal portfolio's traffic, this is comfortably $0.

## Patrice's setup checklist (~10 minutes, one time)

Only you can do these — they need your accounts. Nothing here costs money
and no key ever goes in chat or in the repo.

1. **Cloudflare account** (free) at dash.cloudflare.com, if you don't have one.
2. In this repo's `chatbot-worker/` folder: `npm install` then
   `npx wrangler login`.
3. **Create the index:** `npx wrangler vectorize create patrice-chat-index --dimensions=1024 --metric=cosine`
4. **(Recommended) KV for the guards:** `npx wrangler kv namespace create BUDGET`,
   paste the returned id into `wrangler.toml` and uncomment the block.
5. **Secrets** (you type these in your terminal/dashboard — never share them):
   - `npx wrangler secret put ADMIN_TOKEN` — invent a long random string.
   - `npx wrangler secret put PRIVATE_TERMS` — the private terms that must
     never appear in an answer, comma-separated.
   - Optional: create a free API key at groq.com and
     `npx wrangler secret put GROQ_API_KEY`.
6. **Deploy:** `npx wrangler deploy` → note the `*.workers.dev` URL.
7. **Build the index:** `curl -X POST https://<your-worker>/admin/reindex -H "x-admin-token: <your token>"`
   → expect `{"ok":true,"chunks":...}`. Re-run this whenever site content
   changes (or use `tools/build_chat_index.py` offline instead).
8. **Turn it on:** in `docs/assets/js/knowledge-chat.js`, set
   `WORKER_URL` to your worker's `/chat` URL and open a small PR — until
   then the merged code changes nothing live.

## Files

- `src/index.js` — the worker (chat, research, reindex, guards).
- `wrangler.toml` — config template; no secrets, no account IDs.
- `../tools/build_chat_index.py` — offline indexing alternative.
