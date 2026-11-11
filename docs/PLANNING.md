# Opportunity roadmap

This roadmap is intentionally fluid: items can move freely between `NOW`, `NEXT`, and `LATER` as priorities and discoveries change.

## Now

What we're working on now.

### Canvas and WebGL access to resolved tokens that follow the theme

Canvas 2D and WebGL can't read CSS custom properties, and a token's value depends on the theme, the surface, a locked content theme and the OS scheme, so a static export can't keep a drawing in sync. Add small core helpers that resolve a token as it applies at an element, through computed style so the cascade does the work: `resolveSetColor` (sRGB floats), `resolveSetTime` (ms), `resolveSetLength` (px) and `resolveSetString` (for keywords such as `effect.blend.overprint`), plus `watchSetTokens(el, onChange)` that fires, batched per frame, on `data-set-theme`, `data-set-surface`, `data-set-content-theme` and `data-set-brand` changes on any ancestor and on `prefers-color-scheme` and `forced-colors`. A `useSetToken` hook for React. Settled: share Lightswitch's theme and matchMedia logic rather than duplicate it; normalise colours by assigning to a canvas `fillStyle` and reading back, which clamps to sRGB with no parser; no caching across calls, consumers resolve once per change. Open before starting: the hook needs a home the React generator won't overwrite, and the tests (theme switch, ancestor surface change, OS scheme with no theme, locked content theme inside the opposite theme) need the Vitest browser runner, not jsdom. First consumer: Screen, which should also take its 5000ms swap timer from the duration token.

## Next

What we could be working on next.

## Later

Everything we could attempt given sufficient time and resources.

### Dither helper for canvas and WebGL

The third layer of ordered dither, after the Dither component and the dither tokens: `bayer(n)` for 2, 4 and 8 as normalised thresholds, a `dither(ctx, tone, options)` that draws a tone field at whole cells with device pixel ratio handled and `image-rendering: pixelated` set, and the same thresholds as a GLSL function. Inks resolve through the runtime token helpers and redraw on their watcher; stepping a phase once per `motion.frame` period gives a dissolve, and reduced motion draws one composed frame. Waits on the runtime token access item in Now. Screen has the 8×8 matrix and the dissolve to lift from. Acceptance: a known tone field produces a known bitmap, and a canvas example redraws on a theme change.

### Sibling surface deltas

Let `brandSecondary` and `brandTertiary` emit only what differs from `brand` instead of a full token set: widen the brand selectors in the resolver to match all three, and add a per-context opt-out of full emission in the pipeline. Roughly 60% of the generated CSS growth from the surface family.

### Contrast audit

A `system:audit` script that checks every surface's foreground tokens against its page, panel and subtle backgrounds at the bands the default surface establishes, so tuning a primitive can't silently break a surface.

### Icon weight

Consider 80% icon opacity when paired with text.

### Semantic color evolution

- rose = favorite
- blue = ai
- chartreuse = highlight

### Component evolution

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

### Stylelint 18 and TypeScript 7

Waiting on upstream.

- **Stylelint 18:** needs `stylelint-declaration-strict-value`, `stylelint-plugin-logical-css` and `stylelint-plugin-use-baseline` to accept it.
- **TypeScript 7:** needs `typescript-eslint` to support it.

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
