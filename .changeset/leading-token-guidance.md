---
"@monospaced/set-system": patch
"@monospaced/set-tokens": patch
---

Correct the leading token guidance: apply leading dimensions directly
as line-height values instead of dividing by font size. A length is a
valid line-height as-is, and `calc()` cannot divide by a value with
units cross-browser — following the old advice is what broke the
prose heading markers in Firefox and Safari.
