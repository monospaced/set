---
"@monospaced/set-core": minor
---

Ship only the icons Set declares instead of the full TDesign catalog.

`@monospaced/set-core` used to bundle the entire ~1200-icon TDesign registry
into any consumer that rendered a single icon. It now ships only a declared set,
cutting the package's minified bundle by ~440 KB (~104 KB gzip). Two hand-edited
lists define it: `icons-tdesign.ts` (`TDESIGN_ICON_NAMES`, the catalog names to
pull) and `icons-custom.ts` (first-party icons, included automatically). A
generate script emits the icon registry from both.

Icon-name props are now typed. `icon`/`name` (on icon, button, menu, …) accept
the `SetIconName` union — the TDesign selection plus custom names — rather than
`string`, so invalid names are caught at compile time with autocomplete. React
inherits this via `SetIconProps`. The exported `SET_ICON_NAMES` (formerly
`SET_ICON_RECOMMENDED`) is the runtime list of every shipped name.

BREAKING: `name`/`icon` props now accept only the shipped names; other TDesign
names are a type error and throw at runtime. To add one: add a name to
`icons-tdesign.ts`, or an icon to `icons-custom.ts`, and run
`pnpm icons:generate`.

Also fixes the sidebar trigger/collapse icon: it now renders a purpose-built
`panel-left` icon (TDesign-styled — sharp corners, full-height divider) instead
of a rotated `horizontal` icon.
