---
"@monospaced/set-core": minor
---

Add the video component.

`video` (Graphic/Video) wraps the HTML video element in the image
component's mold: a `set-video` host with `fit` modes (`intrinsic` |
`fluid`), playback props (`autoPlay`, `controls`, `loop`, `muted`,
`playsInline`), `poster`, `preload`, intrinsic `width`/`height`, and a
required `src`. Spec, CSS, tests, story, and a generated React wrapper
are included.

The `set-video` custom element runtime (registered via
`defineSetComponents()` or `defineSetVideo()`) suspends autoplaying
video while `(prefers-reduced-motion: reduce)` matches — the `autoplay`
attribute is withdrawn so pending playback cannot start — and resumes
playback when the preference relaxes.

Fixes `width`/`height` attributes on `video` and `canvas` inside a Set
tree: the root `all: revert` descendant reset discards presentational
hints, so both join `img` in the reset's exclusion list. Previously
every dimension attribute on a video was silently ignored.

Prop documentation now follows the SPEC-is-canonical convention for
image and video: interface JSDoc is short and descriptive; guidance
(conditional behavior, browser policies, per-fit-mode `width`/`height`
semantics) lives in the spec descriptions that drive the docs.
