---
"@monospaced/set-core": minor
---

Add an `animated` prop to the logo: the mark boots cell by cell with
a double-blink, once on render. Animates the `primary` and `graphic`
variants; other variants render static. The animated variants render
an inline SVG (artwork drift-guarded against the shape tokens) in
place of the mask; duration comes from `motion.duration.1300`, so
brands with zeroed durations show the assembled mark immediately, as
do reduced-motion preferences.
