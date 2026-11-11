---
"@monospaced/set-system": minor
"@monospaced/set-tokens": minor
"@monospaced/set-config": minor
"@monospaced/set-core": minor
---

Heading gains three fluid display sizes, `display-sm`, `display-md` and `display-lg`, that scale with their container from a 48px floor to caps of 120, 180 and 240px, with width, weight and line height following the rendered size. They fit at least 10 characters at any width inside a Container. Heading `5xl` is removed: use `display-sm`. Static `4xl` and responsive `4xl` on narrow screens now match `3xl`; `4xl` only grows with responsive on, above the tablet breakpoint. Heading also gets `overflow-wrap: break-word`.

Tokens: type steps 1400, 1500 and 1600 (180, 240 and 360px), static heading composites `display-sm` to `display-xl` on steps 1300 to 1600, semantic weights `thin` and `light`, and weight primitives 125 and 150. In wrfr the new width and weight primitives follow that brand's font: width 100 and weight 300. The `5xl` composites, static and responsive, are removed. `display-xl` is voice type for future loose and free modes; Heading doesn't use it.
