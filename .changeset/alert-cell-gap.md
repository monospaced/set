---
"@monospaced/set-core": patch
---

Loosen the alert's icon/content column gap to the full character cell
advance (`--set-typography-metric-default-cell-width`). The alert icon
is its own affordance beside the text — unlike button's icon-in-text
gap, which keeps the side-bearing subtraction — and the em-based
metric token replaces the previous rem literals, so the gap now
tracks font-size.
