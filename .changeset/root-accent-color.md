---
"@monospaced/set-core": patch
---

Apply `accent-color` on `.set`. It was declared before `all: initial`, which reset it, so native controls that Set doesn't restyle used the browser's default accent.
