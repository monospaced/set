# @monospaced/set-assets

Runtime assets for Set. Fonts and favicons consumed by sites and apps building on the system.

## Fonts

Bundled `.woff2` files in `src/fonts/`:

- `Berkeley Mono Variable.woff2`
- `PlaypenSans[wght].subset.woff2`
- `FantasqueSansMono-Regular.subset.woff2`

Family names exposed by `fonts.css`:

- `Berkeley Mono`
- `Playpen Sans`
- `Fantasque Sans Mono`

### Usage

Import fonts before core styles:

```css
@import "@monospaced/set-assets/fonts.css";
@import "@monospaced/set-core/styles.css";
```

## Favicons

Bundled icon files in `src/favicons/`:

- `favicon.ico` — legacy fallback
- `favicon.svg` — modern scalable; adapts to OS light/dark via `prefers-color-scheme`
- `apple-touch-icon.png` — iOS home screen (180×180)
- `maskable-icon-192.png` — PWA / Android (192×192, maskable)
- `maskable-icon-512.png` — PWA / Android (512×512, maskable)

### Usage

Copy the icon files into the consumer site's static directory at build time (e.g. Vite/Next/Astro `public/`, plain HTML's web root) and reference them at root paths:

```html
<link href="apple-touch-icon.png" rel="apple-touch-icon" />
<link href="favicon.ico" rel="icon" sizes="32x32" />
<link href="favicon.svg" rel="icon" type="image/svg+xml" />
```

For PWA / Android install icons, reference the maskable PNGs from your manifest (`manifest.webmanifest`):

```json
{
  "icons": [
    {
      "purpose": "any",
      "sizes": "192x192",
      "src": "maskable-icon-192.png",
      "type": "image/png"
    },
    {
      "purpose": "maskable",
      "sizes": "192x192",
      "src": "maskable-icon-192.png",
      "type": "image/png"
    },
    {
      "purpose": "any",
      "sizes": "512x512",
      "src": "maskable-icon-512.png",
      "type": "image/png"
    },
    {
      "purpose": "maskable",
      "sizes": "512x512",
      "src": "maskable-icon-512.png",
      "type": "image/png"
    }
  ]
}
```

The manifest itself isn't shipped by this package — its icon paths must be resolvable from the consumer's served origin, so consumers author their own and copy the icon files into their static directory at build time.

For bundler-import workflows:

```js
import faviconSvg from "@monospaced/set-assets/favicons/favicon.svg";
import appleTouchIcon from "@monospaced/set-assets/favicons/apple-touch-icon.png";
```

The bundler resolves these to hashed asset URLs.
