# @measured/set-core

## 0.4.3

### Patch Changes

- 101a8a1: Give `svg` its own Root reset rule (`display: block; max-inline-size: 100%`) instead of grouping it with media elements, so the `block-size: auto` no longer flattens an SVG's intrinsic/attribute height.

## 0.4.2

## 0.4.1

### Patch Changes

- e768a12: Exclude `img` from the Root reset's descendant `revert`, so images keep the system's base styling instead of falling back to browser defaults (alongside the existing `svg` exclusion).

## 0.4.0

### Minor Changes

- 0d9c9ce: Add an optional `current` prop to `link` (enum: `"page"`). When set, the
  link emits the matching `aria-current` value, marking it as the current
  item in its set for assistive technology.

### Patch Changes

- 6ea51e2: Fix dismiss events firing after the element is removed (`alert`, `banner`), `range` output not syncing when the value changes programmatically, and controlled form values not being preserved (`input`, `textarea`, `range`).

## 0.3.0

### Minor Changes

- 4884b80: Banner: emit `data-set-content-theme="dark"` and switch `data-set-surface` from `"inverse"` to `"default"`. The banner has its own dark visual treatment regardless of surrounding surface or color scheme — the content-theme lock now expresses that directly rather than leaning on `inverse` semantics.
- 4884b80: Page: add `headerBorder` prop, decoupling the header bottom border from `stickyHeader`.
  - `headerBorder="always"` — persistent border
  - `headerBorder="scroll"` — border fades in only when a sticky header is stuck (uses `@container scroll-state(stuck: block-start)`); falls back to always-on where the container query isn't supported. Has no visible effect without `stickyHeader`.
  - omitted — no border (was: a border was implicitly emitted whenever `stickyHeader` was set)

  **Visual change:** `stickyHeader` no longer implies a border. Pass `headerBorder="scroll"` (or `"always"`) explicitly to keep the previous look.

- 4884b80: Page header now spans full width with the persistent / collapsible Sidebar opening below it. Previously the entire page (header included) shifted inline when a Sidebar was composed in; now only `main` and `footer` shift, leaving header and banner edge-to-edge.

  New on Page:
  - `headerSize` prop — `"sm" | "md" | "lg"`, default `"md"`. Reserves a minimum block size on the header and exposes `--set-page-header-block-size` to descendants. The Sidebar reads this variable for its panel's `inset-block-start`, so persistent panels open beneath the header band rather than overlapping it.
  - `sm` = 3rem (48px); `md` = 3.75rem (60px); `lg` = 4.5rem (72px) at base and 5.25rem (84px) above the tablet breakpoint (48em).

  This is a visual change for any consumer composing a Sidebar inside Page's header slot — the new layout is the default. Pages without a Sidebar are unaffected aside from the new minimum header height.

- 4884b80: **Breaking:** Sidebar `size` prop renamed to `buttonSize`, accepts `"sm" | "md" | "lg"` (was `"sm" | "md"`), and now passes the value straight through to the trigger and collapse buttons. Previously the prop indirected (`sm → md`, `md → lg`); the prop only ever influenced the embedded button sizes, so the indirection has been removed and the surface made explicit.

  Default is `"md"` (visual change: the previous default rendered an `lg` button via indirection). Pass `buttonSize: "lg"` explicitly to keep the old size. The `data-size` host attribute is now `data-button-size`. The exported `SetSidebarSize` type is removed — use `SetButtonSize` from the button module instead.

  Migration:

  ```diff
  - renderSetSidebar({ size: "md", ... })
  + renderSetSidebar({ buttonSize: "lg", ... })

  - renderSetSidebar({ size: "sm", ... })
  + renderSetSidebar({ buttonSize: "md", ... })
  ```

- 4884b80: Sidebar: add `surface` prop. Mirrors Card / etc. — accepts `"default" | "brand" | "inverse" | "brand-inverse"` and emits `data-set-surface` on the inner `.sidebar` panel (not the host) so the surface context applies to the panel chrome, not the trigger or backdrop.
- 4884b80: Surface: add `contentTheme` prop. Mirrors Poster — accepts `"light" | "dark"` and emits `data-set-content-theme` on the host when provided. Use to lock content rendered inside a Surface to an absolute theme regardless of the inherited `prefers-color-scheme`.

### Patch Changes

- f206276: Bump `lucide` from `0.577.0` to `1.14.0`. Major version of upstream — usage in `Icon` is limited to the `icons` registry export and is unaffected. Pinned exact (no caret) so future minors land via Dependabot review rather than implicit `pnpm install` upgrades.
- 7c52969: Set `min-block-size: 100dvb` on the Root element when `appRoot` is true. Apps wrapping their tree in `<Root appRoot>` (or `renderSetRoot({ appRoot: true })`) now fill at least the dynamic viewport's block dimension by default — so a sticky footer sits at the viewport edge rather than mid-content when the page body is short. Uses dynamic viewport units (`dvb`) so mobile browser chrome is respected.
- 15187c0: Button: fix Safari layout bug where fill icons inside icon-only buttons blew out the inline size. The `.icon-wrapper` had only `block-size` defined, leaving Safari free to size the inline axis to whatever the SVG's intrinsic aspect ratio suggested — which for `fill` icons (sized to fill their host) becomes "as wide as available". `aspect-ratio: 1 / 1` constrains the wrapper to a square so the inline size tracks the block size correctly. Same render in Chrome and Safari now.
- 62a4386: Container: drop `block-size: 100%`. Forcing every Container to fill its parent's block axis was overreach — it caused Containers in contexts that don't define a fixed block size (e.g. inside a flowing main region) to render at 0 height or stretch unexpectedly. Removing it lets Container size naturally to its content on the block axis, matching how it already sized on the inline axis.
- 6785dc4: Container: drop `container-type: inline-size`. In older Safari (still implementing the original CSS Containment spec where `container-type` implied `layout` containment), `position: fixed` descendants of a Container were getting clipped because Container was acting as their containing block. The spec change agreed in [CSSWG #10544](https://github.com/w3c/csswg-drafts/issues/10544#issuecomment-2248438355) (Jul 2024) decouples `layout` containment from container queries, but isn't yet available in older Safari versions even though `container-type` itself shows as baseline-widely-available.

  Nothing in core uses `@container` queries against `.set-container` — Grid establishes its own container, Page's `scroll-state` query targets the header element. Removing it from Container is safe.

- 41b690d: Icon: add `external-link` to the recommended icon list. Useful for marking outbound links in navigation, footers, etc.
- 41b690d: Sidebar: disable the slide-in transition for persistent sidebars above the notebook breakpoint. Persistent sidebars are static structural chrome — animating their reveal on every initial paint felt off. Collapsible and overlay modes still animate as before.
- 62a4386: Text: `data-measured` paragraphs at `size="lg"` now use the tight measure (`--set-typography-measure-tight`) instead of the default measure. Large prose was reading long; tighter measure keeps line lengths balanced at that size.

## 0.2.0

### Minor Changes

- 9a25190: Rename two `Heading` props for clarity:
  - `children` → `text`
  - `opticalInline` → `opticalAlign`

  Update consumers to use the new names. The corresponding host attribute also renames from `data-optical-inline` to `data-optical-align`. Per the alpha versioning posture, this is a minor bump rather than a major.

- 6198a8f: Poster: rename `image` → `media` and constrain it to a branded type produced by `renderSetPosterImage`. The helper locks `cover` and `priority` to the values Poster's layout depends on and exposes only the props that can vary (`gravity`, `sizes`, `src`, `srcSet`). The image is decorative — Poster is a content-over-background layout — so `alt` is always empty.

  Migration:

  ```ts
  // before
  renderSetPoster({
    image: renderSetImage({
      cover: true,
      priority: true,
      src,
      srcSet,
      sizes,
      gravity,
    }),
  });

  // after
  renderSetPoster({
    media: renderSetPosterImage({ src, srcSet, sizes, gravity }),
  });
  ```

  The React adapter follows the rename: `<Poster media={...}>` (was `image`).

- 59c906d: Every component now accepts an `id` prop, placed on the appropriate host: outermost wrapper for structural components, the interactive element for Link, the inner input for form controls. Consumers own id generation — nothing is auto-generated.

  **Breaking changes** (alpha — bumped as minor per the existing posture):
  - Checkbox and Switch drop `descriptionId`. When `description` is set, `id` is required; the description element's id is derived as `${id}-description`.
  - Icon drops `titleId`. When `ariaHidden` is false, `id` is required; the title element's id is derived as `${id}-title`.
  - Sidebar's `id` now goes on the host. The inner panel is `${id}-panel` (and the trigger's `aria-controls` references it).
  - Menu's `id` now also goes on the host (it was previously a seed only for the trigger and popup ids).

  Migration: rename `descriptionId` / `titleId` to `id` on the affected components. Update any external selectors targeting Sidebar's panel from `#my-sidebar` to `#my-sidebar-panel`.

### Patch Changes

- ef1672a: Make fenced code blocks keyboard-accessible.

  `@measured/set-markdown`: a small inline rehype transform sets `tabIndex="0"` on the `<code>` element of every fenced code block. The `<code>` is the horizontally-scrollable region in prose styling, so keyboard users can now focus it and scroll. Inline `<code>` is unaffected. Resolves axe-core's `scrollable-region-focusable` rule.

  `@measured/set-core`: prose component now applies the `interactive-focus` token to the wrapper's decorative border on `:has(> code:focus-visible)`, giving keyboard users a visible focus state on the code block.

- 2e46597: Fix install failure for downstream consumers. `@measured/set-system` was incorrectly declared as a runtime dependency, but it's a private workspace package not published to npm — so consumer installs failed with `ERR_PNPM_FETCH_404`. The dependency is build-time only (the system CSS is inlined into core's published artifact); moved to `devDependencies`.
- 93ce56b: Initial alpha release of Set. Process validation and tire-kicking only — APIs are not stable. Please don't depend on these versions for anything real yet.
- 134b977: Add the `motion.duration.3000` token (3s on `mnsp`, 0ms on `wrfr`) for ambient / reduced-motion loops. Renames `motion.duration.600` from `Longest duration step.` to `Long duration step.` so the scale stays accurate now that `3000` is the longest.

  `@measured/set-core`: the spinner's `prefers-reduced-motion` pulse animation now references `var(--set-motion-duration-3000)` instead of a hard-coded duration.

- 96c75ce: Page: where supported (Chrome/Edge 133+), the sticky-header border now fades in only when the header is actually pinned to the viewport edge, rather than showing whenever the header is configured as sticky. Older engines keep the always-on fallback. Implemented via `@container scroll-state(stuck: block-start)` and gated behind `@supports (container-type: scroll-state)`, so no JavaScript is added.
- 7cd1b40: Form controls now play cleanly with React's controlled-input checks:
  - Event handlers and `autoFocus` route to the inner `<input>` / `<textarea>` / `<select>` instead of the host wrapper, so React sees them on the element it checks. `ref` continues to land on the host wrapper.
  - HTML boolean props (`checked`, `disabled`, `required`, `readonly`, etc.) preserve their `false` value through the React adapter, so toggling a checkbox / switch keeps the input controlled. `false` on `data-*` and `aria-*` is still omitted (matches SSR).
  - `Input` preserves the empty string distinctly from `undefined`, so clearing a controlled field doesn't flip it from controlled to uncontrolled.

- b00bb58: Add concise `description` to each public package's `package.json` and align the README's first paragraph to match. The descriptions are what npm shows in list views; they were previously empty across the repo, leaving npm to fall back to whatever appeared in the README first line.
- ec27a3a: Add logical-CSS enforcement to the Stylelint preset (`@measured/set-config/stylelint`) via `stylelint-plugin-logical-css`. Component CSS must use logical properties (`inline-size`, `block-size`, `margin-block-start`, etc.) and logical keywords (`text-align: start`) over physical equivalents, so consumer code retains LTR/RTL portability for free. `resize` is exempted from the keyword check — the logical `block` / `inline` values are still experimental per MDN and don't have full browser support yet.
- 53caec4: Add token-discipline rules to the Stylelint preset (`@measured/set-config/stylelint`):
  - Raw color values are disallowed. Use a `var(--set-color-*)` token, a CSS keyword (`transparent`, `currentcolor`, `inherit`, etc.), or a CSS Color Module Level 4 system color in forced-colors blocks. `color-mix` is disallowed too — compose colors at the token layer rather than ad-hoc in CSS.
  - Absolute lengths (`px`, `pt`, `pc`, `in`, `cm`, `mm`, `Q`) and raw time units (`s`, `ms`) are disallowed. Use design tokens. `rem` and `rlh` remain available as a documented escape hatch and as the right unit for `@container` breakpoints.
  - `!important` is disallowed.

  Two new tokens land alongside the rule additions:
  - `--set-color-background-scrim` — the translucent occluding layer used behind modals, drawers, and other overlay UI. Resolves to a new `primitive.color.alpha.black.56` (added to both brands) across all four `{light,dark} × {default,brand}` surfaces.
  - `--set-motion-duration-0` — for explicit zero-duration legs in `transition` shorthands without falling back to a raw `0s` literal.

- 31ecaa2: Smoke-test Trusted Publishing — no code changes. Incrementing alpha to confirm the OIDC publish path works end-to-end after the bootstrap NPM_TOKEN was removed.

## 0.2.0-alpha.6

### Patch Changes

- ef1672a: Make fenced code blocks keyboard-accessible.

  `@measured/set-markdown`: a small inline rehype transform sets `tabIndex="0"` on the `<code>` element of every fenced code block. The `<code>` is the horizontally-scrollable region in prose styling, so keyboard users can now focus it and scroll. Inline `<code>` is unaffected. Resolves axe-core's `scrollable-region-focusable` rule.

  `@measured/set-core`: prose component now applies the `interactive-focus` token to the wrapper's decorative border on `:has(> code:focus-visible)`, giving keyboard users a visible focus state on the code block.

## 0.2.0-alpha.5

### Patch Changes

- 2e46597: Fix install failure for downstream consumers. `@measured/set-system` was incorrectly declared as a runtime dependency, but it's a private workspace package not published to npm — so consumer installs failed with `ERR_PNPM_FETCH_404`. The dependency is build-time only (the system CSS is inlined into core's published artifact); moved to `devDependencies`.

## 0.2.0-alpha.4

### Patch Changes

- @measured/set-system@0.2.0-alpha.4

## 0.2.0-alpha.3

### Minor Changes

- 9a25190: Rename two `Heading` props for clarity:
  - `children` → `text`
  - `opticalInline` → `opticalAlign`

  Update consumers to use the new names. The corresponding host attribute also renames from `data-optical-inline` to `data-optical-align`. Per the alpha versioning posture, this is a minor bump rather than a major.

### Patch Changes

- ec27a3a: Add logical-CSS enforcement to the Stylelint preset (`@measured/set-config/stylelint`) via `stylelint-plugin-logical-css`. Component CSS must use logical properties (`inline-size`, `block-size`, `margin-block-start`, etc.) and logical keywords (`text-align: start`) over physical equivalents, so consumer code retains LTR/RTL portability for free. `resize` is exempted from the keyword check — the logical `block` / `inline` values are still experimental per MDN and don't have full browser support yet.
- 53caec4: Add token-discipline rules to the Stylelint preset (`@measured/set-config/stylelint`):
  - Raw color values are disallowed. Use a `var(--set-color-*)` token, a CSS keyword (`transparent`, `currentcolor`, `inherit`, etc.), or a CSS Color Module Level 4 system color in forced-colors blocks. `color-mix` is disallowed too — compose colors at the token layer rather than ad-hoc in CSS.
  - Absolute lengths (`px`, `pt`, `pc`, `in`, `cm`, `mm`, `Q`) and raw time units (`s`, `ms`) are disallowed. Use design tokens. `rem` and `rlh` remain available as a documented escape hatch and as the right unit for `@container` breakpoints.
  - `!important` is disallowed.

  Two new tokens land alongside the rule additions:
  - `--set-color-background-scrim` — the translucent occluding layer used behind modals, drawers, and other overlay UI. Resolves to a new `primitive.color.alpha.black.56` (added to both brands) across all four `{light,dark} × {default,brand}` surfaces.
  - `--set-motion-duration-0` — for explicit zero-duration legs in `transition` shorthands without falling back to a raw `0s` literal.
  - @measured/set-system@0.2.0-alpha.3

## 0.2.0-alpha.2

### Patch Changes

- @measured/set-system@0.2.0-alpha.2

## 0.1.1-alpha.1

### Patch Changes

- 31ecaa2: Smoke-test Trusted Publishing — no code changes. Incrementing alpha to confirm the OIDC publish path works end-to-end after the bootstrap NPM_TOKEN was removed.
  - @measured/set-system@0.1.1-alpha.1

## 0.1.1-alpha.0

### Patch Changes

- 93ce56b: Initial alpha release of Set. Process validation and tire-kicking only — APIs are not stable. Please don't depend on these versions for anything real yet.
  - @measured/set-system@0.1.1-alpha.0
