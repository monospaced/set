# @monospaced/set-core

## 0.4.0

### Minor Changes

- 4921fe9: Give each status component its own tone vocabulary.

  The shared `SetStatusTone` union forced alert, banner, and badge to accept
  tones that made no sense for them (a persistent site-wide "success" banner;
  an "info" state on a badge). Each component now declares the tones it can
  honestly express:
  - `SetAlertTone` — `info | success | warning | error` (unchanged set; alert
    keeps its per-tone icon and ARIA role mapping)
  - `SetBannerTone` — `info | warning | error`
  - `SetBadgeTone` — `success | warning | error | pending | live | notification`

  The new badge `notification` tone names the attention-signal use the
  `floating` prop was built for (unread counts). It reads the `intent.info`
  tokens: informational salience, not alarm.

  BREAKING: `SetStatusTone` is removed. Banner no longer accepts
  `tone: "success"`; badge no longer accepts `tone: "info"`.

  BREAKING: the `status` token group is renamed `intent`, and `error` is
  renamed `danger` within it (`--set-color-status-*` → `--set-color-intent-*`,
  with `--set-color-status-error-*` becoming `--set-color-intent-danger-*`).
  The group names the communicative purpose of deploying a color, not a state
  of the world — its members were never all statuses (`info` and `danger` are
  broader roles), and the purpose framing leaves room for future non-status
  intents. Component tones keep naming meanings; intent tokens name the
  color's role.

  The untoned alert default now renders a `sticky-note` icon (new in the
  curated icon set) instead of sharing `info-circle` with the `info` tone —
  the neutral "note/aside" voice and the informational severity claim are
  visually distinct.

  New `intent.pending` and `intent.live` color tokens (default + subtle) in
  both brands and themes; in the monochrome `wrfr` brand they match the
  existing intents. All `mnsp` light-theme intent defaults now sit uniformly
  at step `800` (info and danger were `1000`), and the light avatar ramps
  shift to `900/1000/1100` — no avatar slot shares an exact hex with any
  intent token.

  The mnsp avatar palette swaps `blue` for `violet` (slots 04-06; same
  steps), becoming `rose`/`violet`/`orange`. Fallback avatars mark accounts
  that have not chosen an image, so hues must not read as avatar-adjacent
  signals: blue sat one step from both the notification azure and violet,
  and is earmarked for `ai`. `orange` harmonizes with the unpersonalized
  state (identity pending), `rose` and `violet` stay inert.

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

- 33b14e6: Add the lightswitch component.

  `lightswitch` (Control/Lightswitch) is a two-state light/dark theme toggle
  implementing the approach from Lea Verou's writing on dark mode
  toggles: the control shows two states (the resolved theme) but
  persists three. No stored value means the system preference is
  followed; a stored `light`/`dark` in localStorage (exported constant
  `SET_LIGHTSWITCH_STORAGE_KEY`, `set-theme`) overrides it. Activation
  targets the opposite of the current resolved theme — and when that
  target equals the system preference the override is cleared rather
  than stored, so a choice matching the system is never silently
  pinned. Storage is only evaluated on interaction; a system preference
  change never rewrites a stored override.

  The component is self-contained (no button component dependency):
  an icon-only toggle button rendering both actions — a moon to switch
  to dark, a sun to switch to light — with CSS showing the one opposing
  the resolved theme, driven by `data-set-theme` on the Set root and
  falling back to `prefers-color-scheme`. The control is therefore
  correct before (and without) JavaScript. The `set-lightswitch` custom
  element runtime (registered via `defineSetComponents()` or
  `defineSetLightswitch()`) only persists the choice, applies it by setting
  or removing `data-set-theme` on the closest Set root, and emits
  `set-lightswitch-change` after each activation. Spec, CSS, tests, story,
  and a generated React wrapper (with `onChange`) are included.

  Adds the `moon` and `sunny` TDesign icons to the icon catalog.

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
