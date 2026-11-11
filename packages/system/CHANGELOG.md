# @monospaced/set-system

## 0.24.1

No changes in this release.

## 0.24.0

### Minor Changes

- 7a7e415: `effect.blend.overprint` is the blend mode for overlapping inks: `multiply` on light, `screen` on dark, so a crossing darkens on a light ground and brightens on a dark one. It follows the theme like the colour tokens, including the OS scheme and locked content themes. Decorative only; blended colours aren't contrast-safe.
- 6a2715f: Publish `typography.metric.default.cell.widthCondensed`, the character advance at the narrowest font width (0.45em in mnsp, 0.6em in wrfr, which has no width axis). With the existing cell width and ultra-condensed width tokens it gives the advance at any width as a straight line, for fit-to-width type.
- d6af4c1: Ordered dither tokens: `shape.dither.0` to `shape.dither.16` are the 17 tiles of a 4×4 Bayer matrix, from empty to solid, published as crisp-edged mask images; `shape.dither.cell.sm` to `xl` are cell widths of 2 to 12px, and `shape.dither.tile.sm` to `xl` the matching mask sizes, four cells a side. Any element can be masked to a dither level at a tile size. Dithered colour isn't contrast-safe. Shape primitives may now set `rendering`, which the build emits as the SVG's `shape-rendering`; a description on a semantic shape node documents its published image, and `css.derive` limits which derivatives it publishes.
- cac4b01: Heading gains three fluid display sizes, `display-sm`, `display-md` and `display-lg`, that scale with their container from a 48px floor to caps of 120, 180 and 240px, with width, weight and line height following the rendered size. They fit at least 10 characters at any width inside a Container. Heading `5xl` is removed: use `display-sm`. Static `4xl` and responsive `4xl` on narrow screens now match `3xl`; `4xl` only grows with responsive on, above the tablet breakpoint. Heading also gets `overflow-wrap: break-word`.

  Tokens: type steps 1400, 1500 and 1600 (180, 240 and 360px), static heading composites `display-sm` to `display-xl` on steps 1300 to 1600, semantic weights `thin` and `light`, and weight primitives 125 and 150. In wrfr the new width and weight primitives follow that brand's font: width 100 and weight 300. The `5xl` composites, static and responsive, are removed. `display-xl` is voice type for future loose and free modes; Heading doesn't use it.

- 528da99: Frame periods for stepped graphic motion: `motion.frame.fast`, `default`, `slow` and `tick` are 83.333, 125, 166.667 and 333.333ms, the periods of a 24fps clock drawn on twos, threes, fours and eights. Generative and bitmap graphics throttle their redraws to one of them so a page shares one cadence. In wrfr they are 0, as that brand has no motion: a period of 0 means draw the composed still and stop.
- a86a92d: Remove the `pending` and `live` intents. `warning` now also covers pending or unresolved state, and `success` also covers live or on-air state. The `--set-color-intent-pending-*` and `--set-color-intent-live-*` variables are gone; switch to the warning and success variables.

  Add `brand.secondary`, `brand.tertiary`, `brand.supportSecondary` and `brand.supportTertiary`. In mnsp these are magenta and yellow; in wrfr they alias the primary and support colors.

  Rework the mnsp data palette. Slots 00 to 02 are the brand primary, secondary and tertiary colors, and slots 03 to 09 follow the same hue sequence in both themes with wider lightness and hue steps between neighbours. Every slot clears 3:1 against the default, panel and subtle backgrounds of both surfaces.

  Brand theme files now hold only the tokens that differ from the default theme. The content-theme dark brand surface resolves on top of the dark default theme as a result, which also corrects its `logo.neutral` from black to white.

  Rework the surfaces into a brand family. The former `brand` surface, a faint brand wash, is now `brandSubtle`; `brand`, `brandSecondary` and `brandTertiary` are new surfaces whose page is a plate in the primary, secondary or tertiary brand hue, with inks, borders and interactive colors tuned to hold the system's contrast contract on them. Regions using `data-set-surface="brand"` or `variant="brand"` should move to `brandSubtle` to keep their current appearance. Prose links are underlined by default on the plate surfaces, which moves the prose link decoration line tokens from typography to effect: `--set-typography-prose-link-{default,hover}-decoration-line` become `--set-effect-prose-link-{default,hover}-decoration-line`. A new `interactive.prose.decoration` token colors the default-state underline per surface.

  `foreground.contrast` is now a literal neutral rather than an alias of the page background, so it no longer tints on brand surfaces. wrfr gains a data palette and the same surfaces with neutral values. The private alpha scales gain the steps the plate surfaces need.

### Patch Changes

- d9565ac: Publish the word-spacing switch as a token. `typography.wordSpacing.current` is the word spacing Root applies to every element; set `--set-typography-word-spacing-current` on a container to switch a subtree, for example to the monospaced value. Root now opts in `[data-monospaced]` on any element, plus `code`, `pre`, `kbd`, `samp` and `table`, so Text and Prose no longer carry their own rules. The private `--set-word-spacing` custom property is removed.

## 0.23.0

No changes in this release.

## 0.22.0

## 0.21.0

## 0.20.2

## 0.20.1

## 0.20.0

### Minor Changes

- 351720b: Add a ten-slot `color.data.00`–`09` semantic palette to the mnsp brand
  for categorical data visualisation, with values for the default and
  brand contexts in both light and dark themes. Rebuilt system/tokens
  dist artifacts and the config catalog included.
- 4331b53: Remove the `inverse` and `brand-inverse` surface contexts. They existed
  only as a resolver mapping (light theme on a dark page and vice versa)
  and the use case never materialised; regions that must stay light or
  dark regardless of theme use `contentTheme` / `data-set-content-theme`
  instead. `SetSurfaceVariant` and the `surface` / `variant` props on
  Surface, Box, Card, Panel and Sidebar now accept `default` and `brand`
  only, and the token CSS and JSON artifacts no longer emit the inverse
  contexts.

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

### Minor Changes

- 6a35d39: Rebalance the mnsp magenta primitive ramp from 600 through 1200,
  easing saturation as the steps darken. The 100–500 steps are
  unchanged.

## 0.11.0

### Minor Changes

- fc01690: Shift every mnsp chromatic 900 primitive to meet WCAG 3:1 contrast
  against black, using the minimum lightness raise that retains each
  hue. All twelve hues previously sat narrowly under the threshold
  (2.88–2.91:1); the new values land at 3.00–3.03:1.

## 0.10.1

## 0.10.0

### Minor Changes

- 9e27413: Add display scheme tokens for adaptive media. Every theme and surface
  context now resolves `effect.display.scheme.light`/`.dark` (backed by
  new display primitives in each brand's primitive effect set), publishing
  `--set-effect-display-scheme-*` custom properties that carry the
  context's resolved color scheme — themes, inverse surfaces,
  content-theme locks, and `prefers-color-scheme` included.

## 0.9.0

### Minor Changes

- 2618c28: Color primitive rebalance and translucent subtle backgrounds.
  Deepen every mnsp hue's 300 step for clearer separation from 200;
  retarget the mnsp `alpha.brand` primitives from the legacy Measured
  blue to brand cyan (`#007c7c`); add an `alpha.black.02` primitive to
  both brands and alias the light-theme `background.subtle` to it, so
  subtle surfaces tint whatever they sit on instead of pinning to an
  opaque ramp step.

## 0.8.0

### Minor Changes

- 313ff15: Add the `motion.duration.1300` step (1333ms; 0ms in wrfr, following
  the brand's zeroed durations) for one-shot sequences such as the
  animated logo boot. Also sync wrfr's logo shape primitives to mnsp —
  the brands share logo artwork and wrfr's values were stale.

## 0.7.0

### Minor Changes

- 7408b6d: Add the `border.strong` color token — a high-contrast border for
  where the border should assert visually, completing the ladder
  `subtle < default < strong` (with `brand` as the orthogonal
  decorative tint). Defined across both brands and all four theme
  variants, aliasing the same primitive as `foreground.muted.text` in
  each.

## 0.6.0

## 0.5.1

## 0.5.0

### Minor Changes

- de412b2: Swap the primary and secondary logo shapes in both brands: `primary`
  is now the single-line lockup (previously `secondary`), and
  `secondary` the stacked two-line lockup (previously `primary`). The
  logo component's per-variant size ladders swap with the artwork, so
  each shape keeps its tuned optical sizes. Anywhere that rendered
  `variant="secondary"` for the single-line lockup should now use
  `primary` (or omit the prop — it is the default).

### Patch Changes

- 01b73f5: Drop the leading token description's advice to divide by font size to
  derive a line-height ratio — `calc()` cannot divide by a value with
  units cross-browser, and a leading dimension is a valid line-height
  as-is. Following the old advice is what broke the prose heading
  markers in Firefox and Safari.

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

### Patch Changes

- 2c1af64: Move dark-theme avatar palette slot 04 from violet.700 to violet.600
  (`#9d6ccd` → `#b486e2`) so it no longer shares an exact hex with the
  dark visited prose link color (`interactive.prose.visited`, also
  violet.700).

## 0.3.0

## 0.2.0

## 0.1.0

## 0.0.1
