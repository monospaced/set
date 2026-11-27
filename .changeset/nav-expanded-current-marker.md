---
"@monospaced/set-core": patch
---

In an expanded collapsible `Nav`, the current item now loses its dotted underline and gains the trailing `_`. The override rules were compiled with the `:where(.set)` scope in the middle of the selector, present in the CSS but matching nothing, because a nested selector that ends in a pseudo-element can't have its parent wrapped in `:is()`. They now sit at nav level with the parent leading.
