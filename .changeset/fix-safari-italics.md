---
"@monospaced/set-core": minor
"@monospaced/set-tokens": minor
"@monospaced/set-config": minor
---

Render italic text correctly in Safari.

WebKit drops the `font-style: italic` → slant-axis mapping once `font-variation-settings` is set, so italics rendered upright in Safari while Chrome and Firefox were unaffected. A new `fontVariationSettings.italic` token declares the slant axis explicitly (`slnt -16` for Berkeley Mono; `slnt -15` alongside Recursive's `CRSV`/`CASL`/`MONO`), and it is applied to italic elements (`em`, `i`, `cite`, `dfn`, `var`, `address`) and prose code italics.

Adds the `--set-typography-font-variation-settings-italic` custom property (per brand).
