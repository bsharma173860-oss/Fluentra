# New Screens (added today)

These 7 standalone HTML screens are in `screens/` — they're token-aligned with `tokens.css` and use the same DM Serif Display + Inter pairing as the rest of the system. They're also wired into the main prototype (`Fluentra Web App.html`) under the **★ New today** strip above the toolbar.

Each is **self-contained**: open the HTML file directly to see the design exactly as intended. No JS framework needed — pure HTML + the shared `colors_and_type.css` (copied here as `tokens.css`).

---

## 1. `score-guarantee.html` — Score guarantee promise page
**Purpose:** Convert hesitant users with a CEFR-up-or-refund promise.
**Layout:** Two-column card (1.05fr / 1fr), 920px max width. Left: brand promise + lede + how-it-measures + CTA. Right: 3-step process + testimonial.
**Key elements:**
- Rotating "Score +1 level / or refund" seal (top-right of left panel, dark ink circle, −8° rotation)
- 46px display headline with italic brand-color emphasis (`em` color: `--brand`)
- Steps numbered in 28px brand-filled circles
- Quote block with 3px left border in `--brand`

## 2. `trial-warnings.html` — Trial ending warnings (D5/6/7)
**Purpose:** Three-card escalation as trial ends. Soft → urgent → final.
**Layout:** 3-column grid (1100px max), each card 1fr.
**Escalation:**
- **Day 5** — neutral pill, encouraging copy, locked-in price offer
- **Day 6** — amber pill (#A65A00), countdown `D / H / M` chips on dark ink, annual nudge
- **Day 7** — red pill (#C0392B), dark-red copy `#7A2A1F`, time-limited $79.99 offer
- Each card has a 4px stripe at top in escalating colors (ink5 → amber → red)

## 3. `payment-success.html` — Post-Stripe receipt screen
**Purpose:** Confirm payment + drive to next action.
**Layout:** Centered 540px column on warm gradient background (`#FFF0EE → --bg`).
**Key elements:**
- 80px green circle with checkmark, drop-shadow `0 16px 40px rgba(26,143,78,.3)`
- Confetti spans positioned absolutely (random rotations, 6–14px)
- Receipt card: header (id), 4 rows (plan, payment, renews), totals row in `--bg2`
- 2-up "next action" cards (Pick up Lesson 4 · Refer a friend)
- CTA: "Back to my dashboard →"

## 4. `cancellation.html` — Cancellation flow with save offer
**Purpose:** Retain churning users via loss-aversion + pause-instead.
**Layout:** Single 560px card with progress dots at top (3 segments).
**Key elements:**
- Loss-aversion box in `--brand-soft` listing what they'd lose (streak, vocab, tutor history, B1+ score)
- Reason radio list (5 options)
- Save offer: 2-month pause in warm gradient (`#FFEAC2 → #FFF7E8`)
- Asymmetric CTA: primary "Pause for 2 months" + tertiary red underlined "Cancel anyway →"

## 5. `error-404.html` — Page not found
**Purpose:** Lost-page recovery with quick links.
**Layout:** Centered column.
**Key elements:**
- 160px serif "4*0*4" with middle digit in `--ink5`
- "Lost in translation." headline (32px serif, italics not used)
- Pill-row of 5 quick links (today's lesson, speaking practice, vocab, tutor, help)
- Bottom: monospace meta showing the failed path

## 6. `error-500.html` — Server error
**Purpose:** Honest, calm error with status visibility.
**Layout:** Centered column.
**Key elements:**
- 160px serif "500" in dark red `#7A2A1F`
- Pulsing red status dot (`@keyframes p`, 1.4s) + "Investigating" callout card
- Retry + status-page CTAs
- Monospace request_id at bottom

## 7. `offline.html` — No internet state
**Purpose:** Reassure user, show what's still usable offline.
**Layout:** Centered 440px card.
**Key elements:**
- Wifi-with-slash icon (3 arc paths + 1 dot, with red 2.5px overlay rotated −45°)
- Pulsing red "You're offline" eyebrow
- "Still available offline" list with green checks for cached items, ink5 "Online only" for tutor
- Retry + "Open offline library" stacked CTAs
- Last-synced timestamp at bottom

---

## Tokens used (all from `tokens.css`)

- **Surfaces:** `--bg`, `--bg2`, `--bg3`
- **Ink:** `--ink`, `--ink2`, `--ink3`, `--ink4`, `--ink5`
- **Brand:** `--brand` (#C04A06), `--brand-light`, `--brand-soft`
- **Hairlines / borders:** `--border`, `--hairline`
- **Type:** `--serif-display` (DM Serif Display), `--sans` (Inter)
- **State colors (used inline, not tokenized):**
  - Success green: `#1A8F4E`
  - Warning amber: `#A65A00` / bg `#FFEAC2`
  - Error red: `#C0392B` / dark `#7A2A1F` / bg `#FCE6E2`

## Implementation notes for Claude Code

- These are **static HTML refs** — recreate them as proper components in the target codebase using its established patterns (React Native screens for the mobile app, Next.js pages for web)
- Copy is **final** — use the exact strings shown
- The trial-warnings escalation deserves a single component with a `day` prop driving color, copy, and offer
- The 404/500/offline screens should be the framework's standard error boundaries
- Cancellation flow has 3 progress steps; this file shows step 2 — you'll need step 1 (confirm intent) and step 3 (final farewell + reactivation hook)
