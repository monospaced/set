---
"@monospaced/set-icons": minor
"@monospaced/set-core": minor
---

Add `@monospaced/set-icons`: Set icons as data. The icon registry that
lived inside core (the TDesign name list, the first-party icons, the
generator and the generated geometry) moves to its own package, typed
with a literal `IconName` union, so platforms other than the web can
share it without depending on the web library. Core now depends on it
and re-exports `SET_ICON_NAMES` and `SetIconName` unchanged;
`tdesign-icons-svg` is no longer a runtime dependency of core.
