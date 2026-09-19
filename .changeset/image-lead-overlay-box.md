---
"@monospaced/set-core": patch
---

Fix sequenced images without `adaptive` rendering the lead layer in flow below the base instead of overlaying it. The root reset gives `picture` `display: contents`, so the lead had no box for `position: absolute` to apply to; adaptive images only worked because the scheme display rules restore the box as a side effect. An unpaired lead now gets `display: block`. Adaptive leads and the reduced-motion `display: none` are unaffected.
