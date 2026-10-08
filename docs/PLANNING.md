# Opportunity roadmap

This roadmap is intentionally fluid: items can move freely between `NOW`, `NEXT`, and `LATER` as priorities and discoveries change.

## Now

What we're working on now.

### React Native: token emit target, then a sibling native library

Decision reached in planning: **Set shares tokens with React Native; it does not share components.** A native library, if built, is a sibling system that references Set's SPEC and docs for naming, intent and visual language, with no programmatic dependency on `@monospaced/set-core` or `@monospaced/set-adapter`.

#### Why not generate a native adapter from the SPEC

The SPEC was measured for this across all 43 components. It is a web rendering contract carrying a mostly neutral prop surface:

- `output` and `rules.attributes` (298 rules) are entirely HTML and ARIA. Rendering and accessibility, the two halves a native adapter would need most, do not transfer.
- Of 355 props roughly 300 are neutral; the rest are form plumbing (`form`, `name`, `type`, `value`, `autocomplete`), navigation (`href`, `rel`, `target`), media (`src`, `sizes`, `preload`), document (`lang`, `dir`, `level`, `as`) and `id` on every component. Some neutral-looking values encode CSS, e.g. `labelVisibility: "hiddenBelowTablet"` is a media query.
- Core's IR (`SetNode`) is HTML tags plus `class` and `data-*` attributes resolved by component CSS. `reactify` is a DOM walker; there is no non-DOM renderer to point it at. Styling lives in `*.css` as cascading selectors and `calc()` over custom properties, not in the SPEC.
- The component inventory is web-document shaped. `Page`, `Root`, `Prose`, `Link`, `Details`, `Fieldset`, `Container`, `Sidebar`, `Grid`, `Nav`, `Video` have no native counterpart; native apps want screens, navigation stacks, lists, sheets, tab bars and safe areas, which Set does not have. Roughly half the library (the atoms) maps conceptually.
- Nine components are DOM-bound custom elements (`querySelector`, `focusout`, `matchMedia`, `localStorage`); icons and spinners enter the tree as raw SVG strings.

Generating prop types from the SPEC would save typing while importing boundaries drawn for documents, not screens. This matches practice: Fluent, Carbon, Atlassian and Spectrum share tokens and build native libraries to native idioms, using the web library as a reference. Material is the exception because its spec was authored platform-agnostic first; Set's SPEC is downstream of core's HTML, so that pattern is not available without rewriting the foundation.

Recorded as [ADR-0002](adr/0002-core-is-web-only-native-targets-share-tokens.md).

#### Phase 1 — Token emit target (`@monospaced/set-tokens/react-native`) — landed on this branch

Goal: a typed JS token module per brand that an RN app can import without parsing DTCG. First test of the architectural intent behind authoring in DTCG and building with Style Dictionary: the same resolver-driven source emitting for a platform other than CSS. Supersedes the Later "iOS / Android token emit targets" item; those become further SD platforms on the same pipeline.

What landed:

- `scripts/pipeline/prepare-react-native-output.mjs` resolves every context permutation (sharing enumeration with the JSON stage via `helpers/contexts.mjs`) and partitions public tokens by the axis each one varies on into `static` / `size.<context>` / `theme.<theme>.<surface>`. Base is merged under each brand.
- `style-dictionary.react-native.config.mjs` is a second SD platform: one total `value/set-react-native` transform (px → points, ms → number, DTCG color → string, shadow → `shadow*` + `elevation`, typography → text style with absolute `lineHeight`, fontFamily → first family) plus SD's built-in `javascript/esm` for the module and a custom declarations format carrying `$description` as JSDoc.
- Resolvers opt in via `$defs.build.targets.reactNative` (`axes`, `themeContexts`). `forcedColors` and the content-theme contexts are dropped: in RN the provider owns theme selection, so an always-dark region reads `theme.dark`.
- Only DTCG-typed tokens are emitted. The 40 untyped tokens (shape geometry and derived CSS images, `fontVariationSettings`, prose-link `decoration.line`) are CSS strings and are skipped; the stage lists them in its build log.
- `tokens:validate` checks the module shape (disjoint partitions, identical paths across size contexts and theme × surface slices, no unconvertible leaves, `.d.ts` present); `tokens:verify` covers drift.

Follow-ups surfaced:

- React Native's `fontWeight` accepts only hundreds, so the target snaps Set's variable-font weights (433, 466, 566 → 400, 500, 600) and `regularPlus` collapses into `regular`. The same applies to condensed widths and italics: the brand's typographic nuances need pre-instanced font files selected by family name in a native library, a packaging decision for Phase 2 rather than a token one.
- The shape logo geometry (`shape.logo.*.path` / `viewBox`) would be useful to a native library via `react-native-svg` but is untyped in source. Giving it a DTCG type (there is no spec type for SVG path data; a `$type` of `string` is not in the spec) is a source-model question, not a target one.
- The JSON artifact drops group-level `$type` for most semantic tokens (524 of 661 untyped in `set.mnsp.tokens.json`). The RN stage propagates inherited types; the JSON stage could do the same, which would be a consumer-visible improvement to that artifact.

#### Phase 2 — Sibling native library (if wanted)

Not scoped here beyond the shape of the decision. If a native library is built:

- It is its own package (name TBD; not `set-react-native`, which would imply an adapter), depending on `@monospaced/set-tokens` and nothing else from Set.
- Two further programmatic shares are allowed because the data is genuinely neutral: the Phase 1 tokens, and the icon node data in `@monospaced/set-icons` (a tag/attrs tree with no HTML in it), rendered via `react-native-svg`. Everything else, including prop names and the `sm | md | lg` / `tone` / `appearance` vocabularies, is convention carried by reading Set's SPEC and docs.
- Inventory follows native idioms, starting from the atoms that map (`Button`, `Text`, `Heading`, `Icon`, `Badge`, `Avatar`, `Alert`, `Banner`, `Checkbox`, `Switch`, `Radios`, `Input`, `Textarea`, `Card`, `Divider`, `Spinner`, `Stack`, `Inline`, `Box`, `Surface`) and adding what native needs (screen, sheet, tab bar, list) that Set has no web equivalent for.
- A `SetProvider` resolves `useColorScheme` + `useWindowDimensions` + surface context into the active slice of the Phase 1 token object.
- Demo via Expo (managed) with `react-native-web` so it runs in a browser like `apps/playground`; CI is typecheck plus web export only.
- Repo plumbing when it lands: README table row, `pr-title.yml` scope, changeset `fixed` entry, eslint globals override, root scripts, `.gitignore`; Metro + pnpm needs `node-linker=hoisted` or resolver config; Expo SDK pins may lag the `react` catalog pin.

## Next

What we could be working on next.

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

### CLI bootstrap tool (`@monospaced/set`)

Scope a `set` bootstrap CLI for fast project scaffolding with sensible defaults for tokens, components, and optional assets. Allow brand selection and support tree-shaking.

### Version documentation

Post first release, serve the latest release at `/`, `main` at `/next/*`, and pinned older releases at `/v0.x/*`. Each release publishes an immutable static archive proxied from the main site via `_redirects`; until then the docs (and bundled Storybook) stay a single rolling tier built from `main`.

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

Folded into the React Native Phase 1 item in Now. Style Dictionary ships built-in iOS Swift, Android XML, and Compose formats; once the RN platform proves the resolver → SD bridge can drive a non-CSS platform, each of these is another platform entry on the same pipeline, not a new pipeline.
