# AI chat for patricemirindi.com — Cloudflare Worker (free tier)

An AI layer **on top of** the site's existing client-side assistant — never a
replacement for it. The page tries this worker first (short timeout); on any
error, quota, or weak retrieval it silently falls back to the built-in
assistant, so the chat can never be dead.

```
question ─► Worker /chat ─► embed (Workers AI, bge-m3, EN/FR)
                         ─► Vectorize search over the site's own content
                         ─► answer from retrieved chunks only (Llama 3.1 8B, -fast variant)
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
| One short chat, Llama 3.1 8B -fast (~600 tokens in/out) | ~50 neurons |
| **One answered question, total** | **~55 neurons** |
| **Capacity on 10,000/day** | **~180 questions/day** |
| Same chat on Llama 3.3 70B | ~10× more → only dozens/day |

That is why the 8B -fast model is the default (`CHAT_MODEL` in `wrangler.toml`; the original `@cf/meta/llama-3.1-8b-instruct` and its -fp8 variant were deprecated by Cloudflare on 2026-11-20)
and Groq is the overflow: Groq's free tier allows **1,000 requests/day and
100k tokens/day on Llama 3.3 70B** (14,400/day on 8B), no card required.
For a personal portfolio's traffic, this is comfortably $0.

## Setup status (updated 2026-11-20)

**Deployed and verified live on 2026-11-20** (via the Cloudflare API):
worker `patrice-chat` at patrice-chat.patricemirindi.workers.dev, Vectorize
index `patrice-chat-index` (1024, cosine), AI + INDEX bindings, ADMIN_TOKEN
secret set, first reindex done (141 chunks), /chat verified in EN and FR
with correct employer-privacy behaviour.

Still open:
- [ ] Optional: set the `PRIVATE_TERMS` secret (dashboard) as a backstop filter.
- [ ] Optional: set `GROQ_API_KEY` (free at groq.com) to enable overflow +
      research mode — currently off.
- [ ] Optional: create the KV namespace for the rate-limit / budget guards.
- [ ] **Turn-on:** set `WORKER_URL` in `docs/assets/js/knowledge-chat.js` —
      sequenced after the About-flow and AI PRs merge.
- [ ] Re-run POST /admin/reindex whenever site content changes
      (or use `tools/build_chat_index.py` offline instead).

For reference, the original one-time steps were: free Cloudflare account →
create the Vectorize index → set secrets (never in chat or the repo) →
deploy → reindex → set WORKER_URL.

## Files

- `src/index.js` — the worker (chat, research, reindex, guards).
- `wrangler.toml` — config template; no secrets, no account IDs.
- `../tools/build_chat_index.py` — offline indexing alternative.
