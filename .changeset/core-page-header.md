---
"@monospaced/set-core": minor
---

`Page` owns its header's ground. Three new props apply to the `<header>` itself: `headerBackground` (`default`, `panel` or `transparent`, defaulting to `default`, so a sticky header is opaque over scrolled content unless asked otherwise), `headerSurface` and `headerContentTheme`, as on `Surface`; the header inherits the surrounding surface when `headerSurface` is omitted. The header centres its content vertically in its reserved block size, and its border takes its color from the header's own surface. `stickyHeader` is renamed `headerSticky`, so the six header props share a prefix; the emitted attribute changes from `data-sticky-header` to `data-header-sticky`, in line with `data-header-border` and `data-header-size`. Hand-written markup that sets it needs updating.

Existing pages change in two ways: header content shorter than the header moves to the middle of it, and a header that composes its own colored `Surface` or `Box` shows the default background around it until it moves to `headerSurface` or `headerBackground`.

The header's block size is now a layout token. `Page` sets `--set-layout-page-header-block-size-current` from `headerSize` in place of its private `--set-page-header-block-size`, and `Sidebar` reads the token. Project CSS can read it too: it is in the catalog, so lint accepts it.
