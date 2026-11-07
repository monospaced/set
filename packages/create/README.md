# @monospaced/create-set

Scaffold a Set site or app. The things done by hand on every new project, done once and well.

```sh
pnpm create @monospaced/set my-site
```

Prompts for a package name, site title and description, each with a flag (`--name`, `--title`, `--description`) and `--yes` to accept the defaults, so it runs non-interactively too. Refuses a directory that isn't empty.

## What you get

A Vite project with TypeScript and a hello-world page built from Set components only: `Root` → `Page` with a heading, a paragraph and a `Lightswitch`, with the head hygiene of the Set docs (viewport, color scheme, description, Open Graph and Twitter cards, favicons, web manifest) and the theme bootstrap that paints a stored theme before first render.

- **Dependencies are installed live**, so nothing in the template goes stale. Tools the config package declares as peers (ESLint, Stylelint, TypeScript, browserslist, Lightning CSS) are installed at its declared ranges, so preset and tool always agree.
- **Lint and format**: `@monospaced/set-config` presets for ESLint and Stylelint, Prettier with zero config, Husky and lint-staged on commit, `.editorconfig`, VS Code settings and extension recommendations.
- **CSS pipeline**: Lightning CSS as Vite's transformer and minifier, targets from Set's Baseline query.
- **Set artifacts** (token catalog, agent skills, favicons) are copied into place on every install by `scripts/sync-set.mjs`.
- **Git**: initialised first, with an initial commit at the end.

Node and pnpm majors are constants the CLI carries, written to `engines`, `packageManager` and `.node-version`.

## Developing

From the repository root:

```sh
pnpm create:test
pnpm create:dev ../scratch/my-site
```

`create:dev` builds core first and runs the CLI from source. The generated project installs the published Set packages, which is what a user gets. To scaffold against the workspace instead, pack the Set packages and point the CLI at them:

```sh
pnpm --filter "@monospaced/set-{assets,config,core,skills,tokens}" pack --pack-destination ../scratch/pack
CREATE_SET_PACK_DIR=../scratch/pack pnpm create:dev ../scratch/my-site
```

`plan()` in `src/plan.mjs` is pure and returns every file for a set of answers; the tests snapshot it. `execute()` does the I/O: git, files, `pnpm add`, the sync script, the commit.
