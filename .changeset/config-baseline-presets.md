---
"@monospaced/set-config": minor
---

Enforce Set's Baseline target in the ESLint and Stylelint presets. A new
`@monospaced/set-config/baseline` export holds the target (`"widely"`), and
the browserslist query, the esbuild target and both lint rules derive from
it. ESLint reports JS builtins and Web APIs outside Baseline Widely available
as errors via `eslint-plugin-baseline-js`; Stylelint reports CSS features
outside it as warnings via `stylelint-plugin-use-baseline`, since unsupported
CSS degrades silently where unsupported JS throws. Turn the ESLint rule off
for code that runs under Node.
