---
"@monospaced/set-config": minor
---

Enforce Set's Baseline target in the ESLint and Stylelint presets. A new
`@monospaced/set-config/baseline` export holds the target (`"widely"`), and
the browserslist query, the esbuild target and both lint rules derive from
it. ESLint reports JS builtins and Web APIs outside Baseline Widely available
via `eslint-plugin-baseline-js`; turn the rule off for code that runs under
Node. Stylelint reports CSS features outside it via
`stylelint-plugin-use-baseline`, ignoring a short list of progressive
enhancements that degrade gracefully. Anything else needs an `@supports`
guard or an inline justification.
