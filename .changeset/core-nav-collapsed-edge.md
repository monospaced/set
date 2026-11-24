---
"@monospaced/set-core": patch
---

`Nav`'s `collapsible` says the first-or-last rule applies while the nav is collapsed: with `belowTablet`, only below tablet, above which the nav can sit anywhere in the row, and if the two positions differ, wrap the nav and move the wrapper with CSS `order` below the tablet breakpoint. `expanderPosition` names the edge the nav sits at while collapsed.
