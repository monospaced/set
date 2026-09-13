---
"@monospaced/set-core": minor
---

Make `image` a `set-image` custom element, consistent with the other runtime components. The host tag changes from `<div class="set-image">` to `<set-image class="set-image">` (same class and `data-*`; selectors keyed on `.set-image` are unaffected, but `div.set-image` selectors are not).

Add `defineSetImage` (and `SET_IMAGE_TAG_NAME`), wired into `defineSetComponents`. It's optional progressive enhancement — SSR output is fully functional without it — and only enhances sequenced (`leadSrc`) images: it anchors the lead overlay's hand-off to when the overlay's frames have loaded (rather than a fixed delay from render, which can clip the hand-off on slow connections), and re-runs the entrance when a page is restored from the back/forward cache.
