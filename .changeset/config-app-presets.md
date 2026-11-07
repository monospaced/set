---
"@monospaced/set-config": minor
---

`@monospaced/set-config/eslint` is now a complete flat config for a web
project: `@eslint/js`, `typescript-eslint` and `@eslint/json` recommended with
browser globals for source, Node globals for tool configs and scripts, Set's
import sort and the Baseline rule. `@monospaced/set-config/eslint/react` adds
`eslint-plugin-react-hooks` and `eslint-plugin-react-refresh` at their
defaults. The previous layer-on preset moves to
`@monospaced/set-config/eslint/rules`; update the import if you compose your
own config. Add `@monospaced/set-config/browserslist/lightningcss`, the
Baseline query as Lightning CSS targets for Vite. `browserslist`,
`lightningcss` and `typescript` become optional peer dependencies.
