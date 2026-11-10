---
"@monospaced/set-system": minor
"@monospaced/set-tokens": minor
---

Remove the `pending` and `live` intents. `warning` now also covers pending or unresolved state, and `success` also covers live or on-air state. The `--set-color-intent-pending-*` and `--set-color-intent-live-*` variables are gone; switch to the warning and success variables.

Add `brand.secondary`, `brand.tertiary`, `brand.supportSecondary` and `brand.supportTertiary`. In mnsp these are magenta and yellow; in wrfr they alias the primary and support colors.

Rework the mnsp data palette. Slots 00 to 02 are the brand primary, secondary and tertiary colors, and slots 03 to 09 follow the same hue sequence in both themes with wider lightness and hue steps between neighbours. Every slot clears 3:1 against the default, panel and subtle backgrounds of both surfaces.

Brand theme files now hold only the tokens that differ from the default theme. The content-theme dark brand surface resolves on top of the dark default theme as a result, which also corrects its `logo.neutral` from black to white.
