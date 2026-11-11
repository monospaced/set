---
"@monospaced/set-core": minor
---

Dither, a new component that lays a tone of ordered dither behind content. `density` from 0 to 100 snaps to 17 levels of a 4×4 Bayer matrix in square dots; `ramp` starts at that density on the named edge and fades to empty at the opposite one, in one band per level that share one tile phase so the pattern runs unbroken at any length. `cell` sets the cell size from 2 to 12px, 3px by default, and `tone` the colour. Pattern's `size` is renamed `cell` to match, with no alias, and its `fill` value is dropped. As a standalone graphic it sizes like Image: `inlineSize` and `blockSize` in pixels, snapped to whole cells, with an unsized axis filling the parent or following `aspectRatio`, and the inline size capped at the parent. Pattern gains the same props. Pattern is unchanged: its tiles are the brand's staggered lattice in 1:2 character cells, a different texture from a dither.

Both components' `brand`, `brandSecondary` and `brandTertiary` tones now use the brand colours, and new `brandSupport`, `brandSupportSecondary` and `brandSupportTertiary` tones take the support tints the brand tones used before. The `default` and `subtle` tones are contrast-safe for content composed over them; the brand and brand support tones are not.
