---
"@monospaced/set-core": patch
---

Fix `defineSetImage` clipping the animated sequence hand-off on slow connections. The runtime started the hide as soon as `img.complete` was true, but `complete` can read `true` before the `<picture>` has selected and begun loading its source (both iOS Safari and Chrome), so the hide anchored to render and cut the overlay before its frames had loaded. It now gates on `naturalWidth` — non-zero only once real pixels have loaded — and otherwise waits for `load` (or `error`), so the hand-off runs from playback readiness.
