---
"@monospaced/set-core": patch
---

Align the line-heights that position two-digit ordered-list counters against `h2`/`h3` first lines in prose. The previous leading tokens sat one step off; the counters now use token-anchored values — exact leading tokens where the scale lands, calc midpoints and a minimal-vertical-step nudge where the optics fall between steps.
