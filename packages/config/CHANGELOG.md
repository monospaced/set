# @monospaced/set-config

## 0.24.0

### Minor Changes

- 7a7e415: `effect.blend.overprint` is the blend mode for overlapping inks: `multiply` on light, `screen` on dark, so a crossing darkens on a light ground and brightens on a dark one. It follows the theme like the colour tokens, including the OS scheme and locked content themes. Decorative only; blended colours aren't contrast-safe.
- 6a2715f: Publish `typography.metric.default.cell.widthCondensed`, the character advance at the narrowest font width (0.45em in mnsp, 0.6em in wrfr, which has no width axis). With the existing cell width and ultra-condensed width tokens it gives the advance at any width as a straight line, for fit-to-width type.
- d6af4c1: Ordered dither tokens: `shape.dither.0` to `shape.dither.16` are the 17 tiles of a 4×4 Bayer matrix, from empty to solid, published as crisp-edged mask images; `shape.dither.cell.sm` to `xl` are cell widths of 2 to 12px, and `shape.dither.tile.sm` to `xl` the matching mask sizes, four cells a side. Any element can be masked to a dither level at a tile size. Dithered colour isn't contrast-safe. Shape primitives may now set `rendering`, which the build emits as the SVG's `shape-rendering`; a description on a semantic shape node documents its published image, and `css.derive` limits which derivatives it publishes.
- cac4b01: Heading gains three fluid display sizes, `display-sm`, `display-md` and `display-lg`, that scale with their container from a 48px floor to caps of 120, 180 and 240px, with width, weight and line height following the rendered size. They fit at least 10 characters at any width inside a Container. Heading `5xl` is removed: use `display-sm`. Static `4xl` and responsive `4xl` on narrow screens now match `3xl`; `4xl` only grows with responsive on, above the tablet breakpoint. Heading also gets `overflow-wrap: break-word`.

  Tokens: type steps 1400, 1500 and 1600 (180, 240 and 360px), static heading composites `display-sm` to `display-xl` on steps 1300 to 1600, semantic weights `thin` and `light`, and weight primitives 125 and 150. In wrfr the new width and weight primitives follow that brand's font: width 100 and weight 300. The `5xl` composites, static and responsive, are removed. `display-xl` is voice type for future loose and free modes; Heading doesn't use it.

- 528da99: Frame periods for stepped graphic motion: `motion.frame.fast`, `default`, `slow` and `tick` are 83.333, 125, 166.667 and 333.333ms, the periods of a 24fps clock drawn on twos, threes, fours and eights. Generative and bitmap graphics throttle their redraws to one of them so a page shares one cadence. In wrfr they are 0, as that brand has no motion: a period of 0 means draw the composed still and stop.

## 0.23.0

### Minor Changes

- 2821945: The Stylelint preset sets `reportNeedlessDisables: true`. A `stylelint-disable` comment that suppresses nothing now fails, so inline Baseline justifications are removed the moment the data makes them unnecessary. Consumers with stale disables of their own will see them reported.

### Patch Changes

- 633c13e: Update dependencies within their current majors. Scaffolded projects install the newer Vite 7, Vitest 4, React 19, Prettier and lint-staged releases.

  Style Dictionary 5.8 corrects the generated tokens. The `0.025` alpha is no longer rounded to `0.03`, so `--set-color-background-subtle` and, in `wrfr`, the `--set-color-intent-*-subtle` tokens render very slightly lighter, as authored. Durations now output in seconds and zero lengths as `0rem`, with no change in effect, but code that parses a duration token as milliseconds needs updating.

## 0.22.0

## 0.21.0

### Minor Changes

- ef39425: `@monospaced/set-config/eslint` is now a complete flat config for a web
  project: `@eslint/js`, `typescript-eslint` and `@eslint/json` recommended with
  browser globals for source, Node globals for tool configs and scripts, Set's
  import sort and the Baseline rule. `@monospaced/set-config/eslint/react` adds
  `eslint-plugin-react-hooks` and `eslint-plugin-react-refresh` at their
  defaults. The previous layer-on preset moves to
  `@monospaced/set-config/eslint/rules`; update the import if you compose your
  own config. Add `@monospaced/set-config/browserslist/lightningcss`, the
  Baseline query as Lightning CSS targets for Vite. `browserslist`,
  `lightningcss` and `typescript` become optional peer dependencies.
- 53b370d: Enforce Set's Baseline target in the ESLint and Stylelint presets. A new
  `@monospaced/set-config/baseline` export holds the target (`"widely"`), and
  the browserslist query, the esbuild target and both lint rules derive from
  it. ESLint reports JS builtins and Web APIs outside Baseline Widely available
  via `eslint-plugin-baseline-js`; turn the rule off for code that runs under
  Node. Stylelint reports CSS features outside it via
  `stylelint-plugin-use-baseline`, ignoring a short list of progressive
  enhancements that degrade gracefully. Anything else needs an `@supports`
  guard or an inline justification.

## 0.20.2

## 0.20.1

## 0.20.0

## 0.19.1

## 0.19.0

## 0.18.0

## 0.17.0

## 0.16.0

## 0.15.0

## 0.14.2

## 0.14.1

## 0.14.0

## 0.13.0

## 0.12.0

## 0.11.0

## 0.10.1

## 0.10.0

## 0.9.0

## 0.8.0

## 0.7.0

## 0.6.0

## 0.5.1

## 0.5.0

## 0.4.0

## 0.3.0

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
