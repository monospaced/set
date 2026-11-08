# @monospaced/create-set

Project scaffolding for Set. Bootstraps a site or app with Set's components, tooling and defaults.

```sh
pnpm create @monospaced/set my-site
```

Prompts for a package name, site title and description, each showing its default, which Enter accepts. Each has a flag (`--name`, `--title`, `--description`), and `--defaults` takes every default without prompting, so it runs non-interactively too; without a terminal, anything unanswered is refused rather than guessed. Refuses a directory that isn't empty.

## What you get

A Vite and TypeScript project with a starter page built from Set components, a `src/styles.css` for your own styles, Set's ESLint and Stylelint presets, Prettier, Husky and lint-staged, VS Code settings, and Lightning CSS targets from Set's Baseline query.

- Dependencies install live, so nothing in the template goes stale. Tools the config package declares as peers install at its declared ranges, so preset and tool agree.
- `scripts/sync-set.mjs` copies the token catalog, agent skills and favicons into place on every install.
- Git is initialised first, with an initial commit at the end.

Node and pnpm versions are constants the CLI carries, written to `engines`, `packageManager` and `.node-version`.

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
