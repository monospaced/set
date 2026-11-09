# @monospaced/create-set

## 0.23.0

### Minor Changes

- f225317: Add a brand prompt and `--brand mnsp|wrfr` (default `mnsp`). The project imports that brand's stylesheet from core, `styles/mnsp.css` or `styles/wrfr.css`, rather than both, and sets `brand` on `Root` in every variant. Generated code and the CLI escape text with core's `escapeHtml`.
- 3349db9: Build with Vite 8. Scaffolded projects install Vite 8 and, in the React variant, `@vitejs/plugin-react` 6. Core's stylesheets are now minified by Lightning CSS, which makes them about 5% smaller with no intended change in rendering.
- e1fc04a: Scaffolded projects install Vitest 5.

### Patch Changes

- fd397f6: Scaffolded React projects install jsdom 31.
- 633c13e: Update dependencies within their current majors. Scaffolded projects install the newer Vite 7, Vitest 4, React 19, Prettier and lint-staged releases.

  Style Dictionary 5.8 corrects the generated tokens. The `0.025` alpha is no longer rounded to `0.03`, so `--set-color-background-subtle` and, in `wrfr`, the `--set-color-intent-*-subtle` tokens render very slightly lighter, as authored. Durations now output in seconds and zero lengths as `0rem`, with no change in effect, but code that parses a duration token as milliseconds needs updating.

- Updated dependencies [633c13e]
- Updated dependencies [3349db9]
- Updated dependencies [dd66e8e]
  - @monospaced/set-core@0.23.0

## 0.22.0

### Minor Changes

- ebb528d: Generated projects get a GitHub Actions workflow that runs lint, stylelint, format check, typecheck, test and build on pull requests and pushes to main, and a Dependabot config for npm and actions with grouped minor and patch updates and a three-day cooldown.
- 88dced7: Add the `prerender` variant (`--variant prerender`): pages are render functions in `src/pages`, prerendered to static HTML at build time by a Vite plugin, with one shared head in `src/document.ts` and per-page title and description. Both variants now discover pages by folder, so adding a page is adding a folder with an `index.html`.
- 14dcea3: Add the `react` variant (`--variant react`): an app rendered on the client from `@monospaced/set-react` components, with `@vitejs/plugin-react`, the React ESLint preset, jsdom for component tests, and `Root` taking its initial theme from the stored lightswitch choice. React and its tooling install at the monorepo's ranges like everything else.

### Patch Changes

- da8e39e: Dev harness only: with `CREATE_SET_PACK_DIR` set, every packed Set package is also pinned as a pnpm override in the generated workspace, so transitive dependencies such as core's icons resolve to the tarballs rather than the registry.
- eaabc8e: Trim the starter page: a full-width header, a short small-size paragraph, and an empty footer region.
- Updated dependencies [13dea87]
  - @monospaced/set-core@0.22.0

## 0.21.0

### Minor Changes

- 0f11645: New package. `pnpm create @monospaced/set my-site` scaffolds a Vite + TypeScript site built from Set components, with the head hygiene of the Set docs, the config package's ESLint and Stylelint presets, Lightning CSS targets from Set's Baseline query, Prettier, Husky and lint-staged, VS Code settings, agent skills, a sync script that refreshes Set artifacts on install, and an initial commit. Dependencies install live; tools the config package declares as peers install at its declared ranges. Prompts for package name, title and description, each with a flag, and `--defaults` to take every default.

### Patch Changes

- Updated dependencies [53b370d]
  - @monospaced/set-core@0.21.0
