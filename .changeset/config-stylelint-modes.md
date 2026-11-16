---
"@monospaced/set-config": minor
---

The Stylelint preset allows `ms` and `s`, and the CSS easing keywords (`linear`, `ease-out`, `step-end` and so on) on the timing-function properties, so graphics can step on any timing. `font-weight` takes a number, a token or any value on the font's weight axis, never a keyword (`font-weight-notation: numeric`). `letter-spacing` is banned: tracking breaks the character grid, and Set already fits the type.
