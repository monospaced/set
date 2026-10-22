---
"@monospaced/set-core": patch
---

Fix icon wrappers ballooning in Safari 27. Button, Lightswitch and Avatar
icon wrappers set only a block size and derived their inline size from
`aspect-ratio`, while the `fill` icon inside was sized by percentage in both
axes. That cycle resolved to the ratio in Chrome and Firefox, but Safari 27
now sizes the wrapper from its content. Wrappers now declare both axes from
a per-component icon-size custom property (`--set-button-icon-size`,
`--set-lightswitch-icon-size`, `--set-avatar-icon-size`), and the `fill`
icon takes its inline size from its own viewBox (`inline-size: auto`)
instead of `100%`, matching the Spinner `fill` size.
