---
"@monospaced/set-core": minor
---

Collapse the Badge tones to `notification`, `attention`, `success` and `error`. `attention` replaces `pending` and `warning` and uses the warning intent; `success` now also covers the former `live` tone. Alert and Banner keep their existing tones.

Surface, Box, Card, Panel, Poster and Sidebar accept `plate` as a surface value. Box's `background` prop gains `plate`, `plateSecondary` and `plateTertiary`, painting the matching plate background token.
