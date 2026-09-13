---
"@monospaced/set-core": minor
---

Add an `animated` image variant for animated assets (e.g. `webp`) with a required reduced-motion `still`. Combine with `adaptive` for light/dark theming — the `src`/`srcSet`/`sources` URLs carry a `{scheme}` placeholder the component substitutes across a light/dark pair. Add a `leadSrc` to sequence: an intro overlay that plays once, then reveals `src` after a fixed hold. All pure CSS/HTML with a reduced-motion fallback; no runtime.
