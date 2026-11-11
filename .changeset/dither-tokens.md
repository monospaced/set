---
"@monospaced/set-system": minor
"@monospaced/set-tokens": minor
"@monospaced/set-config": minor
---

Ordered dither tokens: `shape.dither.0` to `shape.dither.16` are the 17 tiles of a 4×4 Bayer matrix, from empty to solid, published as crisp-edged mask images; `shape.dither.cell.sm` to `xl` are cell widths of 2 to 12px, and `shape.dither.tile.sm` to `xl` the matching mask sizes, four cells a side. Any element can be masked to a dither level at a tile size. Dithered colour isn't contrast-safe. Shape primitives may now set `rendering`, which the build emits as the SVG's `shape-rendering`; a description on a semantic shape node documents its published image, and `css.derive` limits which derivatives it publishes.
