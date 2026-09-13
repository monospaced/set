---
"@monospaced/set-core": patch
---

Move the animated sequence hand-off entirely into the runtime, so it can no longer clip on slow connections. Previously the lead overlay's fade-out ran from a CSS timer anchored to render, and `defineSetImage` re-anchored it to load; on a slow link the runtime and the overlay's frames both arrive late, so the CSS timer could still win and hide the overlay before its frames had played. The default CSS timer is gone: `defineSetImage` now sets `data-sequencing` on each lead overlay once that overlay's frames have loaded, and only then does the fade run — there is no render-anchored timer left to race. Without the runtime a sequenced image simply holds the lead overlay's last frame and never reveals the base.
