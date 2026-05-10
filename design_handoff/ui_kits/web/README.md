# Fluentra — Web UI Kit

Hi-fi recreation of the Fluentra desktop product surface, copied from `proto/`.

## Files

- `index.html` — entry; loads React + Babel and renders `<WebSurface>` scaled to fit the viewport
- `shared.jsx` — `LANGUAGES` data, `Flag`, `Icon` map, `Ring` primitive, `levelFor()` helper
- `web.jsx` — `WebSurface` (full dashboard with sidebar, top bar, hero, language hybrid cards), `HybridCard`, `UserMenu`

## What's covered

A clickable recreation of the **dashboard view** at 1280×800: top bar with brand + search + notifications + avatar + user menu, language switcher, today's-session hero, the per-language *HybridCard* (gradient hero + stat sheet with goal ring), recent activity feed, right-rail streak summary.

This is the "above the fold" view of the product — additional pages (practice, library, sessions, exams, etc.) live in `design_handoff_fluentra/design_files/redesign/web/` as full JSX implementations and should be lifted from there if needed.

## Reuse

`HybridCard`, `UserMenu`, the top-bar pattern, and the side-nav structure are reusable across any web screen. Copy them in alongside `shared.jsx` and the tokens defined in `colors_and_type.css` at the project root.
