# @monospaced/set-system

Token artifacts package for Set. Internal/private — `@monospaced/set-core` is the public consumption contract; consumers don't depend on this package directly.

Cross-package planning and sequencing live in [`../../docs/PLANNING.md`](../../docs/PLANNING.md). Resolver adapter implementation details live in [`scripts/README.md`](scripts/README.md).

## Consumer integration

This is the contract that token output enforces — consumers integrating via `@monospaced/set-core` inherit it.

### CSS entry points

- `@monospaced/set-system/css/base`
- `@monospaced/set-system/css/mnsp`
- `@monospaced/set-system/css/wrfr`

### Integration contract

- **Primary CSS entrypoint**: consumers should load `@monospaced/set-core/styles.css`, which composes token + component CSS so consumers don't take a long-term dependency on a separate published token-CSS package.
- **Font loading**: when using package-provided fonts, load `@monospaced/set-assets/fonts.css` before `@monospaced/set-core/styles.css`.
- **CSS layering**: this package emits `@layer set, set.brand;` in its own bundles (base in `set`, brand in `set.brand`). The full normative layer order in the composed `@monospaced/set-core/styles.css` consumer bundle is `@layer set, set.brand, set.root, set.components;` — `set.root` and `set.components` are added by core.
- **Root scoping**:
  - all token usage must live under a `.set` scope root
  - select a brand via `data-set-brand="<brand>"` on the same scope root
- **Theme forcing**:
  - `data-set-theme="dark"` and `data-set-theme="light"` force mode on the scoped brand root
  - without force attributes, theme follows authored media query behavior
- **Surface**:
  - descendant surface scopes are expressed with `data-set-surface`
  - supported public surface values: `default`, `brand`, `inverse`, `brand-inverse`
  - `default` is the inherited/base surface context
  - `brand`, `inverse`, and `brand-inverse` are sibling surface contexts and must not rely on ancestor surface fallback to complete their token sets
- **Local content-theme override**:
  - `data-set-content-theme="light"` and `data-set-content-theme="dark"` are reserved for absolute local foreground theme overrides on poster-like content over non-themeable media
  - intentionally stronger than normal theme/surface selectors
  - currently pair with `data-set-surface="default"` or `data-set-surface="brand"`
- **Multi-brand on one page**:
  - use isolated wrapper roots per brand (`.set[data-set-brand="mnsp"]`, `.set[data-set-brand="wrfr"]`, etc.)
  - do not mix multiple brands on the same scope root

## Authoring

### API and ownership

- Ensure `*.tokens.json` files conform to `schemas/2025.10/schema` (the JSON schemas; `schemas/2025.10/spec` is the prose DTCG specification).
- `src/<brand>/primitive` is private; public API is `src/<brand>/semantic`.
- Semantic tokens are the intended API layer (not primitives) for any downstream transforms/contracts.
- Semantic-first authoring is the default for UI implementation.
- Keep semantic token shape consistent across brands (same semantic paths per brand).
- Shared system-shell domains live in `src/base/{primitive,semantic}`.
- Brand-specific domains live in `src/<brand>/{primitive,semantic}`.

### Folder and file conventions

- Semantic folder convention (axis-first where applicable):
  - base pattern: `src/<brand>/semantic/<domain>/<axis>/<context>...`
  - optional override pattern (only when needed): `src/<brand>/semantic/<domain>/override/<axis>/<context>...`
- Foundation folder convention mirrors brand convention where applicable:
  - base pattern: `src/base/semantic/<domain>/<axis>/<context>...`
  - primitive pattern: `src/base/primitive/<domain>.tokens.json`
- Semantic color file convention: `src/<brand>/semantic/color/theme/<theme>/<surface>.tokens.json`.
- Semantic color forced-colors convention: `src/<brand>/semantic/color/forced-colors/<context>.tokens.json`.
- Semantic effect file convention: `src/<brand>/semantic/effect/theme/<theme>/<surface>.tokens.json`.
- Semantic typography size convention: `src/<brand>/semantic/typography/size/<context>.tokens.json`.
- Semantic layout size convention: `src/<brand>/semantic/layout/size/<context>.tokens.json`.
- Semantic layout root convention: `src/<brand>/semantic/layout/tokens.json`.
- Semantic spacing root convention: `src/<brand>/semantic/spacing.tokens.json`.
- Resolver documents follow DTCG resolver spec file naming:
  - use `.resolver.json`
  - keep resolver/build config colocated under `packages/system/`, not repo root
- Vendored schema convention:
  - store official DTCG schemas under `schemas/<version>/...`
  - token/resolver files should carry local `$schema` paths into `schemas/...`

### Authoring rules

- Use strict spec forms:
  - token objects use `$value` (or token-level `$ref` where intentionally used)
  - curly aliases for token-to-token references
  - JSON Pointer `$ref` only for property-level references where needed
- External `$ref` path rule:
  - relative `$ref` file paths must resolve from the authoring file location
  - update paths when folders move
- Cross-layer alias rule:
  - brand primitive tokens may alias base primitive tokens when values are intentionally shared
  - keep explicit literals where design intent intentionally diverges
- Build outputs must be generated from tokens (no hand-maintained CSS token files as source of truth).
- Prefer vendored schema URLs for `$schema` (`schemas/...`) to reduce drift/network dependency.

### Theme parity rules

- For each brand + surface combination, semantic color `light` and `dark` files must be path-identical and type-identical; only `$value` may differ.
- Theme parity also applies to effect tokens where surface files exist in both themes.

### Domain conventions

- Contextual ramp key parity:
  - where practical, contextual ramps should reuse root ramp keys for equivalent values
  - example:
    - `spacing.vertical.700 = 24`
    - `spacing.horizontal.700 = 24`
    - `layout.<context>.spacing.vertical.700 = 24` (or context-specific override)
  - objective: preserve stable step-number mental model while allowing context-based value shifts

### Semantic review checklist

- Every semantic token has clear design intent (no primitive leakage by name).
- Semantic paths are stable and consistent across brands.
- All semantic aliases resolve within intended graph shape (authored + resolved).
- For token-level aliases, use strict token form: `{ "$value": "{...}" }`.
- Use JSON Pointer `$ref` only for property-level access within composite values.
- For color semantics, provide both light and dark values (even if temporarily identical).
- For color semantics, design for `brand × theme × surface` resolution, even if some combinations share values initially.
- Keep typography semantics theme-agnostic unless a concrete requirement proves otherwise.
- Typography semantic tokens should reference primitive `typeStep` for default size/line-height coupling where possible.
- Font feature settings are currently handled at output/CSS layer:
  - default sans semantic family emits Inter feature settings (`"calt" 1, "ccmp" 1, "ss03" 1`)
  - mono semantic family emits `font-feature-settings: normal` reset
- Avoid platform-specific formatting in semantic intent (platform formatting belongs in transforms).
- Authoring and API evolution should optimize for human/agent token selection clarity.

## Resolution and build pipeline

- Light/dark and responsive behavior should be implemented at semantic/resolution layer, not by mutating primitive intent.
- Surface variants must be supported as a first-class semantic concern alongside brand and theme.
- Resolver source-of-truth is DTCG resolver manifests in `resolver/*.resolver.json`.
- Build tooling (e.g. Style Dictionary) consumes resolver-selected sources via adapter/config; do not duplicate context contracts ad hoc.
- Prefer standard Style Dictionary configuration/build flow over custom build scripts.
- Custom logic is limited to resolver adaptation only:
  - mapping resolver + context inputs → ordered SD source/include entries
  - generating SD config inputs from resolver decisions where required
- Do not reimplement Style Dictionary core behavior (token transforms, formatting, output writing) in custom scripts unless a documented SD gap requires it.
- Temporary documented SD-gap shim:
  - bridge currently normalizes nested DTCG `{ value, unit }` objects to scalar strings before SD shorthand transforms
  - scope: compatibility for current composite CSS transform behavior (not a change to authoring model)
  - removal target: when upstream SD DTCG support is complete ([tracked upstream](https://github.com/style-dictionary/style-dictionary/issues/1590))
- Resolver build metadata conventions used by current adapter:
  - context inheritance uses `baseContext`
  - variant diff target uses `deltaFromContext`
  - variant scope defaults are implicit (variants emit at default contexts for other axes)
  - declare per-variant `scope` only when overriding that default behavior
  - context files may be authored sparse/override-only when axis composition is cumulative (`baseContext`)
  - keep duplicate declarations only when required to preserve local alias anchors or explicit readability intent
- Resolver source ordering:
  - within each resolver document, primitives precede semantics
  - `base.semantic` is owned by `base.resolver.json` and reaches consumers via the CSS layer cascade (`@layer set` from base, `@layer set.brand` from each brand). Brand resolvers don't include `base.semantic` directly; they selectively import individual `base.primitive` sources (e.g. `spacing`) where brand primitives or semantics alias them.
  - within a single resolver, `semantic.spacing` resolves before `semantic.layout` when layout aliases spacing
  - size-context layering must be deterministic (e.g. `baseline|tablet|notebook` base, then `laptop` overrides where files are partial)

For implementation details of the resolver→SD bridge, see [`scripts/README.md`](scripts/README.md).
