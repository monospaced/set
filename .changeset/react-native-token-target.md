---
"@monospaced/set-system": minor
"@monospaced/set-tokens": minor
---

Add a React Native token target. `@monospaced/set-tokens/react-native/mnsp`
and `/react-native/wrfr` export a typed, values-only module per brand with
base tokens merged in, shaped as a context matrix the runtime indexes
directly: `static` (varies on nothing), `size.<context>` (fully resolved at
each size context) and `theme.<light|dark>.<default|brand>`. Values are
converted for React Native: px dimensions become unitless numbers,
durations milliseconds, DTCG colors `#rrggbb` / `rgba()` strings, shadows
`shadow*` + `elevation` objects, typography composites text-style objects
with absolute `lineHeight`, font weights the nearest hundred React Native
accepts, and font-family stacks their first family. The `.d.ts` types every
value literally. The
`forcedColors` axis and the CSS content-theme contexts are not emitted.
Resolvers opt in via `$defs.build.targets.reactNative`.
