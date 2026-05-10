# Screens — Per-Screen Specification

Every screen in the prototype, what it does, and what to build. Source files are under `design_files/redesign/`.

---

## Marketing & Auth

### 1. Marketing landing page
**File:** `web/page_marketing.jsx`
**Purpose:** Public homepage, drives sign-up.
**Layout (top → bottom):**
- Sticky transparent nav — logo, nav links, "Sign in" + "Start free" CTA
- Hero — large serif h1 ("Speak by summer."), subhead, primary + secondary CTAs, angled phone mock with floating chips (streak indicator, AI tutor preview)
- Exam logos strip — 5 exam logos in muted ink4, hairline-bordered band
- Method grid — 4 skill cards (Reading / Listening / Speaking / Writing), each with module accent, icon, and 1-line description
- Three alternating feature blocks — AI tutor, exam prep, vocab system; each is a 2-col split (copy + visual mock), alternating image side
- Testimonials — 3 cards with stat tag, quote, person + role + avatar
- CTA band — `brandGrad` background, large serif "Speak by summer.", primary + ghost CTA
- Footer — 4 columns (Product, Languages, Resources, Company), brand mark + legal at bottom

### 2. Auth — Login / Signup / Onboarding
**File:** `auth/auth.jsx`
**Variants:** `AuthLoginDesktop`, `AuthSignupDesktop`, `AuthOnboardingDesktop`, plus mobile equivalents (`LoginMobile`, `SignupMobile`, `AuthOnboardingMobile`).
**Layout:** Split screen — left side `bg2` panel with brand mark + serif tagline + decorative typography, right side white form panel (email + password + social buttons).

### 3. Onboarding (in-product, 8 steps)
**File:** `web/page_onboarding.jsx`
**Purpose:** New-user flow after signup.
**Steps:** Welcome → Pick language → Pick goal → Motivations (max 3) → Self-rated level → 5-question placement check → Daily commitment + reminder time → Personalized plan reveal.
Each step centered card on tinted bg, progress dots above, primary CTA at bottom. Step 8 reveals a "first-week" mini-calendar.

---

## Core App — Dashboard & Languages

### 4. Dashboard (web)
**File:** `web/page_dashboard.jsx`
**Purpose:** Daily home. Pick up where you left off, see today's plan, current streak, all your languages.
**Layout:** 12-col grid.
- Hero row: serif greeting ("Good morning, María.") + date eyebrow
- Today section: 3-card row — Continue session, Daily goals (with rings), AI tutor card
- Languages row: horizontal scroll of language cards (full layout — flag, native, exam, streak, level bar)
- Recent activity feed + Right-rail: Streak card, weekly goal ring, leaderboard chip

### 5. Dashboard (mobile)
**File:** `mobile/page_dashboard.jsx`
**Layout:** Vertical stack inside `PhoneFrame`. Same content as web, single-col.

### 6. Language detail page
**File:** `web/page_lang_detail.jsx`
**Purpose:** Hub for one language — current course, recent sessions, exam progress, vocab decks.
**Layout:** Hero band tinted with `langTheme(code).bg`, large flag + name + level chip + streak. Below: 2-col grid — Course card (current unit + lesson list) + sidebar (Exam progress, Vocab, Notes).

### 7. Language detail (mobile)
**File:** `mobile/page_lang.jsx`
Single-col, same content adapted for narrow width.

### 8. Course overview
**File:** `web/page_course.jsx`
**Purpose:** Full course / lesson plan view for a language.
**Layout:** Tree of units → lessons. Each unit shows progress, expand/collapse. Lesson rows show duration, skills covered, completion state (locked / available / done).

---

## Practice & Sessions

### 9. Practice hub (web)
**File:** `web/page_practice.jsx`
**Purpose:** Pick what to practice. Quick start tiles + recommended drills.
**Layout:** Top: 4 large module tiles (Reading / Listening / Speaking / Writing) each with module accent. Below: "Recommended for you" carousel, "By topic" grid.

### 10. Practice hub (mobile)
**File:** `mobile/page_practice.jsx`

### 11–14. Session screens (Reading / Listening / Speaking / Writing)
**File:** `web/page_sessions.jsx` — exports `ReadingSession`, `ListeningSession`, `SpeakingSession`, `WritingSession`.
**Purpose:** The actual practice experience for each skill.
- **Reading:** Two-column — passage on left, question stem + options on right. Per-paragraph highlighting on hover.
- **Listening:** Audio player + transcript reveal + question. Big play button, waveform visualization, speed controls.
- **Speaking:** Centered — prompt at top, big circular record button, waveform visualization while recording, AI feedback panel after.
- **Writing:** Editor with prompt above, word/char counter in the corner, "Get feedback" CTA → side panel with rubric scoring.

All four use the same chrome: progress bar at top showing current question / total, exit button (top-left), context (skill, level, time elapsed) in the title bar.

### 15. Module results
**File:** `web/page_module_results.jsx`, mobile mirror exported as `MModuleResultsPage`.
**Purpose:** Score breakdown after a session.
**Layout:** Big score number (serif), trend chip (▲ +4 vs last), 4 sub-scores in a grid (e.g. for Speaking: Fluency / Pronunciation / Grammar / Vocab), per-question review list, "Try another" CTA.

### 16. Grammar
**File:** `web/page_grammar.jsx`
**Purpose:** Grammar reference / drill index. Topic categories on left rail, lesson cards in main area.

### 17. Vocab (web + mobile)
**Files:** `web/page_vocab.jsx`, `mobile/page_vocab.jsx`
**Purpose:** Spaced-repetition deck management. Decks list, due cards count, study session entry.

---

## Exam Prep

### 18. Exams hub (web)
**File:** `web/page_exams.jsx`
**Purpose:** All exams, target dates, mock test history, prep plan.
**Layout:** Hero with countdown to next exam, then exam cards (one per exam — IELTS, DELE, JLPT, DELF), each showing target band, modules covered, mock test history sparkline.

### 19. Exams (mobile)
**File:** `mobile/page_exams.jsx`

### 20. Exam entry
**File:** `web/page_exam_screens.jsx` — `ExamEntry`
**Purpose:** Pre-test screen. Choose exam, choose modules, choose timed/untimed, start.

### 21. Full exam runner
**File:** `web/page_exam_screens.jsx` — `FullExamRunner`
**Purpose:** Live test. Top bar with module + remaining time + question count. Question pane in middle. Answer pane on right.

### 22. Exam results
**File:** `web/page_exam_screens.jsx` — `ExamResults`
**Purpose:** After-test report. Estimated band score, per-module breakdown, comparison to previous attempts, weakest topics, plan adjustment CTA.

---

## Progress & Stats

### 23. Progress (web)
**File:** `web/page_progress.jsx`
**Purpose:** Long-range stats. Hours per language, level progression timeline, streak history calendar, skill radar chart.

### 24. Progress (mobile)
**File:** `mobile/page_progress.jsx`

### 25. Achievements
**File:** `web/page_achievements.jsx`
**Purpose:** Badge / milestone grid. Earned (bright) vs locked (faded). Filter by category. Recent unlocks at top.

### 26. Leaderboard
**File:** `web/page_leaderboard.jsx`, mobile mirror `MLeaderboardPage`.
**Purpose:** Compare with friends + global. Podium for top 3, your-rank card, full table, filter chips (region / time window / module), country leaderboard, friends panel on right rail.

---

## Library & Discovery

### 27. Library (web)
**File:** `web/page_library.jsx`
**Purpose:** Saved lessons, audio, phrasebooks, articles.
**Layout:** Featured editorial banner at top → Collections grid (6 squares, module accents) → "Recently saved" filter chips + 2-col list of lesson items.

### 28. Library (mobile)
**File:** `mobile/page_library.jsx`

### 29. Search results
**File:** `web/page_search.jsx`
**Purpose:** Global search across content. Tabs (All / Lessons / Audio / Vocab / People), result cards grouped by type, "Recent searches" shown when input empty.

---

## Social

### 30. Friends / feed
**File:** `web/page_friends.jsx`
**Purpose:** Activity feed + friend management.
**Layout:** Three-column desktop —
- Left: feed (achievement / milestone / score / streak / vocab cards, each with reactions)
- Middle: online friends list + weekly comparison bars
- Right rail: pending requests, suggested people, study clubs
Mobile collapses to Feed/Friends/Discover tabs.

### 31. AI tutor chat
**File:** `web/page_tutor.jsx`
**Purpose:** Chat with the AI tutor.
**Layout:** Three-column —
- Left: history sidebar grouped by Today/Yesterday/Earlier + monthly usage meter
- Middle: chat (rich bubbles with markdown bolds, blockquotes, suggested actions, reactions, typing indicator), quick prompts above composer when empty
- Right: context panel — active topic, key takeaways, suggested next lesson
Mobile: single column with slide-over history.

---

## Account & System

### 32. Settings (web + mobile)
**Files:** `web/page_settings.jsx`, mobile mirror `MSettingsPage`.
**Sections (left rail):** Profile / Account / Subscription / Notifications / Privacy / Languages / Appearance / Help. Right pane shows the active section's form.

### 33. Notifications
**File:** `web/page_notifications.jsx`
**Purpose:** Inbox of notifications. Filter chips at top (All / Streaks / Friends / System), notification rows with avatar/icon + body + timestamp + action button.

### 34. Pricing
**File:** `web/page_pricing.jsx`
**Purpose:** Free / Pro / Teams comparison. 3-col table, monthly/yearly toggle, feature checklist, FAQ below.

### 35. Help & support center
**File:** `web/page_help.jsx`
**Purpose:** Self-serve help.
**Layout:** Hero with prominent search + "Ask Lía" shortcut → Popular articles row → 10-category grid → 6-question expandable FAQ → Guided troubleshooter + system status sidebar → 3-channel contact strip (chat / email / community).

### 36. Empty / Loading / Error states
**File:** `web/page_states.jsx`
**Purpose:** Catalog of state visuals.
**Includes:** First-run empty (no data yet), no-internet error, loading skeletons, 404, generic error, success confirmations. Each is a centered illustration + headline + body + CTA pattern.

---

## Notes For Implementation

### Routing
The prototype uses a single `useState` to switch pages inside `_shell.jsx`. In production, every screen above should be its own route. Suggested route table (web):

```
/                        → marketing
/login, /signup          → auth
/onboarding              → onboarding flow
/app                     → dashboard
/app/lang/:code          → language detail
/app/lang/:code/course   → course overview
/app/practice            → practice hub
/app/practice/:skill     → session (reading|listening|speaking|writing)
/app/practice/:skill/results/:id → module results
/app/grammar             → grammar
/app/vocab               → vocab
/app/exams               → exams hub
/app/exams/:id/start     → exam entry
/app/exams/:id/run       → exam runner
/app/exams/:id/results   → exam results
/app/progress            → progress
/app/achievements        → achievements
/app/leaderboard         → leaderboard
/app/library             → library
/app/search?q=…          → search
/app/friends             → friends / feed
/app/tutor               → AI tutor chat
/app/notifications       → notifications
/app/settings            → settings (with /:section sub-routes)
/pricing                 → pricing
/help                    → help center
```

### Data dependencies (suggested API surface)
- `GET /me` → user, plan, streaks per language
- `GET /languages` → list of user's languages with level + exam target
- `GET /lang/:code/course` → unit/lesson tree
- `GET /lang/:code/recent` → recent sessions
- `POST /session/start` → start a practice session, returns session-id and first item
- `POST /session/:id/answer` → submit answer
- `POST /session/:id/finish` → finalize, returns score breakdown
- `GET /exams` → exams + history
- `GET /vocab/:deck` → flashcards due
- `POST /vocab/review` → SRS update
- `GET /feed` → social feed
- `POST /tutor/message` → AI tutor turn
- `GET /achievements` → earned + available
- `GET /leaderboard?scope=&window=` → ranked list
- `GET /library?filter=` → saved content

These are suggestions — adapt to whatever the backend provides.

### Mobile coverage
The mobile design only covers a subset (Dashboard, Language, Practice, Library, Progress, Exams, Vocab, Settings, Module Results, Leaderboard, plus auth + onboarding). For other screens (Tutor, Friends, Achievements, Course, Grammar, Search, Notifications, Help, Marketing, Pricing, Sessions, Exam runner, States), the desktop design adapts responsively or is desktop-first — confirm with design which mobile-only screens need bespoke layouts before the mobile build kicks off.
