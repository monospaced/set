---
"@monospaced/set-system": patch
"@monospaced/set-tokens": patch
---

Drop the leading token description's advice to divide by font size to
derive a line-height ratio — `calc()` cannot divide by a value with
units cross-browser, and a leading dimension is a valid line-height
as-is. Following the old advice is what broke the prose heading
markers in Firefox and Safari.
