---
"@monospaced/set-tokens": minor
"@monospaced/set-core": minor
"@monospaced/set-config": minor
"@monospaced/set-assets": minor
---

Refine typography: new font-stretch, font-variation-settings, and word-spacing tokens, composite restructuring, and a per-element word-spacing fix.

- **Font stretch** — adds a `font-stretch` scale (primitive steps plus semantic `normal` / `semiCondensed` / `condensed` / `ultraCondensed`), and every text composite now bundles a paired `fontStretch`. Responsive font-stretch travels with the responsive composites, so headings scale their width across breakpoints without a component media query.
- **Word spacing** — adds `wordSpacing.default` and `wordSpacing.monospaced` tokens. Word-spacing now scales with each element's own font size (it previously inherited the root's frozen `px` value), and the monospaced (`0`) override cascades to descendants such as `code` and table cells.
- **Font variation settings** — adds a `fontVariationSettings` token, restated after every `font` shorthand (which resets it).
- **Metric** — inline-code padding now reads the `metric` tokens directly.
- **Fonts** — WRFR now ships the Recursive variable font (replacing Fantasque Sans Mono and Playpen Sans); removed an unused Berkeley Mono width-axis face.

**Breaking changes**

- Text composite custom properties gain a `-font` suffix — e.g. `--set-typography-text-heading-2xl` → `--set-typography-text-heading-2xl-font`. Each size also exposes a matching `--set-typography-text-*-font-stretch`.
- The `--set-typography-prose-code-padding-*` custom properties are removed; use `--set-typography-metric-default-cap-balance` and `--set-typography-metric-default-side-bearing-single` instead.
- Prose link tokens moved from `typography.prose.link.*` to `typography.prose-link.*` in the token JSON. The emitted CSS variable names (`--set-typography-prose-link-*`) are unchanged.
