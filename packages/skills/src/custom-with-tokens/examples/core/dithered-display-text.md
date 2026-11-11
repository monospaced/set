# Dithered display text (core)

A display heading set as a dither, so a headline reads as a bitmap tone rather than a flat fill. `Dither` lays a tone behind content, not through text, so this is a gap: the recipe masks the heading with the dither tiles the system publishes as tokens.

```ts
import { renderSetHeading } from "@monospaced/set-core";

const html = `<div class="app-dithered">${renderSetHeading({
  level: 1,
  size: "display-md",
  children: "MONOSPACED",
})}</div>`;
```

```css
:where(.set) .app-dithered {
  color: var(--set-color-brand-primary);
  mask-image: var(--set-shape-dither-12-image);
  mask-repeat: repeat;
  mask-size: calc(4 * var(--set-shape-dither-cell-md));
}
```

- **Tokens.** `--set-shape-dither-0-image` to `--set-shape-dither-16-image` are the 17 ordered dither tiles, from empty to solid, as mask images. `--set-shape-dither-cell-xs` to `-xl` are the cell widths; four cells make a tile, so the mask size is four times the cell.
- **Text.** Masking text masks the glyphs. Keep it to display sizes, at `12` of 16 or denser, and keep the real text in the DOM so it stays readable to assistive technology. Dithered text isn't contrast-safe, so the heading must still read without the effect, or carry a solid fallback at small sizes.
- **Pixel snapping.** Cell widths are whole CSS pixels. At fractional device pixel ratios, 1.25 or 1.5, cells render unevenly. Accept it rather than fight it.
- **Ramps.** A CSS mask can't threshold a gradient. For a ramp, step through the tiles in bands, as `Dither`'s `ramp` does, or use that component.
- **Not the brand tiles.** `Pattern`'s `tileLight`, `tile` and `tileDark` are the brand's staggered lattice in 1:2 character cells; the dither tiles are square dots on the aligned Bayer lattice. They're different textures, not the same thing at three densities.
