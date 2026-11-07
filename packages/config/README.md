# @monospaced/set-config

Shared developer-tooling config for Set. ESLint, Stylelint, Prettier, browserslist presets plus the `--set-*` token catalog for editor autocomplete and tooling — install once, plug in via subpath imports.

## Baseline

Set targets [Baseline](https://web.dev/baseline) Widely available: features supported in every core browser for at least 30 months. One constant encodes that target and every preset derives from it, so the browserslist query, the esbuild target, and the ESLint and Stylelint Baseline rules can never disagree.

```ts
import baseline from "@monospaced/set-config/baseline"; // "widely"
```

- **ESLint** reports JS builtins and Web APIs outside the target as errors, via [`eslint-plugin-baseline-js`](https://github.com/3ru/eslint-plugin-baseline-js). Unsupported JS throws at runtime, so this is a hard floor.
- **Stylelint** reports CSS properties, values, functions, at-rules and selectors outside the target as errors, via [`stylelint-plugin-use-baseline`](https://github.com/ryo-manba/stylelint-plugin-use-baseline). Unsupported CSS degrades silently where unsupported JS throws, so the preset ignores a short list of progressive enhancements that degrade gracefully. Anything else needs an `@supports` guard or an inline justification:

  ```css
  /* stylelint-disable-next-line plugin/use-baseline -- Baseline newly available 2025; physical fallback above */
  overflow-block: auto;
  ```

## ESLint

Three flat-config presets. `eslint` itself is a peer dependency — install it alongside, plus `typescript` for the app and React presets.

### App

A complete config for a browser app: `@eslint/js` recommended, `typescript-eslint` recommended, `@eslint/json` recommended (with comments allowed in `tsconfig*.json` and `.vscode/*.json`), browser globals for source files, Node globals for `*.config.*` files and `scripts/`, Set's import sort, and the Baseline rule (off for the Node-run files, where the `engines` range is the support contract). `dist`, `build` and `coverage` are ignored.

```js
// eslint.config.mjs
import setEslint from "@monospaced/set-config/eslint/app";

export default [
  ...setEslint,
  // your local rules / overrides
];
```

### React

The app preset plus `eslint-plugin-react-hooks` recommended and `eslint-plugin-react-refresh`, every rule at error level (Set lints pass or fail), and the compiler-only `react-hooks/incompatible-library` rule off.

```js
// eslint.config.mjs
import setEslint from "@monospaced/set-config/eslint/react";

export default [...setEslint];
```

### Layer

Only Set's own conventions — import/export sort (`simple-import-sort`) and the Baseline rule (`baseline-js/use-baseline`, see above) — for layering onto a config you already have. Turn the Baseline rule off for code that runs under Node.

```js
// eslint.config.mjs
import setEslint from "@monospaced/set-config/eslint";

export default [
  // your TypeScript / JSON / JS configs here
  ...setEslint,
  {
    files: ["**/scripts/**", "**/*.config.{js,mjs,ts}"],
    rules: { "baseline-js/use-baseline": "off" },
  },
];
```

## Stylelint

Drop-in shareable config — extends `stylelint-config-standard` and layers on Set's CSS authoring discipline: alphabetical property ordering (`stylelint-order`), token-discipline rules (no raw colors, no absolute lengths, no raw time, no `!important`), logical-CSS enforcement (`stylelint-plugin-logical-css`) so component CSS stays portable across writing modes, and the Baseline rule (`plugin/use-baseline`, see above).

```js
// .stylelintrc.mjs
export default {
  extends: ["@monospaced/set-config/stylelint"],
};
```

Or as JSON:

```json
{
  "extends": ["@monospaced/set-config/stylelint"]
}
```

`stylelint` itself is a peer dependency — install it alongside.

### Authoring stance

This preset is opinionated. It encodes Set's compose-first / custom-with-tokens authoring discipline rather than a generic Stylelint baseline. Two defaults are worth highlighting because they often surface in consumer projects:

- **Same-file custom-property scope.** The `set/set-known-tokens` rule rejects `var(--*)` references that aren't defined in the same file — including consumers' own organisation across CSS files (`theme.css` defining vars, `card.css` consuming them). Define within the file you use it in. Catalog tokens (`--set-*` from the catalog) and same-file definitions both pass; everything else fails.
- **Tight value lists.** `border-radius`, `border-width`, `box-shadow`, `font`, `font-weight`, `line-height`, `opacity`, and the timing-function properties only accept `var()`, function calls (`calc()`, `cubic-bezier()`, etc.), `0`/`1`/keywords, and percentages.

If your project organises tokens across files and you want catalog enforcement without same-file scope, opt out:

```js
export default {
  extends: ["@monospaced/set-config/stylelint"],
  rules: {
    "set/set-known-tokens": [true, { allowCrossFile: true }],
  },
};
```

Catalog enforcement for `--set-*` references is preserved; non-`--set-` customs pass through. Any individual rule can be turned off the usual way (`"rule-name": null`) — overrides are normal.

## Token catalog

`@monospaced/set-config/set.catalog.css` is a `:root` block listing every published `--set-*` token with its resolved value and `$description`. Used two ways:

- **Editor autocomplete.** For VS Code, drop a copy or symlink into your project's `.vscode/` directory — VS Code's CSS workspace scan picks up the declarations and surfaces typeahead and value hover for every `var(--set-*)` when authoring CSS. Other editors with custom-CSS-data support can consume the same file via their own configuration.

  ```sh
  cp node_modules/@monospaced/set-config/set.catalog.css .vscode/
  ```

- **Stylelint validation.** The Stylelint preset's `set/set-known-tokens` rule reads the catalog automatically to validate `var(--set-*)` references. No setup required beyond extending the preset.

## Browserslist query

```ts
import browserslist from "@monospaced/set-config/browserslist";
```

Use the query directly in tools that accept query arrays (for example Autoprefixer `overrideBrowserslist`, or Lightning CSS via `browserslistToTargets`).

For plain `package.json` `browserslist` fields, use the equivalent query. Autoprefixer, Lightning CSS and anything else built on the `browserslist` package read this field automatically, so it is the single source of truth for a project:

```json
{
  "browserslist": ["baseline widely available"]
}
```

## Vite targets

The esbuild target string and the Lightning CSS targets object, both derived from the Baseline query. `browserslist` and `lightningcss` are optional peer dependencies, needed only for the Lightning CSS export.

```ts
// vite.config.ts
import target from "@monospaced/set-config/browserslist/esbuild";
import targets from "@monospaced/set-config/browserslist/lightningcss";
import { defineConfig } from "vite";

export default defineConfig({
  build: { cssMinify: "lightningcss", target },
  css: { lightningcss: { targets }, transformer: "lightningcss" },
});
```
