# @monospaced/set-system

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
