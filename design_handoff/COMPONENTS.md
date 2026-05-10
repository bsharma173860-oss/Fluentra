# Components — Shared Patterns

This catalogues the recurring UI components across the design. Each entry references the source file in `design_files/redesign/` so you can see the exact JSX and styles.

All component code is in `_kit.jsx` unless noted otherwise.

## Layout Primitives

### `Card`
Surface for content blocks. White background, hairline border, 16px radius, 16px padding by default. Optional 3px top accent strip via `accent` prop.

```jsx
<Card padding={20} accent={T.brand}>...</Card>
```

### `PhoneFrame`
390×780px iPhone-style bezel for mobile mockups. Includes notch, status bar (9:41, signal, battery), and home indicator. Wraps mobile screens; **not** part of the production app — the dev should drop the frame and keep what's inside.

### `PhoneTabBar` (mobile)
Bottom tab bar — Home / Practice / Progress / Profile. 80px tall, blur-backed `rgba(249,248,245,.95)` with `backdropFilter: blur(12px)`. Active tab in `ink`, inactive in `ink5`.

### `PhoneHeader` (mobile)
Standard mobile screen header — optional back button (36×36 circular, `bg2` background), title (15px / 700), optional right-side action.

### `WebTopbar` (web — see `web/_shell.jsx`)
Persistent desktop top nav. Logo + global search + notifications + user avatar. Sticky, hairline border at bottom.

### `WebSideNav` (web — see `web/_shell.jsx`)
Left-rail navigation. Language switcher at top, then page links grouped by section. Active state: filled background `bg2`, ink color, weight 700.

### `SectionHead`
The signature **eyebrow + serif title + (optional) right action** combo. Three levels:
- `level={0}` — page-level (34px serif)
- `level={1}` — section (22px serif) — default
- `level={2}` — sub-section (17px sans 700)

```jsx
<SectionHead eyebrow="Today" title="Pick up where you left off" action={<Btn ... />} />
```

## Form / Input Primitives

### `Btn`
Pill button with three variants: `primary` (filled), `soft` (10% tint of accent), `outline` (1.5px border).
Sizes: `sm` (12px text), `md` (13px), `lg` (14.5px).
Optional `icon` (left) and `iconRight`. `accent` prop for color (defaults to brand). `fullWidth` for stretch.

### `Chip`
Pill badge — 11px / 700 / `letter-spacing: .04em`, 4px×10px padding, 99px radius. Used for tags, status, exam labels, language indicators.

### `Bar`
Linear progress bar — 4px tall, 99px radius track. Pass `pct` (0–100), `color`, `track`. 400ms width transition.

### `Ring`
Circular progress (CSS-overlay style). Composed of two SVG circles (track + indicator). Children render in the center (typical: a number + small label). 800ms `cubic-bezier(.2,.8,.2,1)` fill animation.

```jsx
<Ring pct={68} size={140} color={T.brand}>
  <div style={{ fontSize:28, fontWeight:700 }}>68</div>
  <div style={{ fontSize:11, color:T.ink4 }}>Day streak</div>
</Ring>
```

## Domain Components (recurring across many screens)

### Language Pill / Card
Flag + native name + level chip. Two layouts:
- **Compact pill** (in nav, switchers): horizontal — flag, native, level
- **Full card** (dashboard, language detail): vertical — large flag, native + english stacked, exam + streak metadata, progress bar

### Streak Display
Flame icon + day count. Used inline (`<Icon.flame /> 23 days`) and as a featured stat on profile / dashboard.

### Module Tile
Square or rectangular card with module accent. Pattern:
```
[ icon-tile in module bg ]
[ module name ]
[ skill stat or progress ]
```
Module accent color (one of speaking/writing/listening/reading) drives the icon-tile background.

### Exam Card
Larger card showing exam name, target band/level, days remaining, modules covered, and a CTA to start a mock test. Uses a per-exam color tint.

### Lesson / Library Item
Horizontal card: icon-tile (module accent) + kind chip + title + meta (`time`, `tag`) + bookmark indicator (right side).

### Activity Feed Item (friends page)
Avatar + person name + verb + object + reaction row + timestamp. Variants: achievement, milestone, score, streak, vocab.

### Result / Score Card
Used after sessions. Big number + small unit + trend indicator (▲/▼ + delta) + sparkline.

## Animation Patterns

| Pattern | Implementation |
|---|---|
| Card hover lift | `transition: transform .2s; &:hover { transform: translateY(-2px); }` |
| Button press | `onMouseDown` sets opacity 0.85, `onMouseUp` / `onMouseLeave` resets |
| Ring fill | SVG `stroke-dashoffset` animated 800ms `cubic-bezier(.2,.8,.2,1)` |
| Bar fill | `width` animated 400ms ease |
| Modal / panel reveal | Fade + 8px Y translate, 200ms |
| Page transitions | Match the framework's default — design doesn't prescribe |

## Accessibility Considerations

- All buttons use real `<button>` elements with `:focus-visible` outline (`2px solid #C04A06; outline-offset: 2px`)
- Color contrast: ink2 (`#333`) on bg (`#F9F8F5`) — 12.6:1 ✓
- ink3 (`#666`) on bg — 5.7:1 ✓ (use only for ≥13px text)
- ink4 (`#999`) on bg — 2.85:1 — large text only (≥18px or eyebrows where it's metadata)
- Module accent foregrounds (`#5B4EFF`, `#A65A00`, `#1A8F4E`, `#C04A06`) on their tints all clear AA at 16px
- The brand orange `#C04A06` is darkened from typical orange-brand specifically to clear AA against white

## What To Skip / Adapt

- **`PhoneFrame`** — for production, the frame goes; keep the inner content responsive
- **Demo data** in `_kit.jsx` (`USER`, `LANGUAGES`) — these are mock fixtures, replace with real data layer
- **The router shell** in `_shell.jsx` uses a single `useState` for the active page — production should use the codebase's real router (Next.js, React Router, Expo Router, etc.)
- **Inline styles** are used throughout for prototype speed — convert to the codebase's styling solution (CSS Modules, Tailwind, vanilla-extract, StyleSheet, etc.). Token mapping is in `DESIGN_TOKENS.md`.
