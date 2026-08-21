---
"@monospaced/set-core": minor
---

Add an `adaptive` prop to the image and `renderSetPosterImage`.
Adaptive images render paired light/dark variants of a Screen scheme
stack — one shared asset addressed by `#light`/`#dark` fragments — and
the display scheme tokens decide which variant shows, so imagery tracks
theme, surface, and content-theme context. Adaptive poster media is
typed to exclude `contentTheme`; the lock remains for foregrounds over
non-adaptive media.
