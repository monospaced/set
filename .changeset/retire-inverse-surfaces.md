---
"@monospaced/set-core": minor
"@monospaced/set-system": minor
"@monospaced/set-tokens": minor
---

Remove the `inverse` and `brand-inverse` surface contexts. They existed
only as a resolver mapping (light theme on a dark page and vice versa)
and the use case never materialised; regions that must stay light or
dark regardless of theme use `contentTheme` / `data-set-content-theme`
instead. `SetSurfaceVariant` and the `surface` / `variant` props on
Surface, Box, Card, Panel and Sidebar now accept `default` and `brand`
only, and the token CSS and JSON artifacts no longer emit the inverse
contexts.
