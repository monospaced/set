# Resolver -> Style Dictionary bridge

This project uses DTCG resolver files as the source of truth, plus a small adapter layer that prepares deterministic SD inputs.

## Script index

- `packages/system/scripts/pipeline/index.mjs`
  - build entrypoint used by `pnpm run system:build`
- `packages/system/scripts/validate.mjs`
  - validation entrypoint used by `pnpm run system:validate`
- `packages/system/scripts/verify.mjs`
  - verification entrypoint used by `pnpm run system:verify`
- `packages/system/scripts/pipeline/prepare-sd-contexts.mjs`
  - resolver context preparation + CSS manifest generation
- `packages/system/scripts/pipeline/prepare-sd-sources.mjs`
  - source merge/normalization for Style Dictionary input
- `packages/system/scripts/pipeline/resolve-token-sources.mjs`
  - ordered source resolution for a concrete resolver context

## Purpose

- Keep authoring in resolver format (`packages/system/resolver/*.resolver.json`).
- Keep Style Dictionary responsible for formatting/output.
- Limit custom logic to resolver adaptation only.
- Patch only the current resolver-support gap in SD, while staying aligned with SD's DTCG direction.

## Bridge intermediate contract (Phase 1)

The bridge emits two JSON artifacts per resolver target:

- `packages/system/build/sd/<namespace>.<target>.contexts.json`
- `packages/system/build/sd/<namespace>.<target>.css-manifest.json`

These are the SD inputs for current CSS builds. The contract below is the
required shape that formatter code may rely on.

### `contexts.json` contract

Top-level:

- `namespace` (`string`, optional)
- `brand` (`string`, optional)
- `contexts` (`object`, required)

`contexts` map:

- key: `contextId` (`string`) produced from resolver modifier order
- value: role-bucketed token object (DTCG-compatible object tree)
  - `public` (`object`, required)
  - `private` (`object`, required)

Rules:

- each context value must be a plain object token tree (not an array)
- aliases must already be resolver-expanded for emitted context overlays
- output may contain only delta tokens (bridge decides pruning)
- bridge output must be SD-source compatible without SD-side structural rewrites
- token leaves include bridge metadata in `$extensions["co.monospaced.set.bridge"]`:
  - `contextId` (`string`)
  - `role` (`"public" | "private"`)
  - `path` (`string[]`, token path segments below token layer/domain roots)

### `css-manifest.json` contract

Top-level:

- `source` (`string`, required) resolver path used for generation
- `namespace` (`string`, optional)
- `brand` (`string`, optional)
- `tokenLayers` (`object`, required)
- `targets.css` (`object`, required)
- `blocks` (`array`, required)

`targets.css`:

- `layer` (`string`, optional)
- `layerOrder` (`string[]`, optional)

`blocks[]`:

- `id` (`string`, required): context ID that exists in `contexts`
- `comment` (`string`, required): deterministic debug annotation
- `selector` (`string`, required): final CSS selector
- `media` (`string[]`, required): ordered media conditions

Rules:

- no formatter inference from resolver structure should be required
- block ordering is authoritative and must be deterministic
- manifest contains resolver-derived CSS block metadata (selector/media/layer), not token payload transformation logic
- formatter relies on bridge metadata extensions for context/role/path grouping, not path-index assumptions
- public/private output split is performed by SD filters (`set/role-public`, `set/role-private`) using bridge metadata, not by manifest target role flags

## Current constraints to preserve during refactor

- CSS output must remain byte-stable under `pnpm run system:verify`.
- Public artifact paths/names under `packages/system/dist/**` are unchanged.
- Resolver authoring model and `$defs.build` metadata contract are unchanged.
- Any bridge/formatter boundary changes must keep the above contract explicit and documented.

## Resolver build metadata used by the adapter

The adapter reads custom metadata under:

- `$defs.build.namespace`
- `$defs.build.brand`
- `$defs.build.tokenLayers`
- `$defs.build.targets.css.selectors`
- `$defs.build.targets.css.modifiers`
- `$defs.build.targets.css.layer`
- `$defs.build.targets.css.layerOrder`

### Context graph keys

- `baseContext`: context inheritance within an axis.
- `deltaFromContext`: comparison context for a variant emission delta.

### Variant scope defaults

For CSS modifier variants, the bridge applies an implicit default scope:

- variants are emitted only at default contexts for all other axes.

Per-variant `scope` may be provided for exceptions/expansion.

## Naming conventions

- Axis names in resolver `modifiers` should match semantic intent (`size`, `theme`, `forcedColors`).
- CSS selector templates should use `{namespace}` and `{brand}` placeholders.
- Public CSS vars use namespace prefix (for example `--set-*`).

## Artifact contract

- Public/versioned outputs:
  - `packages/system/dist/css/*.css`
- Private/versioned maintainer outputs:
  - `packages/system/dist/private/css/*.primitives.css`
  - non-stable/non-public contract for discovery workflows
- Disposable pipeline artifacts:
  - `packages/system/build/sd/*`
  - `packages/system/build/tmp/*`

## CSS layer contract

- Resolver may declare:
  - `$defs.build.targets.css.layer` (layer for this output)
  - `$defs.build.targets.css.layerOrder` (global layer order declaration)
- Formatter behavior:
  - emits `@layer <order...>;` when `layerOrder` is present
  - wraps all emitted blocks in `@layer <layer> { ... }` when `layer` is present

## CI guardrail

Run:

- `pnpm run lint`
- `pnpm run format:check`
- `pnpm run system:validate`
- `pnpm run system:verify`

- `lint` enforces script/config quality via ESLint.
- `format:check` enforces deterministic formatting via Prettier.
- `system:validate` checks authored token/resolver JSON validity, local `$schema` wiring, resolver sanity, and resolver context preparation.
- `system:verify` rebuilds tokens and fails if `packages/system/dist/**` changes.
