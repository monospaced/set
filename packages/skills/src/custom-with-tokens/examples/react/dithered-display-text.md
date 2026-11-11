# Dithered display text (react)

A display heading set in dithered ink, so a headline reads as a bitmap tone rather than a flat fill. `Pattern` dithers a surface, not text, so this is a gap: the recipe masks the heading with the dither tiles the system publishes as tokens.

```tsx
import { Heading } from "@monospaced/set-react";

export function DitheredTitle() {
  return (
    <div className="app-dithered">
      <Heading level={1} size="display-md">
        MONOSPACED
      </Heading>
    </div>
  );
}
```

```css
:where(.set) .app-dithered {
  color: var(--set-color-brand-primary);
  mask-image: var(--set-shape-dither-12-image);
  mask-repeat: repeat;
  mask-size: calc(4 * var(--set-shape-dither-cell-xs));
}
```

- **Tokens.** `--set-shape-dither-0-image` to `--set-shape-dither-16-image` are the 17 ordered dither tiles, from empty to solid, as mask images. `--set-shape-dither-cell-xs` to `-xl` are the cell widths; four cells make a tile, so the mask size is four times the cell. For 1:2 character cells, give the mask twice the height: `mask-size: calc(4 * cell) calc(8 * cell)`.
- **Text.** Masking text masks the glyphs. Keep it to display sizes, at `12` of 16 or denser, and keep the real text in the DOM so it stays readable to assistive technology. Dithered ink isn't contrast-safe, so the heading must still read without the effect, or carry a solid fallback at small sizes.
- **Pixel snapping.** Cell widths are whole CSS pixels. At fractional device pixel ratios, 1.25 or 1.5, cells render unevenly. Accept it rather than fight it.
- **Ramps.** A CSS mask can't threshold a gradient. For a ramp, step through the tiles in bands, as `Pattern`'s `ditherRamp` does, or use that variant.
- **Flat levels in character cells.** For a flat 25%, 50% or 75% in character cells, `Pattern`'s `tileLight`, `tile` and `tileDark` variants are the brand's own staggered lattice; the dither tiles use the aligned Bayer lattice.
