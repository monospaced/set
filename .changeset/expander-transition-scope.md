---
"@monospaced/set-core": patch
---

Scope the expander's transitions to the properties it animates
(`inline-size`, `inset-inline-start`, `transform`). The inner bar's
unscoped transition covered `all`, so its `currentcolor` background
animated on theme switches; the open/close choreography is unchanged.
The nav and sidebar triggers share the expander, so they inherit the
fix.
