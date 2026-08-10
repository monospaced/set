---
"@monospaced/set-core": minor
"@monospaced/set-system": minor
"@monospaced/set-tokens": minor
---

Swap the primary and secondary logo shapes in both brands: `primary`
is now the single-line lockup (previously `secondary`), and
`secondary` the stacked two-line lockup (previously `primary`). The
logo component's per-variant size ladders swap with the artwork, so
each shape keeps its tuned optical sizes. Anywhere that rendered
`variant="secondary"` for the single-line lockup should now use
`primary` (or omit the prop — it is the default).
