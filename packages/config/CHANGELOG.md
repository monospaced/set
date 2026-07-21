# @measured/set-config

## 0.4.3

## 0.4.2

## 0.4.1

## 0.4.0

## 0.3.0

## 0.2.0

### Minor Changes

- 2ba877c: Add `@measured/set-config/eslint` and `@measured/set-config/stylelint` subpath presets.

  The ESLint preset is a focused flat-config block that adds Set's import/export sort convention (`simple-import-sort`) for `.mjs` / `.ts` / `.tsx`. Layer it onto your own ESLint baseline — bring your own TypeScript / JSON / JS recommended.

  The Stylelint preset extends `stylelint-config-standard` and adds alphabetical property ordering via `stylelint-order`. Import the default export from `.stylelintrc.mjs`.

  `eslint` and `stylelint` are now `peerDependencies` of this package — install them alongside.

- 29965e7: Add an editor IntelliSense lookup for Set's `--set-*` custom properties. The new file ships at `@measured/set-config/editor/set.intellisense.css` listing every published semantic token (base + mnsp at default context) with its resolved value and `$description`. Consumers drop the file into their project's `.vscode/` directory and VS Code's CSS workspace scan surfaces typeahead and value hover for every var when authoring CSS.

  ```sh
  cp node_modules/@measured/set-config/editor/set.intellisense.css .vscode/
  ```

- 056f669: Expand token-enforcement linting and rename the editor lookup.

  **Lint coverage**
  - New custom rule `set/set-known-tokens` validates every `var(--*)` reference against either the Set catalog (for `--set-*` names) or a same-file definition. Cross-file custom properties — including consumers' own organisation across CSS files — are rejected by default; define within the file you use it in. Consumers who organise tokens across files can opt out of the same-file gate via `[true, { allowCrossFile: true }]` while keeping catalog enforcement for `--set-*`.
  - `scale-unlimited/declaration-strict-value` apply-list extended to `opacity`, `transition-timing-function`, `animation-timing-function`.
  - `declaration-property-unit-disallowed-list` extended to ban `rem` on `font-size`, the `border` shorthand (and logical variants), `outline-width`, `outline-offset`, and `max/min-{width,inline-size}`.
  - Custom error messages on every token-discipline rule point at the catalog so the violation moment doubles as discoverability.

  **Catalog rename and relocation**
  - `set.intellisense.css` is now `set.catalog.css`. The IntelliSense framing was VS Code-specific; the file is also consumed by the package's stylelint plugin and is editor-agnostic. Update the install-time copy step accordingly:

    ```sh
    cp node_modules/@measured/set-config/set.catalog.css .vscode/
    ```

  - File now ships at the package root rather than `editor/` (single artifact, no folder).

  **Package reorganisation**
  - Files reorganised into one folder per public subpath: `eslint/`, `stylelint/`, `browserslist/`. Internal `stylelint/plugin-set-tokens.mjs` colocated with its preset. Consumer subpath imports (`@measured/set-config/stylelint`, etc.) are unchanged.

- ec27a3a: Add logical-CSS enforcement to the Stylelint preset (`@measured/set-config/stylelint`) via `stylelint-plugin-logical-css`. Component CSS must use logical properties (`inline-size`, `block-size`, `margin-block-start`, etc.) and logical keywords (`text-align: start`) over physical equivalents, so consumer code retains LTR/RTL portability for free. `resize` is exempted from the keyword check — the logical `block` / `inline` values are still experimental per MDN and don't have full browser support yet.
- 53caec4: Add token-discipline rules to the Stylelint preset (`@measured/set-config/stylelint`):
  - Raw color values are disallowed. Use a `var(--set-color-*)` token, a CSS keyword (`transparent`, `currentcolor`, `inherit`, etc.), or a CSS Color Module Level 4 system color in forced-colors blocks. `color-mix` is disallowed too — compose colors at the token layer rather than ad-hoc in CSS.
  - Absolute lengths (`px`, `pt`, `pc`, `in`, `cm`, `mm`, `Q`) and raw time units (`s`, `ms`) are disallowed. Use design tokens. `rem` and `rlh` remain available as a documented escape hatch and as the right unit for `@container` breakpoints.
  - `!important` is disallowed.

  Two new tokens land alongside the rule additions:
  - `--set-color-background-scrim` — the translucent occluding layer used behind modals, drawers, and other overlay UI. Resolves to a new `primitive.color.alpha.black.56` (added to both brands) across all four `{light,dark} × {default,brand}` surfaces.
  - `--set-motion-duration-0` — for explicit zero-duration legs in `transition` shorthands without falling back to a raw `0s` literal.

### Patch Changes

- 18843e4: Relax the Stylelint preset's `declaration-property-unit-disallowed-list` for `max-width`, `min-width`, `max-inline-size`, and `min-inline-size` — `rem` is no longer banned on these properties. Block and inline sizing (set or constraint) is now uniformly handled: tokens preferred where they fit, `rem` accepted as a raw value for set dimensions, `%` / viewport units for genuinely contextual cases. The earlier ban created friction for legitimate one-off `max-inline-size: 30rem`-style usage where no token applied. The physical `max-width` / `min-width` entries were also redundant with `stylelint-plugin-logical-css/require-logical-properties`, which already flags them.
- b00bb58: Add concise `description` to each public package's `package.json` and align the README's first paragraph to match. The descriptions are what npm shows in list views; they were previously empty across the repo, leaving npm to fall back to whatever appeared in the README first line.

## 0.2.0-alpha.6

### Minor Changes

- 29965e7: Add an editor IntelliSense lookup for Set's `--set-*` custom properties. The new file ships at `@measured/set-config/editor/set.intellisense.css` listing every published semantic token (base + mnsp at default context) with its resolved value and `$description`. Consumers drop the file into their project's `.vscode/` directory and VS Code's CSS workspace scan surfaces typeahead and value hover for every var when authoring CSS.

  ```sh
  cp node_modules/@measured/set-config/editor/set.intellisense.css .vscode/
  ```

## 0.2.0-alpha.5

## 0.2.0-alpha.4

## 0.2.0-alpha.3

### Minor Changes

- 2ba877c: Add `@measured/set-config/eslint` and `@measured/set-config/stylelint` subpath presets.

  The ESLint preset is a focused flat-config block that adds Set's import/export sort convention (`simple-import-sort`) for `.mjs` / `.ts` / `.tsx`. Layer it onto your own ESLint baseline — bring your own TypeScript / JSON / JS recommended.

  The Stylelint preset extends `stylelint-config-standard` and adds alphabetical property ordering via `stylelint-order`. Import the default export from `.stylelintrc.mjs`.

  `eslint` and `stylelint` are now `peerDependencies` of this package — install them alongside.

- ec27a3a: Add logical-CSS enforcement to the Stylelint preset (`@measured/set-config/stylelint`) via `stylelint-plugin-logical-css`. Component CSS must use logical properties (`inline-size`, `block-size`, `margin-block-start`, etc.) and logical keywords (`text-align: start`) over physical equivalents, so consumer code retains LTR/RTL portability for free. `resize` is exempted from the keyword check — the logical `block` / `inline` values are still experimental per MDN and don't have full browser support yet.
- 53caec4: Add token-discipline rules to the Stylelint preset (`@measured/set-config/stylelint`):
  - Raw color values are disallowed. Use a `var(--set-color-*)` token, a CSS keyword (`transparent`, `currentcolor`, `inherit`, etc.), or a CSS Color Module Level 4 system color in forced-colors blocks. `color-mix` is disallowed too — compose colors at the token layer rather than ad-hoc in CSS.
  - Absolute lengths (`px`, `pt`, `pc`, `in`, `cm`, `mm`, `Q`) and raw time units (`s`, `ms`) are disallowed. Use design tokens. `rem` and `rlh` remain available as a documented escape hatch and as the right unit for `@container` breakpoints.
  - `!important` is disallowed.

  Two new tokens land alongside the rule additions:
  - `--set-color-background-scrim` — the translucent occluding layer used behind modals, drawers, and other overlay UI. Resolves to a new `primitive.color.alpha.black.56` (added to both brands) across all four `{light,dark} × {default,brand}` surfaces.
  - `--set-motion-duration-0` — for explicit zero-duration legs in `transition` shorthands without falling back to a raw `0s` literal.

## 0.2.0-alpha.2

## 0.1.1-alpha.1

## 0.1.1-alpha.0
