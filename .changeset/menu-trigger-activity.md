---
"@monospaced/set-core": minor
---

Add `triggerActivity` to `menu`, forwarding a busy/loading state to the composed trigger button (see `button`'s `activity`). `idle` primes the trigger's spinner and hidden ", busy" status; `busy` reveals the spinner, appends ", busy" to the trigger's accessible name, and marks it busy via `aria-disabled`.
