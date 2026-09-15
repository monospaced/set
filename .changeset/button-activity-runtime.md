---
"@monospaced/set-core": minor
---

Add runtime toggling for the button activity state. `applySetButtonActivity(element, activity)` applies the same attributes the `activity` render prop produces to a live `.set-button` (pass `null` to clear), sharing one definition with `buildSetButton` so render and runtime can't drift. `menu`'s custom element gains a reactive `triggerActivity` property that toggles the busy affordance on its trigger — `menu.triggerActivity = "busy"`.

Both are for vanilla/SSR runtimes; in React, drive the render props (`activity` / `triggerActivity`) and re-render.
