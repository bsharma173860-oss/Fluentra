# Design Tokens

All values pulled from `design_files/redesign/_kit.jsx` (the `T` object).

## Colors

### Surfaces
| Token | Hex | Usage |
|---|---|---|
| `bg` | `#F9F8F5` | Default page background — warm off-white |
| `bg2` | `#F4F1EB` | Secondary surface (chips, subtle panels) |
| `bg3` | `#EDEAE3` | Tertiary surface (containing layout / canvas) |
| `card` | `#FFFFFF` | Card / panel background |
| `paper` | `#FFFEFA` | Editorial / reading-mode surface |

### Borders & Hairlines
| Token | Hex | Usage |
|---|---|---|
| `border` | `#EAEAEA` | Default card / divider border |
| `hairline` | `#F4F4F4` | Subtle internal dividers |
| `track` | `#F2F2F2` | Progress-bar track (cool) |
| `trackWarm` | `#F4F4F0` | Progress-bar track (warm — pairs w/ off-white bg) |

### Text (Ink scale — pure neutral, not gray-blue)
| Token | Hex | Usage |
|---|---|---|
| `ink` | `#000000` | Primary text, headlines |
| `ink2` | `#333333` | Body text |
| `ink3` | `#666666` | Secondary / supporting text |
| `ink4` | `#999999` | Muted / metadata |
| `ink5` | `#BBBBBB` | Disabled / very muted |

### Brand
| Token | Hex | Usage |
|---|---|---|
| `brand` | `#C04A06` | Primary brand orange — used for primary CTAs, focus rings, key accents |
| `brandSoft` | `#FFF0EE` | Brand tint for soft-fill buttons |
| `brandLight` | `#FFE5DE` | Brand tint for badges / chips |
| `brandGrad` | `linear-gradient(135deg, #C04A06, #E8732F)` | Hero / marquee surfaces |

### Module Accents (one per skill)
Each module has `c` (foreground/icon color) and `bg` (10–15% tint background).

| Module | `c` | `bg` |
|---|---|---|
| Speaking | `#5B4EFF` (purple) | `#EEEDFF` |
| Writing | `#A65A00` (gold) | `#FFEAC2` |
| Listening | `#1A8F4E` (green) | `#E2F5E9` |
| Reading | `#C04A06` (orange = brand) | `#FFE5DE` |

### Per-Language Themes
Each language has `bg` (page tint), `accent` (primary accent), `accentLight` (chip / pill bg).

| Lang | `bg` | `accent` | `accentLight` |
|---|---|---|---|
| `es` Spanish | `#FFF0EE` | `#C04A06` | `#FFE5DE` |
| `ja` Japanese | `#FFF0F5` | `#C84070` | `#FFE0EC` |
| `fr` French | `#EEF4FF` | `#1558B0` | `#DDEEFF` |
| `de` German | `#FFF7E8` | `#A65A00` | `#FFEAC2` |
| `en` English | `#EEEDFF` | `#5B4EFF` | `#DDDBFF` |

## Typography

### Font Families
- **Serif:** `'DM Serif Display', serif` — used for editorial headlines, page titles, hero h1
- **Sans:** `'Inter', sans-serif` — everything else (body, UI, labels, numbers)

Load via Google Fonts:
```html
<link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
```

### Type Scale (observed across screens)
| Role | Size | Weight | Family | Line height |
|---|---|---|---|---|
| Hero h1 (marketing / dashboard headline) | 38–62px | 400 | Serif | 1.05 |
| Page title (section level 0) | 34px | 400 | Serif | 1.1 |
| Section title (level 1) | 22px | 400 | Serif | 1.1 |
| Section title (level 2) | 17px | 700 | Sans | 1.2 |
| Card title | 13–15px | 600–700 | Sans | 1.25 |
| Body | 13–14px | 400 | Sans | 1.5 |
| Secondary body | 13px | 400 | Sans (color: `ink3`) | 1.5 |
| Eyebrow / label | 11px | 700 | Sans, uppercase, `letter-spacing: .1em`, color `ink4` |
| Metadata | 10.5–12px | 400–600 | Sans, color `ink4` |
| Chip text | 11px | 700 | Sans, `letter-spacing: .04em` |
| Button (md) | 13px | 700 | Sans |
| Button (lg) | 14.5px | 700 | Sans |
| Number badges (streak counts etc.) | 13–28px | 700 | Sans, tabular |

### Special: serif-on-sans pattern
Page headers commonly mix:
- Eyebrow (11px Inter 700, uppercase, ink4) +
- Title (22–34px DM Serif Display 400, ink) +
- Subtitle (13px Inter 400, ink3)

This trio is the editorial signature of the brand — see `SectionHead` in `_kit.jsx`.

## Spacing

The design uses **multiples of 4px**, with these common values: `4, 6, 8, 10, 12, 14, 16, 20, 24, 28, 32, 36, 40, 48`.

Page-level scale:
- **Desktop page padding:** `28px 36px 40px` (top / sides / bottom)
- **Card internal padding:** `16px` default, `20–24px` for feature cards, `32–36px` for hero panels
- **Section gap:** `28–32px` between major sections
- **Stack gap:** `12px` between sibling cards in a list

## Border Radius

| Token | Value | Usage |
|---|---|---|
| Pill | `99px` | Chips, badges, buttons (rectangular) |
| `lg` | `18px` | Hero panels, banners |
| `md` | `16px` | Standard cards |
| `sm` | `14px` | Inner cards, list items |
| `xs` | `10px` | Buttons, small surfaces |
| Icon tile | `9–10px` | Module icon swatches |

## Shadows

The system is **shadow-light**. Most cards use a hairline border instead.

| Use | Value |
|---|---|
| Phone frame (mockup) | `0 30px 80px rgba(0,0,0,.28), 0 0 0 1px rgba(0,0,0,.04)` |
| Floating panel (toolbar, dropdown) | `0 4px 16px rgba(0,0,0,.08), 0 0 0 1px rgba(0,0,0,.04)` |
| Sticky nav (when scrolled) | `0 1px 0 rgba(0,0,0,.06)` |

## Iconography

All icons are inline SVG, **24×24 viewBox**, **2px stroke**, `stroke-linecap: round`, `stroke-linejoin: round`, `fill: none`. Color follows `currentColor`.

Default render size is **14×14**, with explicit overrides for nav (22×22) and feature blocks (15–18px).

The full set is enumerated in `_kit.jsx` `Icon` map. Categories:
- **Skills:** `mic`, `pen`, `book`, `head`
- **Nav:** `home`, `bars`, `user`, `users`, `globe`, `cog`, `bell`, `search`
- **Actions:** `arrow`, `arrowL`, `chev`, `chevD`, `chevU`, `plus`, `x`, `check`, `play`, `pause`, `send`, `refresh`, `download`, `edit`, `more`
- **State / meta:** `flame` (streak), `spark` (XP / sparkle), `clock`, `cal`, `trophy`, `star`, `bookmark`, `award`, `lock`, `eye`, `shield`, `card`, `trending`, `filter`, `layers`, `message`, `bookOpen`, `help`, `signOut`
- **Brand:** `brandmark` (Fluentra logo — overlapping arcs), `addLang` (globe + plus)

Equivalents exist in **lucide-react** for almost all of these — substitute one-to-one with matching stroke weight.

## Motion

- Default transition: `200ms` for hover/focus, `400ms` for layout state, `800ms cubic-bezier(.2,.8,.2,1)` for ring fills
- Hover lift: `transform: translateY(-2px)` + slight shadow bump (used on cards in marketing / library)
- Button press: `opacity .85` while held

## Data / Constants

`USER` and `LANGUAGES` arrays in `_kit.jsx` define the demo data shape. The shape is a useful starting point for type definitions:

```ts
type Language = {
  code: 'en' | 'es' | 'ja' | 'fr' | 'de';
  native: string;       // 'Español'
  english: string;      // 'Spanish'
  streak: number;       // days
  level: 'A1'|'A2'|'B1'|'B2'|'C1'|'C2';
  exam: string;         // 'IELTS' | 'DELE' | 'JLPT N4' | 'DELF'
  flag: string;         // matches code
};

type User = {
  name: string; email: string; initial: string;
  plan: 'Free' | 'Pro';
  renewsOn: string;
  joinedDays: number;
  totalSessions: number;
  totalMinutes: number;
};
```
