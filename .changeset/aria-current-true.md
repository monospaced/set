---
"@monospaced/set-core": minor
---

Add `aria-current="true"` support to Link and Nav for marking the current section — the item a nested page belongs to (`/notes/slug` highlighting Notes) — where `page` would overclaim. `SetLinkCurrent` widens to `"page" | "true"`, and Nav items adopt the same enum via the new `SetNavCurrent` type.

Breaking: `SetNavItem.current` is no longer a boolean — replace `current: true` with `current: "page"` (exact page) or `current: "true"` (current section).
