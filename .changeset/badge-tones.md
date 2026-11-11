---
"@monospaced/set-core": minor
---

Collapse the Badge tones to `notification`, `attention`, `success` and `error`. `attention` replaces `pending` and `warning` and uses the warning intent; `success` now also covers the former `live` tone. Alert and Banner keep their existing tones.

Surface, Box and Poster accept `brandSubtle`, `brandSecondary` and `brandTertiary` as surface values alongside `default` and `brand`. Card, Panel and Sidebar accept `default` or `brandSubtle`, since their background is always the panel.
