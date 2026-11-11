---
"@monospaced/set-core": patch
---

Heading display sizes run their fluid line between the baseline and desktop breakpoints instead of deriving it from Container gutters. Without a size container, where `cqi` is the viewport, the heading now fits at least 10 characters at every width; before, a long word could overflow on narrow and tablet screens. Inside a Grid or a consumer `container-type: inline-size` wrapper the heading responds to its content width and runs slightly smaller.
