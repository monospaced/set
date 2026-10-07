# Opportunity roadmap

This roadmap is intentionally fluid: items can move freely between `NOW`, `NEXT`, and `LATER` as priorities and discoveries change.

## Now

What we're working on now.

### React Native: token emit target, framework adapter, demo app

Exploration branch: `react-native`. Three deliverables, in dependency order; each is independently useful and the later ones are only attempted if the earlier ones hold up.

1. **Token emit target** (`@monospaced/set-tokens/react-native`) — realistic, low risk.
2. **Framework adapter** (`@monospaced/set-react-native`) — realistic for a small archetype floor, but it is a _parallel implementation_, not a reuse of the React adapter. See the architectural issues below before reading this as "add a second emitter".
3. **Demo app** (`apps/native`) — realistic via Expo + `react-native-web`; running on a real device/simulator is out of scope for CI.

#### Architectural issues to settle first

These are the places where the current architecture does not transfer to React Native. None is a blocker, but each forces a decision that shapes the whole piece of work.

1. **Core's IR is HTML, not UI.** `buildSet*` returns a `SetNode` tree of `tag` / `attrs` / `children` where tags are HTML elements and styling is expressed as `class` + `data-*` attributes resolved by component CSS. `reactify` is a faithful DOM walker (`createElement(node.tag, …)`), which is why the React adapter is thin and why it passes SSR-parity tests. React Native has no DOM, no CSS, no cascade, no `data-*` selectors. A `SetNode` tree is therefore not a renderable input for RN. The adapter cannot be "`reactify` with a different `createElement`" — it has to re-derive both the structure and the styling per component. This is the single biggest difference from the Vue adapter idea in Later, which _can_ reuse the IR.

2. **Styling lives in component CSS, not in the SPEC.** The `SET_*_SPEC` contract describes props, content shape, events, and attribute rules. It says nothing about what `data-size="sm"` _looks like_. All of that is in `button.css` as cascading selectors and `calc()` expressions over CSS custom properties. An RN adapter needs those values as JS. Options, in increasing ambition:
   - **a. Hand-authored RN styles per component** reading from the RN token object. Pragmatic. Drift risk vs component CSS is the same drift risk the Later "Vue" item already accepts for behavior; here it extends to visuals.
   - **b. A style contract in core** (e.g. a `SET_*_STYLES` sibling to the SPEC describing variant → token bindings) that both CSS and RN are generated from. Correct long-term, but it is a core refactor touching every component and is far outside an exploration.
   - **c. Parse `*.css` at build time** and compile variant rules into RN `StyleSheet` objects. Fragile (nesting, `calc`, `@media`, pseudo-classes, logical properties) and effectively a CSS-to-RN compiler.
   - Recommendation: **a**, scoped to the archetype floor, with explicit "mirrors `button.css`" comments. Revisit **b** only if the exploration proves the adapter is worth keeping.

3. **Modifier axes are media/selector driven; RN has none of those.** Tokens vary on `size` (via `min-width` media queries), `theme` (via `prefers-color-scheme` + `data-set-theme` forcing), `surface` (via descendant `data-set-surface` selectors) and `forcedColors`. In RN these must become runtime JS: `useColorScheme()` for theme, `useWindowDimensions()` for size, React context for surface, and nothing for forced-colors (no equivalent; drop that axis). The emit target should ship **resolved context tables**, not CSS semantics, and the adapter supplies a `SetProvider` that picks the active context. This is also where the JSON artifact's `byTheme` keys (`contentDarkBrand`, `forcedLight`, …) stop making sense as a public RN surface: they encode CSS variant mechanics (`deltaFromContext`, forcing selectors) and need collapsing to a plain `{ light, dark } × { default, brand, inverse, brandInverse }` matrix.

4. **Units and composite values.** Tokens are authored in `px` strings (`"12px"`), the CSS formatter converts to `rem`, and components lean heavily on `calc()` (e.g. button padding derived from font metrics minus border width). RN wants unitless numbers (density-independent points), no `rem`, no `calc`. The emit target must strip units and emit numbers; `calc()` expressions in component CSS must be re-expressed as JS arithmetic in the adapter (fine, but it is per-component work). Composite tokens need per-type mapping: `shadow` → `shadowColor/Offset/Opacity/Radius` (iOS) + `elevation` (Android), `fontFamily` arrays → a single family name (RN has no fallback stacks; font files must be loaded via `expo-font`), `typography` composites unpacked. `number` tokens (`radius.ratio`, `metric.*`) pass through. `motion.easing` cubic-béziers map to `Easing.bezier`; `duration` `"200ms"` → `200`.

5. **Raw HTML children in the IR.** Icons and spinners enter the tree as `{ kind: "raw", html }` (serialized `<svg>`), and `Prose`/`Figure`/`Poster` accept trusted HTML strings. RN cannot render raw HTML. Icons need a separate path: generate RN icon components from the same `icons.generated` node data via `react-native-svg` (realistic; the data is already a tag/attrs tree). HTML-content components (`Prose`, `Markdown`-adjacent) are **out of scope** for the adapter.

6. **Custom elements and events.** Nine components register `set-*` custom elements (`alert`, `banner`, `image`, `lightswitch`, `menu`, `nav`, `range`, `sidebar`, `video`) with DOM-bound behavior (`querySelector`, `focusout`, `matchMedia`, `localStorage`). None of that transfers. Each RN counterpart re-implements the behavior with hooks/state, and the SPEC `events` map (`set-alert-dismiss`, …) becomes plain callback props (`onDismiss`). The adapter codegen can still derive the callback prop _names and types_ from the SPEC, which is the useful bit.

7. **Accessibility model.** Core's a11y is ARIA (`aria-expanded`, `aria-haspopup`, `role="menu"`, sr-only `.status` text). RN uses `accessibilityRole`, `accessibilityState`, `accessibilityLabel`, `accessibilityLiveRegion`. Mappable, but the SPEC attribute rules express ARIA, so the mapping is another hand-maintained table in the adapter.

8. **Layout primitives don't map 1:1.** `Grid` (CSS grid), `Sidebar` (container-query style), `Container` (`max-inline-size` + gutters) and anything using logical properties or `inline-size: fit` rely on CSS layout that RN's Yoga (flexbox-only) doesn't have. `Stack`/`Inline`/`Box` map well. Keep the floor to flex-expressible components.

9. **Repo plumbing.** `react-native` as a dependency drags in Metro, and Metro + pnpm's symlinked `node_modules` needs `node-linker=hoisted` or Metro `watchFolders`/`resolver` config; Expo SDK pins specific React / React Native versions that may lag the `react@^19.2` catalog pin, so the demo app may need its own non-catalog pins. Node `>=24` engine is fine for Expo tooling. CI currently has no mobile runner; the demo app's CI story is `typecheck` + `react-native-web` build only. New package needs: README table row, `pr-title.yml` scope, changeset `fixed` list entry, eslint globals override, root scripts, `.gitignore` dist entries.

10. **Does `packages/adapter` generalise?** Partially. `classify`, `pascalCase`, and the SPEC walker reuse cleanly. The React `emit.ts` is ~90% React-DOM-specific (`reactify`, `NativeAttrsFor<HTMLElement>`, `useEffect(defineSet*)`, `addEventListener`). An RN emitter can generate the **typed prop surface and callback props** from the SPEC, but the render body cannot be generated without issue 2b. Expect the RN emitter to produce types + a stub that imports a hand-authored implementation, rather than a complete component. That is still a win: prop types stay in lockstep with core automatically, and the `verify` drift guard applies.

#### Phase 1 — Token emit target (`@monospaced/set-tokens/react-native`)

Goal: a typed JS/TS token object per brand that an RN app can import without parsing DTCG.

- Add a pipeline stage `prepare-rn-output.mjs` alongside `prepare-json-output.mjs` in `packages/system/scripts/pipeline/`, driven by the same resolver contexts (reuse `resolveAllContextPermutations` — this is the duplication the Later "Style Dictionary gaps" item already flags; a third caller strengthens the case for extracting it).
- Prefer a **Style Dictionary platform** over a bespoke script where SD's built-in `javascript/es6` / `typescript/es6-declarations` formats plus custom transforms (`size/px-to-number`, `shadow/react-native`, `fontFamily/first`) suffice; this keeps to the system README's "custom logic is resolver adaptation only" rule. Bespoke only for the context matrix shape.
- Output shape (per brand, plus base merged in so consumers import one thing):

  ```ts
  export const tokens = {
    static: { spacing: { vertical: { 100: 1, … } }, radius: {…}, typography: {…}, motion: {…} },
    theme: { light: { default: { color: {…}, effect: {…} }, brand: {…}, inverse: {…}, brandInverse: {…} }, dark: {…} },
    size: { baseline: { layout: {…}, typography: {…} }, tablet: {…}, notebook: {…}, laptop: {…} },
    breakpoints: { tablet: 768, notebook: 1024, laptop: 1280, desktop: 1440, widescreen: 1536 },
  } as const;
  ```

  `size` contexts are emitted fully resolved (not deltas) so lookup is `tokens.size[active]` with no inheritance logic at runtime. `forcedColors` is dropped. Tokens with `css.publish: false` are dropped. Token `$description` travels as JSDoc in the `.d.ts`.

- Wire into `packages/tokens` exports (`./react-native`, plus `./react-native/mnsp` etc. if tree-shaking matters), extend `tokens:verify` to cover the new dist, add a schema or snapshot test for the shape.
- Open question for review: **name**. The output is really "tokens as resolved JS objects" and is equally useful to any JS runtime (Node theming, canvas, email). `react-native` as a path is honest about the unit/shadow/fontFamily choices baked in; `js` would over-promise.

Exit criteria: `pnpm tokens:verify` green with the new artifact; a Node one-liner can `import { tokens } from "@monospaced/set-tokens/react-native/mnsp"` and read `tokens.theme.dark.default.color.background.default`.

#### Phase 2 — Framework adapter (`@monospaced/set-react-native`)

Goal: prove the archetype floor renders on `react-native-web` and in Expo Go, with prop types generated from core SPECs.

- New package `packages/react-native`, peer deps `react`, `react-native`, `react-native-svg`. Published, so it enters the changeset `fixed` group and the public-scope CI regex.
- `packages/adapter/src/react-native/`: a second emitter. Generates per component: `<Pascal>Props` from `spec.props` (same type-mapping as React minus `NativeAttrsFor`, plus `on<Action>` callbacks from `spec.events`), and `index.ts` barrel. Does **not** generate render bodies (issue 10). Hand-authored implementations live in `src/components/<name>/<name>.native.tsx` and are type-checked against the generated props.
- Runtime module `src/provider.tsx`: `SetProvider({ brand, theme?, children })` resolving `useColorScheme` + `useWindowDimensions` + surface context into a single `useSetTokens()` hook returning the active slice of the Phase 1 object. `Surface` component sets the surface context.
- Archetype floor, chosen to cover each archetype once and stay flex-expressible: `Box`, `Stack`, `Inline` (pass-through, layout), `Text`, `Heading` (pass-through, typography), `Button` (pass-through, variants, icon, activity), `Icon` (raw-svg path via `react-native-svg`), `Surface` (context), `Alert` or `Banner` (custom element + events → callback). Explicitly out: `Prose`, `Grid`, `Sidebar`, `Menu`, `Lightswitch`, `Video`, `Image` (first pass).
- Tests: `@testing-library/react-native` smoke per component, plus a **SPEC-conformance sweep** modelled on `generated.test.tsx`: for every spec in the floor, render with a synthesized fixture and assert the RN `accessibilityRole`/`State` match what the SPEC's ARIA rules would emit (via `evaluateSpecCondition`). This is the RN analogue of SSR parity and keeps the adapter honest without a DOM.
- Add `react-native:generate` / `react-native:build` / `react-native:test` / `react-native:typecheck` / `react-native:verify` root scripts mirroring `react:*`.

Exit criteria: the floor type-checks against generated props, tests pass under vitest with the RN preset or Jest (decide early: vitest + `react-native-web` alias is lower friction in this repo; Jest is what RN tooling assumes).

#### Phase 3 — Demo app (`apps/native`)

Goal: a sibling to `apps/playground` that exercises the Phase 2 floor.

- Expo (managed workflow) with `react-native-web` so `pnpm native` opens in a browser like the playground, and `pnpm native:ios` / `native:android` run via Expo Go on a device. Expo chosen over bare RN because it removes Xcode/Android Studio from the contributor floor and gives `expo-font` for Berkeley Mono loading.
- Routes mirror the playground: Index, Example (token swatches + the floor), Stepper (interaction + events). Brand switcher and light/dark toggle driving `SetProvider`.
- CI: `native:typecheck` and a `react-native-web` export (`expo export --platform web`) only. No simulator in CI.
- Add to README Apps table and `.gitignore`.

Exit criteria: `pnpm native` renders the floor in a browser with correct brand/theme/size switching; a screenshot from Expo Go on one real device is attached to the PR.

#### Sequencing and decision gates

- Land Phase 1 first and alone; it has value regardless of Phases 2–3 and needs no RN dependencies in the repo.
- Gate Phase 2 on the review of issue 2 (styling source of truth). If the answer is "we want **b** eventually", build the floor so that the style tables are already shaped as variant → token bindings, to make the later lift to a core contract mechanical.
- Gate Phase 3 on Phase 2 having at least `Button` + `Text` + `Surface` working on web.
- Whichever phases ship, write an ADR (`docs/adr/0002-…`) recording the decision that core's IR is web-only and that non-web adapters re-implement rendering against the SPEC prop contract. That is the durable architectural statement this exploration produces, and it is worth having even if the RN packages are abandoned.

#### Realism assessment

- Phase 1: **high confidence**, roughly a day of pipeline work plus verification. The hard part is the context-matrix shape, which the JSON artifact has already half-solved.
- Phase 2: **medium confidence** for the floor; **low** for "the whole library". The honest framing is that an RN adapter is a second component library that shares Set's tokens, prop contracts and a11y rules, not a projection of the existing one. The adapter codegen helps with types, not with rendering.
- Phase 3: **high confidence** on web via `react-native-web`; device testing depends on contributor hardware and is not automatable here.

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

Speculative. Style Dictionary ships built-in iOS Swift, Android XML, and Compose formats; adding them potentially an SD platform extension on top of the existing CSS pipeline.
