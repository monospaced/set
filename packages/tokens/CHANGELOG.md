# @measured/set-tokens

## 0.4.3

## 0.4.2

## 0.4.1

## 0.4.0

### Minor Changes

- cd56da4: Normalise dotted token paths in `set.*.tokens.json` to kebab-case (matching the CSS custom property form) and emit contexts with the default context first, preserving source order instead of sorting alphabetically. Token values are unchanged; the dotted key shape and key order are.

### Patch Changes

- ef80527: Order the semantic `effect.*` keys (`opacity`, `shadow`, `stroke`, `filter`) so the dist JSON reads in a more natural order. Token names, values, and descriptions are unchanged.
- ef80527: Order the `radius.ratio` keys (`default` before `lg`) so the dist JSON reads naturally, and tighten the `layout.spacing.vertical.700` description ("Default layout vertical step"). Token names and values are unchanged.
- 7d1eda0: Clarify the `layout.spacing.vertical.*` and `container.gutter.narrow` token descriptions to state explicitly that these are the responsive layout variants. Token names and values are unchanged.
- e1147f8: Reorder a few semantic token keys so the dist JSON reads in a more natural order: `typography.measure` now lists `default` before `tight`, and `layout.container.gutter` lists `default` before `narrow`. Token names, values, and descriptions are unchanged.
- b08006c: Reorder typography token groups in the semantic source (and matching dist JSON output) to a more readable order — `paragraph` moves ahead of `leading`. Token names and values are unchanged.

## 0.3.0

## 0.2.0

### Minor Changes

- 134b977: Add the `motion.duration.3000` token (3s on `mnsp`, 0ms on `wrfr`) for ambient / reduced-motion loops. Renames `motion.duration.600` from `Longest duration step.` to `Long duration step.` so the scale stays accurate now that `3000` is the longest.

  `@measured/set-core`: the spinner's `prefers-reduced-motion` pulse animation now references `var(--set-motion-duration-3000)` instead of a hard-coded duration.

- 04aa658: Author `$description` coverage across every semantic token in `mnsp` and `base`. Descriptions follow a consistent role-anchor pattern, ground examples in actual core usage, and avoid CSS-specific syntax so they read sensibly across platforms (CSS, JSON, design tools). A few small structural changes shipped alongside: `background.inverse` is removed (use surface context instead), `typeStep.100` / `typeStep.150` split into a tight/loose-leading pair, and default steps are marked on the `spacing.vertical`, `spacing.horizontal`, and `layout.spacing.vertical` ramps.
- afe32e5: Introduce `@measured/set-tokens` — the design system as a JSON artifact, with its accompanying JSON Schema. For documentation sites, MCP servers, agents, and any tooling that wants tokens as data.

  ```js
  import mnsp from "@measured/set-tokens/mnsp";
  import wrfr from "@measured/set-tokens/wrfr";
  import base from "@measured/set-tokens/base";
  import schema from "@measured/set-tokens/schemas/v1";
  ```

### Patch Changes

- b00bb58: Add concise `description` to each public package's `package.json` and align the README's first paragraph to match. The descriptions are what npm shows in list views; they were previously empty across the repo, leaving npm to fall back to whatever appeared in the README first line.

## 0.2.0-alpha.6

## 0.2.0-alpha.5

## 0.2.0-alpha.4

### Minor Changes

- 04aa658: Author `$description` coverage across every semantic token in `mnsp` and `base`. Descriptions follow a consistent role-anchor pattern, ground examples in actual core usage, and avoid CSS-specific syntax so they read sensibly across platforms (CSS, JSON, design tools). A few small structural changes shipped alongside: `background.inverse` is removed (use surface context instead), `typeStep.100` / `typeStep.150` split into a tight/loose-leading pair, and default steps are marked on the `spacing.vertical`, `spacing.horizontal`, and `layout.spacing.vertical` ramps.

## 0.2.0-alpha.3

### Minor Changes

- afe32e5: Introduce `@measured/set-tokens` — the design system as a JSON artifact, with its accompanying JSON Schema. For documentation sites, MCP servers, agents, and any tooling that wants tokens as data.

  ```js
  import mnsp from "@measured/set-tokens/mnsp";
  import wrfr from "@measured/set-tokens/wrfr";
  import base from "@measured/set-tokens/base";
  import schema from "@measured/set-tokens/schemas/v1";
  ```
