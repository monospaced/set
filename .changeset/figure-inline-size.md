---
"@monospaced/set-core": minor
---

Add an `inlineSize` prop to the figure, joining the shared
`full`/`fit` convention. Figures now fill their container by default,
in line with the system-wide contract; pass `fit` to restore
shrink-to-media sizing. Non-intrinsic media (e.g. a poster) previously
collapsed the fit-content figure to its minimum width.
