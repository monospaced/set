---
"@monospaced/set-system": minor
"@monospaced/set-tokens": minor
---

Add display scheme tokens for adaptive media. Every theme and surface
context now resolves `effect.display.scheme.light`/`.dark` (backed by
new display primitives in each brand's primitive effect set), publishing
`--set-effect-display-scheme-*` custom properties that carry the
context's resolved color scheme — themes, inverse surfaces,
content-theme locks, and `prefers-color-scheme` included.
