---
"@monospaced/set-core": minor
"@monospaced/set-system": minor
"@monospaced/set-tokens": minor
---

Rework the image component's layout modes and fix art direction under cover.

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
