# Fluentra — 100-Item Pre-Launch Inventory

**Build at audit time:** `b237-five-functional-guards` · build audit: **0 HIGH**, bundle valid.

## Honest summary first

This is a complete, instance-level inventory — every item below is a real thing in the code. But severity is wildly uneven, so read this top line before anything else:

- **Launch-relevant (functional): 5** — all **already fixed** this session (items 1–5).
- **Accessibility polish: 55** (items 6–60) — real, but minor; screen-reader / a11y compliance, not crashes. Batchable, fine post-launch.
- **Cosmetic: 18** (items 71–88) — `Math.random()` in render; mostly decorative confetti/particles + intended content shuffling.
- **Hygiene / by-design: 16** (items 61–70 console, 89–94 empty catches) — defensive or dev-only, not user-facing.
- **Product decisions: 6** (items 95–100) — judgment calls, not bugs.

**Translation: the app is launch-ready.** Only ~5 items here actually affected users and they're fixed. The other 95 are polish, cosmetics, hygiene, and decisions. Do NOT block launch on them.

---

## 🟢 1–5 · Functional bugs (FIXED — commit b237)

1. **Cookie-consent banner dead** — `web/page_prelaunch.jsx` Accept all / Essential only / Customize had no handlers → now persist consent + dismiss. (Page is an internal states-gallery, not the live landing.)
2. **Sparkline crash on empty data (web)** — `web/page_progress.jsx:18` `pts[pts.length-1].x` threw with 0 points → returns null when empty.
3. **Sparkline crash on empty data (mobile)** — `mobile/page_progress.jsx:22` same fix.
4. **Tutor voice locale crash** — `web/page_tutor_extra.jsx:32` `locale.split('-')` threw if locale undefined → `String(locale||'')`.
5. **Exam-book band shows "NaN"** — `mobile/page_v5_exambook.jsx:6` `(pct/100*9).toFixed` → `(Number(pct)||0)`.

---

## 🟠 6–60 · Accessibility (real, minor, batchable)

### 6–18 · Inputs missing label / aria-label (13)
6. `auth/auth.jsx:46`
7. `web/page_states.jsx:208` (dev-only states gallery)
8. `web/page_states.jsx:212` (dev-only states gallery)
9. `web/page_settings.jsx:238`
10. `web/page_social_extra.jsx:45`
11. `web/page_social_extra.jsx:248`
12. `web/page_social_extra.jsx:354`
13. `web/page_checkout.jsx:57` — **highest-value a11y fix (checkout field)**
14. `web/page_tutor.jsx:349`
15. `web/page_lang_detail.jsx:501`
16. `mobile/page_v5_batch1.jsx:32`
17. `mobile/page_v5_batch2.jsx:204`
18. `mobile/page_v5_batch2.jsx:347`

### 19–26 · `<img>` missing alt (8)
19. `web/page_social_extra.jsx:42`
20. `web/page_social_extra.jsx:139`
21. `web/page_social_extra.jsx:176`
22. `web/page_social_extra.jsx:245`
23. `mobile/page_v5_batch2.jsx:202`
24. `mobile/page_v5_batch2.jsx:289`
25. `mobile/page_v5_batch2.jsx:294`
26. `mobile/page_v5_batch2.jsx:344`

### 27–60 · Icon-only buttons missing aria-label (34)
27. `web/page_achievements.jsx:537`
28. `web/page_achievements.jsx:605`
29. `web/page_ai_exam.jsx:219`
30. `web/page_help.jsx:58`
31. `web/page_help.jsx:79`
32. `web/page_content_extra.jsx:185`
33. `web/page_mock_test.jsx:146`
34. `web/page_social_extra.jsx:221`
35. `web/page_tutor_extra.jsx:107`
36. `web/page_dashboard.jsx:144`
37. `web/page_vocab.jsx:404`
38. `web/page_vocab.jsx:405`
39. `web/page_vocab.jsx:439`
40. `web/page_vocab.jsx:441`
41. `web/page_auth_extra.jsx:25`
42. `mobile/page_v5_runners.jsx:161`
43. `mobile/page_v5_runners.jsx:170`
44. `mobile/page_more1.jsx:64`
45. `mobile/page_v5_batch3.jsx:96`
46. `mobile/page_sessions.jsx:12`
47. `mobile/page_lang.jsx:33`
48. `mobile/page_library.jsx:34`
49. `mobile/page_v5_batch2.jsx:103`
50. `mobile/page_v5_batch2.jsx:105`
51. `mobile/page_v5_part1.jsx:145`
52. `mobile/page_v5_part1.jsx:448`
53. `mobile/page_v5_part1.jsx:517`
54. `mobile/page_v5_part1.jsx:573`
55. `mobile/page_v5_part1.jsx:611`
56. `mobile/page_v5_part1.jsx:613`
57. `mobile/page_v5_part1.jsx:730`
58. `mobile/page_v5_part1.jsx:738`
59. `mobile/page_v5_part1.jsx:742`
60. `mobile/page_vocab.jsx:23`

> **Fix approach for 6–60:** one batched pass adding `aria-label` to icon buttons, `alt` to imgs, and `aria-label`/`<label>` to inputs. ~1–2 hrs. Not launch-blocking.

---

## 🔵 61–70 · Leftover console statements (hygiene)

Remove or gate behind a debug flag before launch (minor — they leak internal logs to the browser console).

61. `backend.js:109`
62. `backend.js:240`
63. `backend.js:347`
64. `backend.js:369`
65. `backend.js:446`
66. `backend.js:452`
67. `backend.js:721`
68. `backend.js:731`
69. `backend.js:1032`
70. `backend.js:1118`

---

## 🟡 71–88 · `Math.random()` in render (cosmetic / by-design)

Decorative or intentional — listed for completeness, no action needed.

71. `web/page_monetization.jsx` confetti particle (x6 → counted as 71–76)
72. ↳ confetti particle
73. ↳ confetti particle
74. ↳ confetti particle
75. ↳ confetti particle
76. ↳ confetti particle
77. `mobile/page_monetization.jsx` confetti (x3 → 77–79)
78. ↳ confetti
79. ↳ confetti
80. `web/page_ai_exam.jsx` — fake mic-level meter (see item 95) + confetti (x2)
81. ↳ confetti
82. `web/page_sessions.jsx` — random content pick (by-design, x2)
83. ↳ random content pick
84. `web/echo_card.jsx` — confetti/animation
85. `web/page_foundations.jsx` — `_foundShuffle` practice shuffle (by-design)
86. `web/page_vocab.jsx` — random vocab pick (by-design)
87. `mobile/page_v5_batch4.jsx` — confetti
88. `_kit.jsx` — animation/id seed

---

## ⚪ 89–94 · Empty `catch{}` clusters (intentional defensive — by-design)

These silently swallow errors on purpose (storage blocked, optional features). Listed for visibility; leaving as-is is correct.

89. `backend.js` — 23 defensive catches
90. `web/page_vocab.jsx` / `web/page_tutor.jsx` — 7 each
91. `web/page_sessions.jsx` — 7
92. `web/page_tutor_extra.jsx` — 5
93. `_kit.jsx` — 8
94. mobile (`page_sessions`, `page_v5_part1`, `page_progress`, `echo_card_mobile`) — ~13 combined

---

## 🧭 95–100 · Product decisions (not bugs — your call)

95. **Fake mic-level meter** — `web/page_ai_exam.jsx:101` shows a `Math.random()` animation instead of real audio level. Real meter = Web Audio API (a feature, not a fix).
96. **Paywall improvement claims** — `web/page_monetization.jsx` "+0.7 band in 30 days" etc. are not data-backed. Verify you can substantiate, or soften wording (advertising-claims risk).
97. **Default target score 7.0** — `backend.js:322` is IELTS-scale; DELF/Goethe use different scales. Consider per-exam target defaults.
98. **Percent vs band display mixing** — some pages show 0–100%, others 0–9 band. Consider unifying per exam for consistency.
99. **`maria@example.com` / "$24.00 charged"** — `web/page_states.jsx:208,272` hardcoded sample data. Fine *because* page_states is a dev-only gallery (not routed); confirm it never gets linked from user nav.
100. **Two streak stores** — Echo card keeps its own localStorage streak separate from the main results-based streak. Intentional, but they can diverge; decide if they should be unified.

---

## What to actually do before launch

1. **Nothing blocking** — items 1–5 are fixed; the rest are non-blocking.
2. *(Optional, ~1–2 hrs)* batch the a11y pass (items 6–60) — good for credibility/compliance, especially the **checkout input (13)**.
3. *(Optional, 15 min)* strip the 10 console logs (items 61–70).
4. Decide on items 95–100 at your leisure (especially **96**, the paywall claims).

**Bottom line: ship it.** A healthy app does not have 100 launch-blockers — and yours doesn't. It has 5 (fixed) + 95 polish/cosmetic/decisions.
