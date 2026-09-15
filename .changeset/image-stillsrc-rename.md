---
"@monospaced/set-core": minor
---

Rework the image animated API. The reduced-motion still is now `stillSrc` (was `still`, at the top level and in `sources[]`), and the `animated` boolean is gone — providing a `stillSrc` is what opts an image into the animated machinery. Nothing in the props animates the asset itself; they configure the layering (reduced-motion fallback, light/dark `{scheme}` pairing, `leadSrc` sequencing), and the fallback is the one non-negotiable layer, so its presence is the switch. `SetPosterImageProps` gains `stillSrc` and `sources`, so Poster media can be animated and art-directed too.

Breaking: rename `still:` to `stillSrc:` and drop `animated: true` from `renderSetImage`/`buildSetImage` calls. Configurations that were previously silently ignored now throw: `leadSrc` or a `sources[].stillSrc` without a top-level `stillSrc`.
