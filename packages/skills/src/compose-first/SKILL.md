---
name: compose-first
description: Use Set's components to build pages and sections, before authoring custom CSS. Read this when generating markup with @measured/set-core or @measured/set-react.
---

# Compose first

Set is a compositional system. The fastest path to a correct, accessible, on-brand UI is to build out of the system’s components and let their props express your intent — essentially no custom CSS, only tokens for minor edge-case tweaks. Anything beyond that belongs to the next layer.

Inline code in this skill is shown in JSX for compactness. See `@measured/set-skills/compose-first/examples/core/` for template-string equivalents and `@measured/set-skills/compose-first/examples/react/` for the parallel JSX.

## Root is required

Every Set app must be wrapped in `Root`. It emits the `.set` scoping class that every component’s CSS targets, sets the brand and (optional) theme, and carries language / direction attributes. Without it, components render unstyled.

For a top-level app, set `appRoot`:

```tsx
<Root appRoot>{/* page composition here */}</Root>
```

For embedded use (e.g. injecting Set into a portion of a non-Set page), omit `appRoot`. `Root` still scopes its subtree.

## Surface (color context)

`Surface` sets a color context for nested content. Wrap a region in `Surface` to apply a different context — e.g. a brand-coloured strip inside an otherwise-default page:

```tsx
<Surface variant="brand">
  {/* content renders against the brand surface */}
</Surface>
```

`Surface` can scope context across any region — a single strip, a section, or the whole page.

Several components (`Box`, `Card`, `Panel`, etc.) also accept a `surface` prop — switch context at the component level without a separate wrapper:

```tsx
<Box surface="brand" paddingBlock="xl">
  {/* ... */}
</Box>
```

## Layout primitives

Reach for these first:

- `Page` — top-level shell with `banner`, `header`, `children` (main), `footer` slots.
- `Container` — wraps page-level content with a bounded inline width.
- `Grid` + `GridItem` — 12-column responsive layout. The primary chassis for main content beyond a single column.
- `Stack` — vertical group with consistent `gap` (token-driven flex wrapper).
- `Inline` — horizontal group with consistent `gap` (token-driven flex wrapper).
- `Box` — a low-level boundary and inset primitive with optional light containment.

The canonical main-content chain is `Root` → `Page` → `Container` → `Grid` → `GridItem` → `Stack` / `Inline`. `Box` is a low-level primitive with no fixed position — wrap any step where padding, background, or border is needed (commonly around `Grid` for section padding, around `Stack`/`Inline` inside a `GridItem`, or around individual children). Site furniture (headers, footers, navigation) typically nests more simply — `Container` → `Inline` / `Stack` — with `Box` where padding rhythm is needed.

`Stack` and `Inline` hold a single fixed arrangement — `Inline` wraps when it runs out of room, but neither _switches_ arrangement at a breakpoint (e.g. stacked when narrow, side-by-side when wide). Responsive layout change lives in `Grid` / `GridItem`, and that is page-level. A self-contained block that needs its own breakpoint-driven layout switch is a genuine gap — handle it in the custom-with-tokens layer (a local component with container- or media-query CSS), not by forcing `Stack` / `Inline`.

## Decision flow

When asked to build a page or section:

1. **Pages** → use `Page`. Assemble `header` / `children` / `footer` slots from compositions, not custom HTML. The optional `banner` slot expects a `Banner` component (site-wide dismissible announcement).
2. **Bounded content** → use `Container`. Don’t author custom max-width wrappers.
3. **Main content layout** → use `Grid` + `GridItem`. The 12-column responsive system is the primary chassis for page bodies. `GridItem` is a wrapper around the CSS grid-item layout surface — column/row placement, spans, alignment — configured per-item via props (not via classes on the parent).
4. **Vertical groups** → use `Stack` with `gap`. Not margins.
5. **Horizontal groups** → use `Inline` with `gap`. Not flex.
6. **Insetting content or applying a boundary** → use `Box` (low-level primitive). For higher-level contained content (a styled container as a unit), reach for `Panel`.
7. **Structural patterns** → use the matching component (cards, navigation, posters, sidebars, etc.) rather than re-rolling. Check the References below for components you may not know about.
8. **Headings** → use `Heading`. `level` and `size` are deliberately decoupled — pick `level` for semantic hierarchy (no skipped levels), `size` for visual treatment.
9. **Inline copy or authored paragraphs** → use `Text`. Supports inline (`as: "span"`) and paragraph (`as: "p"`) form, and accepts inline markup (`<em>`, `<strong>`, `<a>`, `<code>`, etc.) as children for emphasis, links, and code.
10. **Rich text** (raw block markup, typically from markdown or CMS HTML) → use `Prose`. It styles `<h1>`–`<h6>`, `<p>`, lists, tables, etc. per the system’s typography. For paragraphs you compose directly in your layout, use `Text` instead.
11. **Other leaves** (image, icon, link, button, divider, etc.) → use the matching content component instead of raw HTML. Check the References below for components you may not know about.

## Smell tests

Custom CSS at this layer is at most a one-off, token-based tweak (e.g. nudging a single property by a small amount). If you’re about to write more than that, stop. One of two things is true:

- You missed a compositional path — re-read the decision flow above, and check the References for components you may not know about.
- The system doesn’t cover this case, so you’ve left compose-first — move to the next layer (custom with tokens).

## When composition isn’t enough

If a layout genuinely can’t be expressed with the existing components, the next layer is custom markup with design tokens. That layer has its own guidance.

## Examples

Worked examples live alongside this skill:

- `@measured/set-skills/compose-first/examples/core/` — for `@measured/set-core` consumers (SSR / web components / template strings).
- `@measured/set-skills/compose-first/examples/react/` — for `@measured/set-react` consumers.

Pick the flavor matching your project.

## References

- Component catalog (live): [Storybook](https://set.measured.co/storybook).
- Component SPECs: imported from `@measured/set-core` (e.g. `SET_STACK_SPEC`) — runtime values with top-level `description` and per-prop documentation. Confirms what each component does before you reach for raw HTML.
- Token catalog (CSS, browseable in your editor): `@measured/set-config/set.catalog.css`.
- Token data (JSON, for agents and tooling): `@measured/set-tokens/mnsp`, `@measured/set-tokens/base`.
