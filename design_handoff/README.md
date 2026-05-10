# Fluentra — Claude Code Handoff

## What this is

A complete design reference for **Fluentra**, a multi-language learning platform (web + mobile). Inside this bundle you have:

- **`tokens.css`** — every design token (colors, type, spacing, radii, shadows, motion) as CSS custom properties
- **`preview/`** — 43 standalone HTML cards, one per token group / component, showing exact visual specs
- **`prototypes/`** — full working HTML prototypes (`Fluentra Web App.html` + the `redesign/` folder of JSX page modules) showing every screen and how components compose
- **`ui_kits/`** — runnable React-via-Babel kits for `web` and `mobile` you can lift code from

> **Important:** the HTML files are **design references**, not production code. Your job is to **recreate this design in the target codebase's stack** (React Native + Expo Router for the existing app, or whatever stack the team uses) using their established patterns, component library, and conventions. Do not paste these HTML files into the app.

## Fidelity

**High-fidelity.** Every spec — colors, type sizes, spacing, border radii, shadows, motion durations, copy — is final. Implement pixel-perfect.

## Tech stack assumptions

The existing app is **Expo + React Native + expo-router** (see `app/(auth)/login.tsx`, `app/(tabs)/_layout.tsx` etc. in the repo). Theme lives in `constants/colors.ts`, `constants/theme.ts`, `constants/languageThemes.ts`. Web uses `components/ui/WebDashboard.tsx` when `Platform.OS === 'web' && width >= 1024`.

When implementing:
- Map CSS tokens in `tokens.css` to `Colors` and theme objects in `constants/`
- Use `react-native-svg` for icons (already a dep) — see `components/icons.tsx`
- DM Serif Display + Inter — load via `expo-font` (Google Fonts source)
- Reuse existing primitives in `components/ui/` (Button, Card, ProgressBar, etc.) before creating new ones

## Design tokens (single source of truth)

All values are in **`tokens.css`** and documented in **`DESIGN_TOKENS.md`**. Highlights:

### Brand
- `--brand: #C04A06` — deep orange, all CTAs and focus rings
- `--brand-soft: #FFF0EE`, `--brand-light: #FFE5DE`
- `--brand-grad: linear-gradient(135deg, #C04A06, #E8732F)`

### Surfaces (warm off-white system — **never pure white as page bg**)
- `--bg: #F9F8F5` (page) · `--bg2: #F4F1EB` (chips) · `--bg3: #EDEAE3` (canvas)
- `--card: #FFFFFF` · `--paper: #FFFEFA` (reading mode)

### Ink (pure neutral, NOT gray-blue)
- `--ink: #000000` · `--ink2: #333` · `--ink3: #666` · `--ink4: #999` · `--ink5: #BBB`

### Module accents (one per skill — used for icon swatches and skill-coded UI)
- Speaking `#5B4EFF` purple · Writing `#A65A00` gold · Listening `#1A8F4E` green · Reading `#C04A06` (= brand)

### Language themes (background + accent per language)
- Spanish 🇪🇸 — bg `#FFF0EE`, accent `#C04A06`
- Japanese 🇯🇵 — bg `#FFF0F5`, accent `#C84070`
- French 🇫🇷 — bg `#EEF4FF`, accent `#1558B0`
- German 🇩🇪 — bg `#FFF7E8`, accent `#A65A00`
- English 🇬🇧 — bg `#EEEDFF`, accent `#5B4EFF`

### Type
- **Display:** `DM Serif Display`, weight 400 — page titles, hero, vocab cards, scores
- **UI:** `Inter`, weights 400/500/600/700 — everything else
- Scale: hero 62 / page 34 / section1 22 / section2 17 / card 15 / body 14 / body-sm 13 / meta 12 / eyebrow 11 / chip 11

### Spacing — strict 4px grid (`--s-1` through `--s-12`)
### Radii — pill 99 / lg 18 / md 16 / sm 14 / xs 10 / tile 9
### Shadows — system is **shadow-light**; prefer 1px hairline borders. Only `--shadow-floating` and `--shadow-phone` should appear in product UI.

## Components — what's in `preview/`

Open each `.html` in a browser to see the exact reference. **43 cards total.**

### Foundations (10)
`type-signature` · `type-display-scale` · `type-body-scale` · `type-families` · `colors-surfaces` · `colors-ink` · `colors-brand` · `colors-modules` · `colors-languages` · `spacing-scale` · `radii` · `shadows`

### Form components (7)
`components-input-states` — text input default/focus/error + textarea with character counter
`components-select` — native `<select>` + custom dropdown menu with check
`components-checkbox-radio` — checkbox on/off/indeterminate + radio group
`components-toggle-segmented` — switch + segmented pill control
`components-slider` — range slider with knob + tick labels
`components-datepicker` — picker fields + month grid with date range
`components-upload-record` — drop zone, file accepted, live mic recorder

### Feedback (6)
`components-toast` — success / info / error toasts, dark-bg
`components-alert` — info / success / warning / error inline banners
`components-modal-sheet` — confirm dialog + bottom action sheet
`components-tooltip-popover` — small dark tooltip + word-definition popover
`components-empty-error` — empty states + system error card
`components-skeleton-loading` — list skeleton, chart skeleton, spinner

### Navigation (3)
`components-tabs` — underline tabs + segmented pill
`components-breadcrumbs-pagination` — trail + numbered pager
`components-nav` — desktop sidebar + mobile bottom tab bar

### Data display (3)
`components-table-accordion` — data table + FAQ disclosure
`components-avatar-badge` — avatars (sm/md/lg), stack, status dot, badges, counters
`components-stat-divider` — KPI stat cards (light + dark) + dated section dividers

### Existing component cards (5)
`components-buttons` — primary / soft / outline / ghost in 3 sizes
`components-chips` — language chip, skill chip, level chip
`components-cards` — language card + lesson card
`components-progress` — bar, ring, score, streak meter
`components-language` — full language card with hero gradient + ring + stats
`components-icons` — full icon set
`components-inputs` — basic input row (superseded by `components-input-states`)

### Fluentra-domain components (5)
`components-audio-mic` — listening waveform player + 3 mic states (idle / live / done)
`components-streak-xp` — streak flame, XP pill, level pill, CEFR band, daily-goal ring
`components-flashcard` — vocab front/back card with SRS (Again/Hard/Good/Easy) actions
`components-exam-question` — multi-choice question + listen-and-fill question with audio waveform
`components-tutor-chat` — AI tutor chat: bubbles, gentle corrections (highlight wrong + suggest), typing indicator

## Screens — recreate from `prototypes/Fluentra Web App.html`

Open the prototype, then refer to `SCREENS.md` for per-screen specs. Major surfaces:

- **Auth:** marketing / login / signup / onboarding (5-step) / language picker
- **Web shell:** sidebar + topbar + main pane
- **Dashboard:** continue-learning hero, today's mission, streak band, weekly stats, recommended sessions
- **Language detail:** hybrid card with gradient hero + white sheet + level ring + stats
- **Practice:** skill grid (Speaking / Listening / Reading / Writing) with module accents
- **Library, Vocab, Sessions, Exams, Tutor, Progress, Course, Grammar, Help, Pricing, Notifications, Search, Achievements, Leaderboard, Friends, Settings, Marketing**
- **Mobile:** phone shell + matching mobile pages
- **System pages:** loading / empty / error / paywall / 404

## Interactions & motion

- Default ease: `cubic-bezier(.2, .8, .2, 1)` (`--ease-fluid`)
- Hover transitions: `200ms` (`--dur-hover`)
- State changes (panel switches, page transitions): `400ms` (`--dur-state`)
- Streak / score rings on appear: `800ms` (`--dur-ring`) ease-out, animate `stroke-dashoffset`
- Mic "live" state: pulsing box-shadow ring, 1.4s infinite
- Skeleton: shimmer gradient sweeping right→left, 1.4s infinite
- Toast enter: fade + slide up 8px over 200ms; auto-dismiss after 4s unless action present
- Modal: backdrop fade 200ms; modal scale 0.96→1 + fade 200ms

## Voice & tone (copy)

- **Editorial, warm, specific.** Not gamified-cute, not corporate.
- Numbers are tabular and precise: "23-day streak", "B1+", "12 min today" — never "lots of", "many"
- CTAs are verbs: "Start free", "Continue", "Save phrase", "Join now"
- Errors are honest and instructive: "Microphone blocked — allow mic access in your browser to start the speaking lesson"
- Tutor speaks the target language naturally and corrects gently in the user's native language
- Eyebrows are short and uppercase-tracked: "TODAY", "B1 · SPANISH", "LIVE"

## Accessibility

- Focus ring: `2px solid var(--brand)`, `outline-offset: 2px` — visible on `:focus-visible` only
- Min hit target: 44×44 (mobile), 32×32 (desktop)
- Body text contrast: `--ink2 #333` on `--bg #F9F8F5` = AA at all sizes
- Tabular numbers for any value that updates (streaks, timers, counts) via `font-variant-numeric: tabular-nums`
- All buttons have an accessible name; icon-only buttons need `aria-label`
- All form fields have an associated `<label>`; helper / error text linked via `aria-describedby`
- Mic recording state must be announced to screen readers (`aria-live="polite"`)

## What to build first (suggested order)

1. **Token mapping** — port `tokens.css` into the app's theme objects (`constants/colors.ts`, etc.). Verify colors render identically.
2. **Base primitives** — Button, Input, Card, Avatar, Badge, ProgressBar — these are everywhere.
3. **Layout shell** — sidebar (web), bottom tabs (mobile), topbar.
4. **Domain primitives** — StreakChip, XPPill, BandScore, AudioPlayer, MicRecorder, Flashcard.
5. **Dashboard** — the highest-traffic screen; once this looks right the rest fall into place.
6. **Practice flows** — Speaking, Listening, Reading, Writing modules using the domain primitives.
7. **Tutor + Exams** — most interaction-heavy; build last.

## Files in this bundle

```
tokens.css                  — all design tokens
DESIGN_TOKENS.md            — token reference doc
SCREENS.md                  — per-screen specs (every page in the prototype)
COMPONENTS.md               — shared component patterns
preview/                    — 43 component & token preview cards (HTML)
prototypes/
  Fluentra Web App.html     — full working web prototype (entry)
  redesign/                 — JSX modules for every page
ui_kits/
  web/                      — runnable React/Babel UI kit (web)
  mobile/                   — runnable React/Babel UI kit (mobile)
assets/                     — app icons (icon, adaptive, favicon, splash)
```

## Caveats

- **DM Serif Display + Inter are loaded from Google Fonts in the prototype.** The production app should bundle them locally via `expo-font` for offline + reliability.
- **No dark mode tokens** in this system. The app's `useColorScheme()` hook exists but isn't wired to a dark token set. Decide with design before shipping a dark theme.
- **Old `Fluentra Design System.html`** at the repo root used a pre-rebrand purple `#5B4EFF` accent. Ignore it — `--brand: #C04A06` is current.
- **Logo:** only PNG app icons exist (`assets/icon.png` etc.). No scalable wordmark SVG yet — design is still drawing it inline as text via `components/FluentraLogo.tsx`.
