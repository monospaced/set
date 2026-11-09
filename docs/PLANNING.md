# Opportunity roadmap

This roadmap is intentionally fluid: items can move freely between `NOW`, `NEXT`, and `LATER` as priorities and discoveries change.

## Now

What we're working on now.

## Next

What we could be working on next.

### Update dependencies

A coordinated pass, not lone bumps. The catalog in `pnpm-workspace.yaml` sets the versions every scaffolded project installs, and the `scaffold` workflow runs on each Dependabot PR, so a bump here is tested against a fresh scaffold before it reaches anyone. After any catalog change run `pnpm create:sync`, or `create:verify` fails CI.

- **Vite 8 with `@vitejs/plugin-react` 6**, both in the catalog, in one PR. Vite 8 currently breaks the Storybook build; `apps/storybook` is where the fallout lands. Scaffolds move to Vite 8 with it (the templates already set `cssMinify` and `target` explicitly, so Vite 8's new defaults change nothing for them). Close Dependabot PRs 24 and 26 once it lands.
- **Vitest 5.** Fixes the jsdom environment on Node 25+, where Node's own `localStorage` shadows jsdom's; `core` and `react` carry `execArgv: ["--no-webstorage"]` in their `vitest.config.ts` until then, with a comment to remove. Likely needs matching `@storybook/addon-vitest` and `@vitest/browser-playwright` in `apps/storybook`.
- **Config peer ranges.** Stylelint 18 and TypeScript 7 are out and sit outside the presets' `^17` and `^5` in `packages/config/package.json`. Verify each against the presets (`pnpm config:test`, `pnpm stylelint`, `pnpm lint`), widen the ranges (`^17 || ^18`), and add a changeset; scaffolds then pick up the new major through the peer range. Bump the catalog's `stylelint` and `typescript` with them.
- **Open Dependabot PRs**: `pnpm/action-setup` 5 → 6 (21; the scaffold's generated workflow already uses v6), `changesets/action` 1 → 2 (57; check the `release.yml` inputs still apply), `jsdom` 30 (25), the grouped minor and patch set (111). Close 23, the `@types/node` bump the Node 26 work superseded.
- **Storybook runner pin.** Unpin `ubuntu-24.04` in `ci.yml` once Playwright supports 26.04.

Verification for each PR is the full CI set locally: `pnpm lint`, `pnpm stylelint`, `pnpm format:check`, the package typechecks, tests and builds, `pnpm react:verify`, `pnpm create:test` and `pnpm create:verify`, `pnpm documentation:build`, and `pnpm storybook:build` then `pnpm storybook:test` (needs Playwright Chromium; unsandboxed locally). Changesets: the config peer ranges need one; vitest and Vite config edits in `core`, `react` and the apps do not, since they are not under `src`. After the release that carries Vite 8 or Vitest 5, scaffold once from the registry, since those bumps change what users get.

## Later

Everything we could attempt given sufficient time and resources.

### Icon weight

Consider 80% icon opacity when paired with text.

### Semantic color evolution

- rose = favorite
- blue = ai
- chartreuse = highlight

### Component evolution

#### Factory

- `Control/Listbox` (JS required, selection semantics)
- `Control/Select` (native select with thin styling)
- `Control/Form` (if it becomes a real stateful runtime abstraction)
- `Control/Tag` (delete, remove, select)
- `Status/Progress` (updating)
- `Status/Skeleton` (resolve to loaded)
- `Status/Toast` (dismissible, timer)
- `Structure/Accordion` (JS for exclusive)
- `Structure/Breadcrumb` (JS responsive)
- `Structure/Code` (copy to clipboard)
- `Structure/Tabs` (JS required, a11y)

#### Size gaps

- Missing lg: Alert, Badge, Checkbox, Input, Menu, Nav, Radios, Range, Textarea, Sidebar
- Missing sm: Blockquote
- No size prop: Card, Details, Fieldset, Prose
- Button, Link with size lg are the same as size md if 1. appearance text and label visible or 2. appearance outline or solid, and label hidden.
- Lightswitch with size lg is the same as size md if appearance is outline or solid.

### Version documentation

Post first release, serve the latest release at `/`, `main` at `/next/*`, and pinned older releases at `/v0.x/*`. Each release publishes an immutable static archive proxied from the main site via `_redirects`; until then the docs (and bundled Storybook) stay a single rolling tier built from `main`.

### Style Dictionary DTCG 2025.10 gaps

[Support for DTCG v2025.10](https://github.com/style-dictionary/style-dictionary/issues/1590)

- Revisit bridge-side DTCG `$dimension`/`$duration` normalization once Style Dictionary fully supports nested `{value, unit}` in composite CSS transforms:
  - remove `normalizeDtcgValueObjects` compatibility shim from `prepare-sd-sources.mjs` when safe
- Revisit resolver bridge scope once Style Dictionary lands native DTCG resolver support:
  - reduce/remove custom resolver->SD source adaptation where SD can natively consume resolver semantics
  - consider extracting `resolveAllContextPermutations` into a single module-level call shared by `prepare-sd-contexts.mjs` and `prepare-json-output.mjs` — eliminates duplicate resolution and stage drift risk. May be obsolete if SD's native consumption removes the per-stage iteration entirely.

### Vue framework adapter

Validate that the `packages/adapter` SPEC walker and emitter generalises by authoring a second emitter alongside `src/react`. A small archetype floor (Button, Banner, Page, Menu — pass-through + slotted + CE + events).

### iOS / Android token emit targets

Speculative. Style Dictionary ships built-in iOS Swift, Android XML, and Compose formats; adding them potentially an SD platform extension on top of the existing CSS pipeline.
