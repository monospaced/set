---
"@monospaced/set-core": minor
---

Add an `activity` state to `button` for busy/loading affordances. `activity: "idle"` primes the indicator — the spinner and a hidden ", busy" status are rendered but not shown — so the state can be toggled to `"busy"` by flipping the attribute at runtime with no re-render. `activity: "busy"` reveals the spinner (in place of the icon, or centered over the button when there is no icon), appends ", busy" to the accessible name, and emits `aria-disabled="true"`. The button stays visually at rest; guarding activation (e.g. `preventDefault`) and any live-region announcement remain the consumer's responsibility.

Also refines `spinner`'s `fill` size to preserve its ratio (fills the container's height, auto width) instead of stretching to fill both axes.
