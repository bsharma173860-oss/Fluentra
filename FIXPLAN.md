# Fluentra — End-to-End Real Plan

Goal: every page real and working end-to-end. No fabricated data anywhere. Social, voice,
exams, and mobile all real. MVP-real (real data, secure RLS, real-time where needed) —
polished iteratively after.

## Build / deploy workflow (every change)
1. Pull → edit → transpile-check each JSX with @babel/standalone.
2. `node build.mjs` → `node --check dist/assets/app.bundle.js`.
3. Bump `window.__FL_BUILD` in `redesign/backend.js` **by literal match** + verify it changed.
4. Commit as noreply author, push to main.
5. Bharat deploys from Mac: `git pull` → `vercel --prod`. Verify `window.__FL_BUILD` in console.

---

## PHASE 1 — Hub tabs + small data fixes  (S)
- [x] Hub **Stats** tab: replace static `langPack` score + fake "+0.5" delta with real per-module
      best/avg, total sessions, and real trend from `window.__results`.
- [x] Hub **Study** tab: replace placeholder cards with real entry points (Course, Grammar,
      Vocab, recent lessons) + real recent activity for that language.
- [x] Mobile-v5 **checkout** price: `$14.99/$99` → real `$24/mo`, `$228/yr` from pricing constants.

## PHASE 2 — Exam meta-pages  (M)
Runner is already real (chains real modules). 
- [x] (already real) Exam section saves with `detail.exam = true` + an exam run id.
- [x] **Exam history**, **ExamResults** (exam/monthly/mock/practice), and **hub exams tab** all read real mock_exam rows.
- [x] Exam start funnels into the real runner; history/hub CTAs say "Take a mock now." (exam_book registration page still fake — minor, Phase 3.)

## PHASE 3 — Honesty cleanup  (S)
- [ ] Remove `states` (dev UI gallery) from production routing.
- [ ] Marketing fabricated stats (4,200 schools / 380 companies / 4,200 articles) → real or remove.
- [ ] Help FAQ: verify claims (active-language limits, "Lía" name) and correct.

## PHASE 4 — Social backend (real, Supabase + RLS + Realtime)  (L)
No new serverless functions — talk to Supabase directly from client with RLS (like languages/results).
Bharat runs the SQL migrations below in Supabase SQL editor.

- [ ] **Public profiles**: add public fields + RLS read policy. Build real public_profile page.
- [ ] **Friends/follows**: `friendships` table + RLS. Real follow/unfollow, friends list.
- [ ] **Leaderboard**: real ranking query aggregating scores. Replace mock ranks everywhere.
- [ ] **DMs**: `messages` table + Supabase Realtime subscription for live chat.
- [ ] **Activity feed**: `activity` table (or derived from friends' results). Real feed.
- [ ] **Phrasebook**: `phrases` table (save/list/practice).
- [ ] **Refer**: `referrals` table + per-user code.

### SQL migrations (Bharat runs these — exact SQL provided per item when we build it)
- profiles: add `display_name`, `is_public`, `bio`, `avatar_url` (+ RLS public read when is_public).
- friendships(user_id, friend_id, status, created_at) + RLS.
- messages(id, sender_id, recipient_id, body, created_at, read_at) + RLS + Realtime publication.
- activity(id, user_id, type, payload jsonb, created_at) + RLS.
- phrases(id, user_id, lang, term, gloss, created_at) + RLS.
- referrals(user_id, code, invited_count) + RLS.

## PHASE 5 — Voice tutor call  (L)
- [ ] Turn-based real voice reusing Whisper + TTS (speaking-eval infra): record → transcribe →
      tutor reply (/api/tutor) → TTS playback, in target language.

## PHASE 6 — Mobile parity pass  (M)
- [ ] Audit MOBILE_PAGES routes; bring mock mobile screens to parity with the now-real web ones
      (mobile receipts done; check mobile dashboard/hub/settings/exams/social).

---

## Bharat's manual track (gates production; parallel to all phases)
- [ ] Fill legal placeholders (entity, address, contact email) in Terms/Privacy.
- [ ] Remove unverified "SOC 2" claim from marketing/auth.
- [ ] Set `OPENAI_API_KEY` in Vercel (speaking + voice).
- [ ] Stripe products + webhook (docs/STRIPE_SETUP.md).
- [ ] Supabase email: Site URL, redirect allowlist, SMTP (reset/verify emails).
- [ ] Run the Phase 4 SQL migrations (provided per item).
- [ ] Rotate the GitHub token when wrapping up.

## Status log
- b50: hub tutor real, reopen-on-last-page, language count 26.
- b51: Phase 1 done — hub Stats real, hub Study real, mobile checkout price $24/$228.
- b52: Phase 2 done — exam history/results/hub-exams real (runner was already real). FullExamRunner is dead code.
- b53: Phase 3 done — removed dev `states` route; marketing fake metrics (4,200 schools etc.) → real product facts; help FAQ corrected (language limits, exam-score honesty, removed invented streak-freeze/family-plan/pause); tutor persona made consistent (no fictional "Lía").
- b54: Phase 4 foundation — FL.social client + SQL migration (docs/PHASE4_SOCIAL.sql, user must run).
- b55: Phase 4 pages WIRED (web) — Leaderboard (real ranking + your position), Friends (real friends/requests/find-people + add/accept/remove), Public profile (real stats + add/message), DMs (realtime via Supabase Realtime), Activity feed (real), Phrasebook (real save/list/delete), Refer (honest invite link). Activity logged on every mock + lesson completion.
- b56: Phase 5 done — TutorCallPage is a REAL voice call (browser SpeechRecognition → /api/tutor Claude brain → SpeechSynthesis spoken reply, per-language locale/voice, full conversation memory, typed fallback where speech unsupported). TutorHistoryPage now lists real AI-graded speaking/writing sessions.
- (next) Phase 6 — mobile parity: MFriendsPage + mobile social/dashboard/hub/exam screens still mock; bring to parity with real web.
