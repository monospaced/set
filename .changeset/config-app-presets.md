---
"@monospaced/set-config": minor
---

Add complete ESLint presets for apps. `@monospaced/set-config/eslint/app`
composes `@eslint/js`, `typescript-eslint` and `@eslint/json` recommended
with browser globals for source, Node globals for tool configs and scripts,
Set's import sort and the Baseline rule; `@monospaced/set-config/eslint/react`
adds `eslint-plugin-react-hooks` and `eslint-plugin-react-refresh` at error
level. The existing `eslint` export stays as the layer-on preset. Add
`@monospaced/set-config/browserslist/lightningcss`, the Baseline query as
Lightning CSS targets for Vite's `css.lightningcss.targets`. `browserslist`,
`lightningcss` and `typescript` become optional peer dependencies.
