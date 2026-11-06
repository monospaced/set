---
"@monospaced/set-core": patch
---

Add physical `overflow` fallbacks beside the logical `overflow-block` and
`overflow-inline` declarations in Nav's expanded drawer and Prose's code
blocks. Logical overflow is Baseline Newly available (2025), so browsers
from before then dropped the declaration and those regions did not scroll.
