---
"@monospaced/create-set": patch
"@monospaced/set-config": patch
"@monospaced/set-core": patch
---

Update dependencies within their current majors. Scaffolded projects install the newer Vite 7, Vitest 4, React 19, Prettier and lint-staged releases.

Style Dictionary 5.8 corrects the generated tokens. The `0.025` alpha is no longer rounded to `0.03`, so `--set-color-background-subtle` and, in `wrfr`, the `--set-color-intent-*-subtle` tokens render very slightly lighter, as authored. Durations now output in seconds and zero lengths as `0rem`, with no change in effect, but code that parses a duration token as milliseconds needs updating.
