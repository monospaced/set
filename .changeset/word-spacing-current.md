---
"@monospaced/set-system": patch
"@monospaced/set-tokens": patch
"@monospaced/set-core": patch
---

Publish the word-spacing switch as a token. `typography.wordSpacing.current` is the word spacing Root applies to every element; set `--set-typography-word-spacing-current` on a container to switch a subtree, for example to the monospaced value. Root now opts in `[data-monospaced]` on any element, plus `code`, `pre`, `kbd`, `samp` and `table`, so Text and Prose no longer carry their own rules. The private `--set-word-spacing` custom property is removed.
