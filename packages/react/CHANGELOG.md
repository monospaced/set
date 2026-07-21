# @measured/set-react

## 0.4.3

### Patch Changes

- Updated dependencies [101a8a1]
  - @measured/set-core@0.4.3

## 0.4.2

### Patch Changes

- @measured/set-core@0.4.2

## 0.4.1

### Patch Changes

- Updated dependencies [e768a12]
  - @measured/set-core@0.4.1

## 0.4.0

### Patch Changes

- 6ea51e2: Preserve a controlled `value` on form controls and route control extras (events, `value`) to every primary control in the adapter, so `textarea` and other controlled inputs aren't reset to their SSR child content.
- Updated dependencies [6ea51e2]
- Updated dependencies [0d9c9ce]
  - @measured/set-core@0.4.0

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

- Updated dependencies [f206276]
- Updated dependencies [7c52969]
- Updated dependencies [4884b80]
- Updated dependencies [15187c0]
- Updated dependencies [62a4386]
- Updated dependencies [6785dc4]
- Updated dependencies [41b690d]
- Updated dependencies [4884b80]
- Updated dependencies [4884b80]
- Updated dependencies [4884b80]
- Updated dependencies [41b690d]
- Updated dependencies [4884b80]
- Updated dependencies [4884b80]
- Updated dependencies [62a4386]
  - @measured/set-core@0.3.0

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

- 7cd1b40: Form controls now play cleanly with React's controlled-input checks:
  - Event handlers and `autoFocus` route to the inner `<input>` / `<textarea>` / `<select>` instead of the host wrapper, so React sees them on the element it checks. `ref` continues to land on the host wrapper.
  - HTML boolean props (`checked`, `disabled`, `required`, `readonly`, etc.) preserve their `false` value through the React adapter, so toggling a checkbox / switch keeps the input controlled. `false` on `data-*` and `aria-*` is still omitted (matches SSR).
  - `Input` preserves the empty string distinctly from `undefined`, so clearing a controlled field doesn't flip it from controlled to uncontrolled.

- b00bb58: Add concise `description` to each public package's `package.json` and align the README's first paragraph to match. The descriptions are what npm shows in list views; they were previously empty across the repo, leaving npm to fall back to whatever appeared in the README first line.
- Updated dependencies [ef1672a]
- Updated dependencies [2e46597]
- Updated dependencies [9a25190]
- Updated dependencies [93ce56b]
- Updated dependencies [134b977]
- Updated dependencies [96c75ce]
- Updated dependencies [6198a8f]
- Updated dependencies [7cd1b40]
- Updated dependencies [b00bb58]
- Updated dependencies [ec27a3a]
- Updated dependencies [53caec4]
- Updated dependencies [59c906d]
- Updated dependencies [31ecaa2]
  - @measured/set-core@0.2.0

## 0.2.0-alpha.6

### Patch Changes

- Updated dependencies [ef1672a]
  - @measured/set-core@0.2.0-alpha.6

## 0.2.0-alpha.5

### Patch Changes

- Updated dependencies [2e46597]
  - @measured/set-core@0.2.0-alpha.5

## 0.2.0-alpha.4

### Patch Changes

- @measured/set-core@0.2.0-alpha.4

## 0.2.0-alpha.3

### Minor Changes

- 9a25190: Rename two `Heading` props for clarity:
  - `children` → `text`
  - `opticalInline` → `opticalAlign`

  Update consumers to use the new names. The corresponding host attribute also renames from `data-optical-inline` to `data-optical-align`. Per the alpha versioning posture, this is a minor bump rather than a major.

### Patch Changes

- Updated dependencies [9a25190]
- Updated dependencies [ec27a3a]
- Updated dependencies [53caec4]
  - @measured/set-core@0.2.0-alpha.3

## 0.2.0-alpha.2

### Patch Changes

- @measured/set-core@0.2.0-alpha.2

## 0.1.1-alpha.1

### Patch Changes

- Updated dependencies [31ecaa2]
  - @measured/set-core@0.1.1-alpha.1

## 0.1.1-alpha.0

### Patch Changes

- Updated dependencies [93ce56b]
  - @measured/set-core@0.1.1-alpha.0
