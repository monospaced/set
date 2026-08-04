# @monospaced/set-config

## 0.2.0

## 0.1.0

### Minor Changes

- fe48043: Render italic text correctly in Safari.

  WebKit drops the `font-style: italic` → slant-axis mapping once `font-variation-settings` is set, so italics rendered upright in Safari while Chrome and Firefox were unaffected. A new `fontVariationSettings.italic` token declares the slant axis explicitly (`slnt -16` for Berkeley Mono; `slnt -15` alongside Recursive's `CRSV`/`CASL`/`MONO`), and it is applied to italic elements (`em`, `i`, `cite`, `dfn`, `var`, `address`) and prose code italics.

  Adds the `--set-typography-font-variation-settings-italic` custom property (per brand).

- fc2eb7b: Add an `xl` logo size, refine the logo mark, and tune the `emphasized` motion easing.
  - **Logo** — new `xl` size (larger than `lg`), across the default and secondary/typographic/graphic variants.
  - **Logo mark** — refined the primary/secondary/typographic logo SVG paths and viewBoxes.
  - **Motion** — adjusted the `emphasized` easing curve.

- 673f0e4: Refine typography: new font-stretch, font-variation-settings, and word-spacing tokens, composite restructuring, and a per-element word-spacing fix.
  - **Font stretch** — adds a `font-stretch` scale (primitive steps plus semantic `normal` / `semiCondensed` / `condensed` / `ultraCondensed`), and every text composite now bundles a paired `fontStretch`. Responsive font-stretch travels with the responsive composites, so headings scale their width across breakpoints without a component media query.
  - **Word spacing** — adds `wordSpacing.default` and `wordSpacing.monospaced` tokens. Word-spacing now scales with each element's own font size (it previously inherited the root's frozen `px` value), and the monospaced (`0`) override cascades to descendants such as `code` and table cells.
  - **Font variation settings** — adds a `fontVariationSettings` token, restated after every `font` shorthand (which resets it).
  - **Metric** — inline-code padding now reads the `metric` tokens directly.
  - **Fonts** — WRFR now ships the Recursive variable font (replacing Fantasque Sans Mono and Playpen Sans); removed an unused Berkeley Mono width-axis face.

  **Breaking changes**
  - Text composite custom properties gain a `-font` suffix — e.g. `--set-typography-text-heading-2xl` → `--set-typography-text-heading-2xl-font`. Each size also exposes a matching `--set-typography-text-*-font-stretch`.
  - The `--set-typography-prose-code-padding-*` custom properties are removed; use `--set-typography-metric-default-cap-balance` and `--set-typography-metric-default-side-bearing-single` instead.
  - Prose link tokens moved from `typography.prose.link.*` to `typography.prose-link.*` in the token JSON. The emitted CSS variable names (`--set-typography-prose-link-*`) are unchanged.

### Patch Changes

- 7be3ece: Tune the nav list gap (now derived from the metric cell width, `calc(cell-width * 2)`, with the small-size override removed) and trim the `radius.ratio.default` token description.

## 0.0.1
