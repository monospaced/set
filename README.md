# Set

Set is Measured’s brand design system for digital experiences, a reference implementation for our design systems practice, and a testbed for new approaches.

This is a pnpm monorepo with lockstep versioning across publishable and private packages.

## Packages

| Package                  | Path                                     | Public | Description                                                                                                               |
| ------------------------ | ---------------------------------------- | ------ | ------------------------------------------------------------------------------------------------------------------------- |
| `@measured/set-adapter`  | [`packages/adapter`](packages/adapter)   | no     | Codegen for framework adapters (drives `react`'s wrapper generation).                                                     |
| `@measured/set-assets`   | [`packages/assets`](packages/assets)     | yes    | Runtime assets for Set. Fonts and favicons consumed by sites and apps building on the system.                             |
| `@measured/set-config`   | [`packages/config`](packages/config)     | yes    | Shared developer-tooling config (ESLint, Stylelint, Prettier, browserslist) plus editor IntelliSense lookup.              |
| `@measured/set-core`     | [`packages/core`](packages/core)         | yes    | SSR-first component library. Native HTML output via custom elements, with a co-located CSS contract.                      |
| `@measured/set-markdown` | [`packages/markdown`](packages/markdown) | yes    | Opinionated GFM markdown → safe HTML utility. Pairs with core's `prose` component (loose coupling via GFM's element set). |
| `@measured/set-react`    | [`packages/react`](packages/react)       | yes    | React adapter — typed wrappers over the core custom-element library.                                                      |
| `@measured/set-skills`   | [`packages/skills`](packages/skills)     | yes    | Markdown guardrails for AI coding agents (and humans) building sites and apps with Set.                                   |
| `@measured/set-system`   | [`packages/system`](packages/system)     | no     | Token authoring + resolver/build pipeline. Outputs feed core's CSS. Internal — consumers use `@measured/set-core`.        |
| `@measured/set-tokens`   | [`packages/tokens`](packages/tokens)     | yes    | Set tokens as data: DTCG-shaped JSON artifacts and JSON Schema. For docs sites, MCP, agents, and downstream tooling.      |

## Apps

| App           | Path                                       | Description                                             |
| ------------- | ------------------------------------------ | ------------------------------------------------------- |
| Documentation | [`apps/documentation`](apps/documentation) | Public docs site, dogfooded with `core` and `markdown`. |
| Playground    | [`apps/playground`](apps/playground)       | Real-browser harness for the React adapter.             |
| Storybook     | [`apps/storybook`](apps/storybook)         | Component dev and a11y harness.                         |

## Working in the repo

```sh
pnpm install
```

Common scripts (root, delegating via workspace filters):

- `pnpm config:verify`
- `pnpm core:build` / `pnpm core:test` / `pnpm core:typecheck`
- `pnpm format` / `pnpm format:check`
- `pnpm lint` / `pnpm lint:fix`
- `pnpm markdown:build` / `pnpm markdown:test` / `pnpm markdown:typecheck`
- `pnpm playground` / `pnpm playground:build` / `pnpm playground:typecheck`
- `pnpm react:build` / `pnpm react:test` / `pnpm react:typecheck` / `pnpm react:generate`
- `pnpm storybook` / `pnpm storybook:build` / `pnpm storybook:test`
- `pnpm stylelint` / `pnpm stylelint:fix`
- `pnpm system:build` / `pnpm system:validate` / `pnpm system:verify`
- `pnpm tokens:validate` / `pnpm tokens:verify`

## Contribution conventions

- **Conventional Commits** enforced on PR titles via [`.github/workflows/pr-title.yml`](.github/workflows/pr-title.yml). Squash-merge means the PR title becomes the commit subject on `main`, so this is the canonical validation surface.
- **Required commit scopes**: `adapter`, `assets`, `config`, `core`, `markdown`, `react`, `skills`, `system`, `tokens`, `repo` (apps and root config use `repo`), plus `deps` / `deps-dev` for Dependabot PRs.
- **Pre-commit auto-formatting** via Husky + `lint-staged`: prettier runs on staged files before each commit, no opt-in.
- **Changesets required** when a PR touches `packages/{assets,config,core,markdown,react,skills,tokens}/src/**`. Run `pnpm changeset` per consumer-visible change.

## Releasing

Releases are driven by [changesets](https://github.com/changesets/changesets) with `fixed` lockstep across all workspace packages. Authors add changeset files via `pnpm changeset` per PR. The bot accumulates them on `main` and opens a persistent **"Version Packages"** PR aggregating queued changesets. Merging that PR triggers npm publish via [Trusted Publishing](https://docs.npmjs.com/trusted-publishers) (OIDC + provenance, no long-lived token in the repo).

### Known gotcha — Version Packages PR CI

The bot-opened Version Packages PR hits GitHub Actions' infinite-loop suppression: PRs created using the default `GITHUB_TOKEN` don't trigger downstream workflows, so required status checks sit at "Expected — Waiting for status to be reported" indefinitely. Unblock with a close + reopen from your account:

```sh
gh pr close <number> && gh pr reopen <number>
```

That re-emits the `pull_request` events as you (not the bot), and CI fires normally. Merge once green.

## Roadmap

[`docs/PLANNING.md`](docs/PLANNING.md).
