# Opportunity roadmap

This roadmap is intentionally fluid: items can move freely between `NOW`, `NEXT`, and `LATER` as priorities and discoveries change.

## Now

What we're working on now.

### CLI bootstrap tool (`@monospaced/create-set`)

Scaffolds a Set site or app with Set's components, tooling and defaults.

The CLI writes a project once and never sees it again. Anything that should keep improving after that lives in `@monospaced/set-config` (lint presets, Baseline target, Vite targets, the token catalog), which stays the standalone entry point for consumers who don't bootstrap. `create` depends on `config`; `config` never knows about `create`.

```sh
pnpm create @monospaced/set my-app
```

Package `packages/create`, bin `create-set` (a bare `set` collides with the shell builtin), commit scope `create`. It joins the changesets `fixed` group, the changeset-required path list in `ci.yml`, the scopes in `pr-title.yml`, and the README package table.

#### Settled decisions

- **Targets.** Two authoring modes, chosen at the first prompt. `html`: authored markup against Set's CSS variables and custom elements, the simplest possible Set site; what you write is what ships. `prerender`: pages as render functions, prerendered to static HTML at build time by a small Vite plugin (the model from the `screen` app) and hydrated by `defineSetComponents()`; the canonical Set authoring mode. Both are Vite + TypeScript projects with a `dist` build and share everything else. React is a later variant. Astro is the graduation path for a prerender project that outgrows single pages: it is Vite underneath, so the config and the render modules carry over; handle it as a skill and an idiomatic `create astro`, never as a CLI template. Eleventy stays for content-heavy sites and the docs.
- **Prompts** (`@clack/prompts`), each with a flag so the CLI runs non-interactively (`--defaults` takes every default): package name (default: directory name), site title, site description, variant (`--variant html|prerender`). Refuse a non-empty target directory. No markdown prompt: `@monospaced/set-markdown` is documented as an optional post-bootstrap install.
- **Versions.** Dependencies resolve live at generation time via `pnpm add`, so output is always current and nothing in the template goes stale. Tools the config package declares as peers (ESLint, Stylelint, TypeScript, browserslist, Lightning CSS) install at its declared ranges, so preset and tool always agree. The Node major and the exact pnpm version are constants the CLI carries (26 / 12.17.0), never read from the running environment, written to `engines`, `packageManager` and `.node-version`.
- **Installed.** Runtime: `@monospaced/set-assets`, `@monospaced/set-core`, plus `@monospaced/set-react`, `react`, `react-dom` for the React variant, later. Dev: `@monospaced/set-config`, `@monospaced/set-skills`, `@monospaced/set-tokens` (for agents), `eslint`, `stylelint`, `prettier`, `typescript`, `vite`, `lightningcss`, `browserslist`, `husky`, `lint-staged`, `vitest`, plus `@vitejs/plugin-react`, `@types/react`, `@types/react-dom`, `jsdom`, `@testing-library/react` for React.
- **CSS pipeline.** Vite with Lightning CSS as transformer and minifier. `css.lightningcss.targets` from `@monospaced/set-config/browserslist/lightningcss` and `build.target` from `@monospaced/set-config/browserslist/esbuild`, so the Baseline constant in the config package is the single source of truth and a Set upgrade moves the targets.
- **Hello world page.** Mirrors the head hygiene of `apps/documentation` (`src/_includes/base.11ty.ts`), not its bytes: charset, viewport, `color-scheme`, `theme-color`, title, description, canonical, Open Graph and Twitter card (reusing the docs OG image), favicons in the same order, web manifest with maskable icons. Title and description come from the prompts; canonical and `og:url` are placeholders for a post-bootstrap edit. Fonts and core CSS are imported from `src/main.ts(x)` so Vite hashes them; favicons live in `public/favicons`. No font preload: Vite hashes the fonts imported through `fonts.css`, so a preload in `index.html` could not name the final URL. Body is `Root` + `Page` with a heading, a paragraph and a `Lightswitch`, built from Set components only. In `html` the body is rendered by the CLI with core and written into `index.html`; in `prerender` the same composition is written as `src/pages/index.ts`, and a test checks the two render the same markup.
- **Pages.** A page is a folder with an `index.html`; its path is its URL. `vite.config.ts` discovers them with `fs.globSync("**/index.html")` into `build.rollupOptions.input`, so adding a page is adding a folder. In `html` every page carries its full head; no head templating, since the point of the variant is that the file you write is the file that ships. The repetition is the cue to move to `prerender`. There, `index.html` files are route stubs, `src/pages/<route>.ts` (or `<route>/index.ts`, for co-located content) exports `title`, `description` and `render(): string | Promise<string>`, `src/pages.ts` is an explicit registry of routes to page modules, `src/site.ts` holds the site name, URL and OG image, `src/document.ts` renders the full document (head from page and site, root with the theme bootstrap, module script), and the plugin's `transformIndexHtml` returns it per route. Page modules are config dependencies, so the dev server restarts on edit rather than hot-replacing; fine for static pages, said in the README. Page modules stay isomorphic by convention: render functions and data in, strings out, no CSS imports or DOM at module top level, so `main.ts` can import one for client re-rendering. Markdown content is a documented convention, not a template: read the file with `node:fs` beside the page, `processMarkdown` from `@monospaced/set-markdown`, render in `Prose`. A watcher that restarts on `.md` edits is added when a real project needs it.
- **Theme bootstrap.** HTML: the docs' inline script, stamping the stored lightswitch theme on the root before content parses. React: `main.tsx` reads `SET_LIGHTSWITCH_STORAGE_KEY` and passes it as `Root`'s initial `theme`; `Lightswitch` keeps it in sync after mount (its `connectedCallback` already applies the stored value).
- **Lint and format.** `eslint.config.mjs` spreading `@monospaced/set-config/eslint` (or `eslint/react`), `.stylelintrc.mjs` extending the Stylelint preset, Prettier zero-config with a `.prettierignore` (lockfile, `dist`, `.vscode/set.catalog.css`), `.editorconfig`. Scripts: `dev`, `build`, `preview`, `typecheck`, `test`, `lint`, `lint:fix`, `stylelint`, `stylelint:fix`, `format`, `format:check`. Husky + `lint-staged` (Prettier on everything, Stylelint fix on CSS, ESLint fix on JS/TS), as in this repo.
- **Editor and agents.** `.vscode/settings.json` (format on save, default formatter, Stylelint validation) and `.vscode/extensions.json` (ESLint, Stylelint, Prettier) are committed; only `.vscode/set.catalog.css` is ignored. Skills copy to both `.claude/skills/` and `.agents/skills/`, both ignored. No `CLAUDE.md` yet.
- **`prepare` script.** `husky` plus a cross-platform `scripts/sync-set.mjs` that copies the token catalog, the skills and the favicons from `node_modules` into place, so a fresh clone or a Set upgrade refreshes them. Husky is skipped where there is no `.git` (CI).
- **Workspace.** `pnpm-workspace.yaml` carrying `minimumReleaseAge: 4320`, mirroring this repo.
- **Git.** `git init` first (Husky needs it), then an initial commit at the end.
- **CI.** One GitHub Actions job on PRs and `main`: install (`--frozen-lockfile`), lint, stylelint, format check, typecheck, test, build, Node from `.node-version`. Plus Dependabot for npm and actions, grouped minor+patch, three-day cooldown. No PR title convention (a library concern), no Netlify config (too opinionated for now).

```
# .gitignore
node_modules/
dist/
.vscode/set.catalog.css
.claude/skills/
.agents/skills/
.claude/settings.local.json
.claude/.cc-writes/
.DS_Store
.env
.env.*
!.env.example
*.local
```

#### Testing without publishing

- Run from source: `pnpm create:dev <dir>` at the root executes `packages/create/bin/create-set.mjs` against a scratch directory. The generated project installs the published Set packages, which is what a real user gets.
- Unit: vitest snapshots of the generated file tree and key files for each variant, plus a test that executes the generated prerender page module and checks it renders the same body as the `html` starter.
- CI: a `create` job scaffolds both variants into a temp directory with `--defaults`, runs `pnpm install`, then the generated project's own `lint`, `stylelint`, `format:check`, `typecheck`, `test` and `build`. Also on a weekly schedule, since latest moves without a commit to this repo; `CREATE_SET_PACK_DIR` lets it scaffold against the PR's packed packages rather than the registry.

#### Phases

1. Package skeleton, prompts and flags, `html` variant, `create:dev`, snapshot tests. Shipped.
2. `prerender` variant and page discovery for both: the variant prompt and flag, route stubs, `src/pages`, the registry, `document` and `site` modules, the plugin, the drift test, README guidance on adding pages and the Markdown convention.
3. CI and Dependabot templates, the `scaffold` workflow for both variants, on PRs and weekly. Shipped.
4. React variant.

Stretch: brand selection (`wrfr` wireframe context), core CSS tree-shaking, an add-Set-to-an-existing-project mode (idiomatic framework init first, then the Set layer), an Astro migration skill, `escapeHtml` exported from core so render-function callers escape text the way core does.

## Next

What we could be working on next.

### Baseline allowlist pruning

The Stylelint preset sanctions a short list of progressive enhancements (`packages/config/stylelint/index.mjs`, `plugin/use-baseline` → `ignoreProperties` / `ignoreSelectors`). Each entry has a date with it in the Baseline data; prune one once it reaches Widely available, and drop the two `round()` justifications in `expander.css` once the plugin's data marks it Widely available (due mid-November 2026). Logical overflow (`overflow-block | -inline`) carries inline justifications beside physical fallbacks in `nav`, `prose` and `docs.css`; remove the fallbacks when it reaches Widely available, around 2027–2028.

## Later

Everything we could attempt given sufficient time and resources.

### Icon weight

Consider 80% icon opacity when paired with text.

### Semantic color evolution

- rose = favorite
- blue = ai
- chartreuse = highlight

### Component evolution

#### Poster Video

Add cover fit to `Video`, and `PosterVideo` support to `Poster`.

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

### Vitest 5 upgrade

Vitest 5 fixes the jsdom environment on Node 25+, where Node's own global `localStorage` shadowed jsdom's and vitest 4 dropped it; `core` and `react` carry an `execArgv: ["--no-webstorage"]` workaround in their vitest configs until then. A major: coordinate with Storybook's vitest addon and `@vitest/browser-playwright`, and remove the workaround when it lands.

### Vite 8 upgrade

A coordinated upgrade, not a lone bump: Vite 8 requires `@vitejs/plugin-react` 6, and currently breaks the Storybook build. Tackle as one deliberate PR — verify Storybook and the Eleventy/vitest toolchain against Vite 8 — and unignore both Dependabot majors when starting.

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
