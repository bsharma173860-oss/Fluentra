# Fluentra — Mobile UI Kit

Hi-fi recreation of the Fluentra mobile product surface (390×780 phone frame), copied from `proto/`.

## Files

- `index.html` — entry; loads React + Babel and renders `<PhoneSurface>` scaled to fit the viewport
- `shared.jsx` — `LANGUAGES` data, `Flag`, `Icon` map, `Ring` primitive, `levelFor()` helper (same as web kit)
- `phone.jsx` — `PhoneFrame` (390×780 bezel with status bar + home indicator), `LangCardCollapsed`, `LangCardExpanded`, `PhoneSurface`

## What's covered

The **dashboard / language-list flow**: a vertical stack of collapsed language cards, tap to expand to today's-session detail with module steps + goal ring + streak. Bottom-tab navigation chrome is part of `PhoneSurface`.

Additional mobile screens (practice, library, progress, exams, vocab) live in `design_handoff_fluentra/design_files/redesign/mobile/` and follow the same `PhoneFrame` envelope.

## Reuse

`PhoneFrame` is a mockup-only bezel — drop it for production and keep the inner content responsive. `LangCardCollapsed` / `LangCardExpanded` are the canonical collapsed/expanded list pattern and reusable for any tap-to-reveal mobile list.
