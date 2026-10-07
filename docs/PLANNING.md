# Opportunity roadmap

This roadmap is intentionally fluid: items can move freely between `NOW`, `NEXT`, and `LATER` as priorities and discoveries change.

## Now

What we're working on now.

### React Native: token emit target, then a sibling native library

Exploration branch: `react-native`. Decision reached in planning: **Set shares tokens with React Native; it does not share components.** A native library, if built, is a sibling system that references Set's SPEC and docs for naming, intent and visual language, with no programmatic dependency on `@monospaced/set-core` or `@monospaced/set-adapter`.

#### Why not generate a native adapter from the SPEC

The SPEC was measured for this across all 43 components. It is a web rendering contract carrying a mostly neutral prop surface:

- `output` and `rules.attributes` (298 rules) are entirely HTML and ARIA. Rendering and accessibility, the two halves a native adapter would need most, do not transfer.
- Of 355 props roughly 300 are neutral; the rest are form plumbing (`form`, `name`, `type`, `value`, `autocomplete`), navigation (`href`, `rel`, `target`), media (`src`, `sizes`, `preload`), document (`lang`, `dir`, `level`, `as`) and `id` on every component. Some neutral-looking values encode CSS, e.g. `labelVisibility: "hiddenBelowTablet"` is a media query.
- Core's IR (`SetNode`) is HTML tags plus `class` and `data-*` attributes resolved by component CSS. `reactify` is a DOM walker; there is no non-DOM renderer to point it at. Styling lives in `*.css` as cascading selectors and `calc()` over custom properties, not in the SPEC.
- The component inventory is web-document shaped. `Page`, `Root`, `Prose`, `Link`, `Details`, `Fieldset`, `Container`, `Sidebar`, `Grid`, `Nav`, `Video` have no native counterpart; native apps want screens, navigation stacks, lists, sheets, tab bars and safe areas, which Set does not have. Roughly half the library (the atoms) maps conceptually.
- Nine components are DOM-bound custom elements (`querySelector`, `focusout`, `matchMedia`, `localStorage`); icons and spinners enter the tree as raw SVG strings.

Generating prop types from the SPEC would save typing while importing boundaries drawn for documents, not screens. This matches practice: Fluent, Carbon, Atlassian and Spectrum share tokens and build native libraries to native idioms, using the web library as a reference. Material is the exception because its spec was authored platform-agnostic first; Set's SPEC is downstream of core's HTML, so that pattern is not available without rewriting the foundation.

Record this as an ADR (`docs/adr/0002-…`): core and its SPEC are web-only by design; non-web targets share tokens (and other genuinely neutral data) and otherwise reference rather than link.

#### Phase 1 — Token emit target (`@monospaced/set-tokens/react-native`)

Goal: a typed JS/TS token object per brand that an RN app can import without parsing DTCG.

This is the first test of the architectural intent behind authoring in DTCG and building with Style Dictionary: that the same resolver-driven source can emit for platforms other than CSS. It supersedes the Later "iOS / Android token emit targets" item; those become further SD platforms on the same pipeline once this one lands.

Things the CSS target does implicitly that this one must decide:

- **Modifier axes are media/selector driven.** Tokens vary on `size` (via `min-width` media queries), `theme` (via `prefers-color-scheme` + `data-set-theme` forcing), `surface` (descendant `data-set-surface`) and `forcedColors`. RN resolves these at runtime (`useColorScheme`, `useWindowDimensions`, context), so the target ships **fully resolved context tables**, not deltas, and drops `forcedColors` (no RN equivalent). The JSON artifact's `byTheme` keys (`contentDarkBrand`, `forcedLight`, …) encode CSS variant mechanics and collapse to a plain `{ light, dark } × { default, brand, inverse, brandInverse }` matrix.
- **Units and composites.** Authored `px` strings become unitless numbers (density-independent points); `shadow` → `shadowColor/Offset/Opacity/Radius` plus Android `elevation`; `fontFamily` arrays → first family (RN has no fallback stacks; fonts load via `expo-font`); `duration` `"200ms"` → `200`; `easing` cubic-béziers → four numbers for `Easing.bezier`; `number` tokens pass through.
- **Name: `react-native`.** The output bakes in RN-only choices (points, platform shadow fields, single font family, size keyed to window width). A general "resolved JS tokens" export for Node theming, canvas or email would need different transforms for each of those, so if it is ever wanted it becomes a separate target rather than a rename of this one.

Implementation:

- Add a pipeline stage alongside `prepare-json-output.mjs` in `packages/system/scripts/pipeline/`, driven by the same resolver contexts (reuse `resolveAllContextPermutations`; a third caller strengthens the extraction case the Later "Style Dictionary gaps" item already makes).
- Prefer a **Style Dictionary platform** with custom transforms (`size/px-to-number`, `shadow/react-native`, `fontFamily/first`, `duration/ms-to-number`) and SD's `javascript/es6` + `typescript/es6-declarations` formats, keeping to the system README's "custom logic is resolver adaptation only" rule. Bespoke code only for the context-matrix shape.
- Output shape (per brand, base merged in so consumers import one thing):

  ```ts
  export const tokens = {
    static: { spacing: { vertical: { 100: 1, … } }, radius: {…}, typography: {…}, motion: {…} },
    theme: { light: { default: { color: {…}, effect: {…} }, brand: {…}, inverse: {…}, brandInverse: {…} }, dark: {…} },
    size: { baseline: { layout: {…}, typography: {…} }, tablet: {…}, notebook: {…}, laptop: {…} },
    breakpoints: { tablet: 768, notebook: 1024, laptop: 1280, desktop: 1440, widescreen: 1536 },
  } as const;
  ```

  Tokens with `css.publish: false` are dropped. `$description` travels as JSDoc in the `.d.ts`.

- Wire into `packages/tokens` exports (`./react-native/<brand>`), extend `tokens:verify` to cover the new dist, add a shape test.

Exit criteria: `pnpm tokens:verify` green with the new artifact; a Node one-liner can `import { tokens } from "@monospaced/set-tokens/react-native/mnsp"` and read `tokens.theme.dark.default.color.background.default`.

#### Phase 2 — Sibling native library (if wanted)

Not scoped here beyond the shape of the decision. If a native library is built:

- It is its own package (name TBD; not `set-react-native`, which would imply an adapter), depending on `@monospaced/set-tokens` and nothing else from Set.
- Two further programmatic shares are allowed because the data is genuinely neutral: the Phase 1 tokens, and the icon node data behind `icons.generated` (a tag/attrs tree with no HTML in it), rendered via `react-native-svg`. Everything else, including prop names and the `sm | md | lg` / `tone` / `appearance` vocabularies, is convention carried by reading Set's SPEC and docs.
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
