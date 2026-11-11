---
"@monospaced/set-core": minor
---

Pattern gains two ordered dither variants. `dither` masks a 4×4 Bayer tile at a `density` from 0 to 100, snapped to 17 levels; `ditherRamp` steps from solid to empty toward a `direction`, in 17 bands that share one tile phase so the pattern runs unbroken at any length. `cell` picks square dots, the default, or 1:2 character cells; `size` sets the cell width on the existing 3 to 48px scale, and `tone` recolours as before. The tile variants are unchanged: for a flat 25%, 50% or 75% in character cells they remain the brand's staggered lattice.
