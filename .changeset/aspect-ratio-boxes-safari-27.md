---
"@monospaced/set-core": patch
---

Fix Logo, Spinner and Avatar sizing in Safari 27. Each derived its inline
size from `aspect-ratio` while holding content sized by percentage or an
SVG with a viewBox only, and Safari 27 now feeds that content back into the
box's intrinsic size, so the animated logo claimed its SVG's 300px fallback
width in flex layouts. Logo and Spinner gain `contain: inline-size`, keeping
the width on the ratio transfer in every browser; Avatar sets both axes
from `--set-avatar-size` directly.
