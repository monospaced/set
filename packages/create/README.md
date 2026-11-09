# @monospaced/create-set

Project scaffolding for Set. Bootstraps a site or app with Set's components, tooling and defaults.

```sh
pnpm create @monospaced/set my-site
```

Prompts for a package name, site title, description and variant, each showing its default, which Enter accepts. Each has a flag (`--name`, `--title`, `--description`, `--variant`), and `--defaults` takes every default without prompting, so it runs non-interactively too; without a terminal, anything unanswered is refused rather than guessed. Refuses a directory that isn't empty.

## Variants

Two ways to author pages, sharing everything else.

- **`html`** (default): pages are HTML you write against Set's CSS variables and custom elements. The simplest possible Set site; the file you write is the file that ships.
- **`prerender`**: pages are render functions in `src/pages`, prerendered to static HTML at build time by a small Vite plugin and hydrated by `defineSetComponents()`. One shared head in `src/document.ts`, per-page title and description, and nothing of the renderer ships to the browser.

In both, a page is a folder with an `index.html` and its path is its URL; Vite discovers them, so adding a page is adding a folder.

## What you get

A Vite and TypeScript project with a starter page built from Set components, a `src/styles.css` for your own styles, Set's ESLint and Stylelint presets, Prettier, Husky and lint-staged, VS Code settings, and Lightning CSS targets from Set's Baseline query.

- Dependencies install live, so nothing in the template goes stale. Tools the config package declares as peers install at its declared ranges, so preset and tool agree.
- `scripts/sync-set.mjs` copies the token catalog, agent skills and favicons into place on every install.
- Git is initialised first, with an initial commit at the end.
- A GitHub Actions workflow runs the project's checks on every pull request, and Dependabot proposes grouped updates weekly with a three-day cooldown.

The Node and pnpm versions written to `engines`, `packageManager` and `.node-version` are generated into `src/toolchain.mjs` from the monorepo's toolchain by `pnpm create:sync`; `pnpm create:verify` fails CI when they drift.

## Developing

From the repository root:

```sh
pnpm create:test
pnpm create:dev ../scratch/my-site
```

`create:dev` builds core first and runs the CLI from source. The `scaffold` workflow (`.github/workflows/scaffold.yml`) does the end-to-end run in CI: both variants, against this checkout's packed packages on pull requests and against the registry weekly. The generated project installs the published Set packages, which is what a user gets. To scaffold against the workspace instead, pack the Set packages and point the CLI at them:

```sh
pnpm --filter @monospaced/set-assets --filter @monospaced/set-config --filter @monospaced/set-core --filter @monospaced/set-skills --filter @monospaced/set-tokens pack --pack-destination ../scratch/pack
CREATE_SET_PACK_DIR=../scratch/pack pnpm create:dev ../scratch/my-site
```

`plan()` in `src/plan.mjs` is pure and returns every file for a set of answers; the tests snapshot both variants, and one test executes the generated prerender modules to check they render the same document as the `html` starter. `execute()` does the I/O: git, files, `pnpm add`, the sync script, the commit.
