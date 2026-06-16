# Fluentra — Deploy & Verify

## 1. Database (one-time)
In **Supabase → SQL Editor**, paste and run [`db/schema.sql`](db/schema.sql).
Creates the language-partitioned `content` pool + `user_content`, with row-level security.

## 2. Environment variables (Vercel → Project → Settings → Environment Variables)
Add all four for the **Production** environment:

| Name | Value | Used by |
|---|---|---|
| `ANTHROPIC_API_KEY` | your Claude key | grading + content generation |
| `OPENAI_API_KEY` | your OpenAI key | Whisper (speech-to-text) + TTS |
| `SUPABASE_URL` | `https://kbjqmhviuryakfzhhoaz.supabase.co` | content pool reads/writes |
| `SUPABASE_SERVICE_KEY` | Supabase **service_role** secret (Supabase → Settings → API) | server-side DB writes |

> ⚠️ `SUPABASE_SERVICE_KEY` is server-only. It already lives only in `/api/*` functions — never expose it to the client.

## 3. Deploy
Code is on `main`. If the repo is linked to Vercel it auto-deploys on push.
Otherwise: **Vercel → Deployments → Redeploy** (so the new env vars + `/api` functions take effect).

## 4. Verify — turns "built" into "working"
- **Speaking:** open `https://<your-domain>/speaking-test.html` → record an answer → expect a real transcript, band scores, and a spoken examiner reply.
- **Reading:** in-app → a reading session → expect a real generated passage + questions (first load for a new language/difficulty takes a few seconds while it generates and pools).
- **Writing:** a writing session → submit text → expect real bands + corrections.
- If any call 500s, check **Vercel → Deployments → Functions logs** — almost always a missing/incorrect env var or the schema not yet run.

## What this verifies vs. what's still left
Verifies the **foundation**: speaking, reading, writing against real Claude/Whisper + the content pool.
Still leftover (mock/static or unbuilt): vocab & listening flows, library on real data, streaks/leaderboard, the social layer (friends, posts, messaging), billing, and the dead-end pass across the remaining pages.
