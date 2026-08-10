---
"@monospaced/set-core": patch
---

Fix the nav close button disappearing when opened over a scrolled
sticky header. The scroll lock applied `overflow: hidden` to both the
root and body; making body a scroll container captured
`position: sticky` descendants, snapping the page header (and the
in-flow expander button inside it) back to its static document
position while the fixed overlay covered the viewport. The lock now
applies to the root only, so sticky headers stay stuck while scroll
is locked — the nav and sidebar both use this lock.
