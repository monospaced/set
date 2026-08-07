# @monospaced/set-core

## 0.4.0

### Minor Changes

- c3aea51: Rework the image component's layout modes and fix art direction under cover.

  The image component now expresses its layout as a single `fit` mode —
  `"intrinsic"` (default), `"fluid"`, or `"cover"` — instead of a `cover`
  boolean. `fluid` is new: it scales the image to the container's full inline
  size while preserving the active source's intrinsic aspect ratio, which is
  what art-directed `sources` need to span layouts wider than their pixel
  dimensions. Conditional props now read per-mode (`gravity` and `aspectRatio`
  are cover-only; `width`/`height` document their meaning in each mode).

  BREAKING: `cover: true` is now `fit: "cover"`. The `cover` prop is removed.

  BREAKING: `radius` is now a boolean applying the default (`xs`) corner
  radius. The `"ratio"` strategy and the `SetImageRadius` type are removed.

  Fixes:
  - `data-aspect-ratio` is no longer emitted when `height` is set — with the
    block size fixed, CSS `aspect-ratio` could never apply, so the attribute
    was inert (and the "ignored when both `width` and `height` are set"
    documentation was wrong: height alone disables it, width alone does not).
  - `picture` is removed from the root replaced-media normalization and now
    gets `display: contents`: it is source-selection machinery, not a layout
    box. Previously its `display: block` box sat between the image and its
    wrapper, collapsing cover's `block-size: 100%` chain whenever art-directed
    `sources` were present.

  Dark-theme shadows were unusably heavy or invisible against imagery: both
  brands' dark `default` and `brand` shadow colors now use a new
  `alpha.black.40` primitive (previously black at 92% and 8% alpha).

- e6bd128: Add the video component.

  `video` (Graphic/Video) wraps the HTML video element in the image
  component's mold: a `set-video` host with `fit` modes (`intrinsic` |
  `fluid`), playback props (`autoPlay`, `controls`, `loop`, `muted`,
  `playsInline`), `poster`, `preload`, intrinsic `width`/`height`, and a
  required `src`. Spec, CSS, tests, story, and a generated React wrapper
  are included.

  The `set-video` custom element runtime (registered via
  `defineSetComponents()` or `defineSetVideo()`) suspends autoplaying
  video while `(prefers-reduced-motion: reduce)` matches — the `autoplay`
  attribute is withdrawn so pending playback cannot start — and resumes
  playback when the preference relaxes.

  Fixes `width`/`height` attributes on `video` and `canvas` inside a Set
  tree: the root `all: revert` descendant reset discards presentational
  hints, so both join `img` in the reset's exclusion list. Previously
  every dimension attribute on a video was silently ignored.

  Prop documentation now follows the SPEC-is-canonical convention for
  image and video: interface JSDoc is short and descriptive; guidance
  (conditional behavior, browser policies, per-fit-mode `width`/`height`
  semantics) lives in the spec descriptions that drive the docs.

## 0.3.0

### Minor Changes

- ccbc3a0: Add the `image` icon to the curated set.

  Declares `image` in `TDESIGN_ICON_NAMES` and regenerates `icons.generated.ts`
  so the icon ships in the bundled node registry.

## 0.2.0

### Minor Changes

- 035d8a7: Ship only the icons Set declares instead of the full TDesign catalog.

  `@monospaced/set-core` used to bundle the entire ~1200-icon TDesign registry
  into any consumer that rendered a single icon. It now ships only a declared set,
  cutting the package's minified bundle by ~440 KB (~104 KB gzip). Two hand-edited
  lists define it: `icons-tdesign.ts` (`TDESIGN_ICON_NAMES`, the catalog names to
  pull) and `icons-custom.ts` (first-party icons, included automatically). A
  generate script emits the icon registry from both.

  Icon-name props are now typed. `icon`/`name` (on icon, button, menu, …) accept
  the `SetIconName` union — the TDesign selection plus custom names — rather than
  `string`, so invalid names are caught at compile time with autocomplete. React
  inherits this via `SetIconProps`. The exported `SET_ICON_NAMES` (formerly
  `SET_ICON_RECOMMENDED`) is the runtime list of every shipped name.

  BREAKING: `name`/`icon` props now accept only the shipped names; other TDesign
  names are a type error and throw at runtime. To add one: add a name to
  `icons-tdesign.ts`, or an icon to `icons-custom.ts`, and run
  `pnpm icons:generate`.

  Also fixes the sidebar trigger/collapse icon: it now renders a purpose-built
  `panel-left` icon (TDesign-styled — sharp corners, full-height divider) instead
  of a rotated `horizontal` icon.

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

### Patch Changes

- e3d5de3: Widen the prose list marker gutter and trim the ordered-list marker padding so numbered and bulleted markers align more consistently.
