# @measured/set-config

Shared developer-tooling config for Set. ESLint, Stylelint, Prettier, browserslist presets plus the `--set-*` token catalog for editor autocomplete and tooling — install once, plug in via subpath imports.

## ESLint

Flat-config preset that adds Set's import/export sort convention (`simple-import-sort`) for `.mjs` / `.ts` / `.tsx`. Layer it onto your own ESLint baseline — bring your own TypeScript / JSON / JS recommended.

```js
// eslint.config.mjs
import setEslint from "@measured/set-config/eslint";

export default [
  // your TypeScript / JSON / JS configs here
  ...setEslint,
  // your local rules / overrides
];
```

`eslint` itself is a peer dependency — install it alongside.

## Stylelint

Drop-in shareable config — extends `stylelint-config-standard` and layers on Set's CSS authoring discipline: alphabetical property ordering (`stylelint-order`), token-discipline rules (no raw colors, no absolute lengths, no raw time, no `!important`), and logical-CSS enforcement (`stylelint-plugin-logical-css`) so component CSS stays portable across writing modes.

```js
// .stylelintrc.mjs
export default {
  extends: ["@measured/set-config/stylelint"],
};
```

Or as JSON:

```json
{
  "extends": ["@measured/set-config/stylelint"]
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
  extends: ["@measured/set-config/stylelint"],
  rules: {
    "set/set-known-tokens": [true, { allowCrossFile: true }],
  },
};
```

Catalog enforcement for `--set-*` references is preserved; non-`--set-` customs pass through. Any individual rule can be turned off the usual way (`"rule-name": null`) — overrides are normal.

## Token catalog

`@measured/set-config/set.catalog.css` is a `:root` block listing every published `--set-*` token with its resolved value and `$description`. Used two ways:

- **Editor autocomplete.** For VS Code, drop a copy or symlink into your project's `.vscode/` directory — VS Code's CSS workspace scan picks up the declarations and surfaces typeahead and value hover for every `var(--set-*)` when authoring CSS. Other editors with custom-CSS-data support can consume the same file via their own configuration.

  ```sh
  cp node_modules/@measured/set-config/set.catalog.css .vscode/
  ```

- **Stylelint validation.** The Stylelint preset's `set/set-known-tokens` rule reads the catalog automatically to validate `var(--set-*)` references. No setup required beyond extending the preset.

## Browserslist query

```ts
import browserslist from "@measured/set-config/browserslist";
```

Use the query directly in tools that accept query arrays (for example Autoprefixer `overrideBrowserslist`).

For plain `package.json` `browserslist` fields, use the equivalent query:

```json
{
  "browserslist": ["baseline widely available"]
}
```

## Vite/esbuild target

```ts
import target from "@measured/set-config/browserslist/esbuild";
```
