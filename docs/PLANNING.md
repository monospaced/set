# Opportunity roadmap

This roadmap is intentionally fluid: items can move freely between `NOW`, `NEXT`, and `LATER` as priorities and discoveries change.

## Now

What we're working on now.

## Next

What we could be working on next.

### Update dependencies

A coordinated pass, not lone bumps. The catalog now sets the versions every scaffolded project installs, and the `scaffold` workflow runs on each Dependabot PR, so a bump here is tested against a fresh scaffold before it reaches anyone.

- **Vite 8 with `@vitejs/plugin-react` 6.** Vite 8 currently breaks the Storybook build; verify Storybook and the Eleventy toolchain against it in one PR, then unignore both Dependabot majors. Scaffolds move to Vite 8 with it.
- **Vitest 5.** Fixes the jsdom environment on Node 25+, where Node's own `localStorage` shadows jsdom's; `core` and `react` carry `execArgv: ["--no-webstorage"]` in their vitest configs until then. Coordinate with Storybook's vitest addon and `@vitest/browser-playwright`, and remove the workaround.
- **Config peer ranges.** Stylelint 18 and TypeScript 7 are out and sit outside the presets' `^17` and `^5`. Verify each against the presets and widen the ranges (`^17 || ^18`), with a changeset; scaffolds then pick up the new major through the peer range.
- **Open Dependabot PRs**: `pnpm/action-setup` 5 → 6, `changesets/action` 1 → 2, `jsdom` 30, the grouped minor and patch set. Close or rebase the stale `@types/node` one, which the Node 26 bump superseded.
- **Storybook runner pin.** Unpin `ubuntu-24.04` in `ci.yml` once Playwright supports 26.04.

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

s

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
