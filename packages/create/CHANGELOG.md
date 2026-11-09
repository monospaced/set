# @monospaced/create-set

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
