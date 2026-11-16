---
name: set-strict
description: "The rules for Set's strict mode: compose with Set's components, and use custom markup and CSS only where no Set component meets the need. Use with the set skill when strict is the active mode."
---

# Strict mode

## Compose first

Nest Set components in whatever combination the content needs:

- **Pages:** `Page`, with its `header`, `children` (main) and `footer` slots assembled from components. The optional `banner` slot takes a `Banner`.
- **Bounded content:** `Container` at page level, never a custom max-width wrapper.
- **Main content layout:** `Grid` and `GridItem` for responsive multi-column layout.
- **Groups:** `Stack` for vertical and `Inline` for horizontal, spaced with `gap`, never custom margins or flex.
- **Insets and boundaries:** `Box` insets content at any level, such as around a `Grid` for section padding or around a `Stack` inside a `GridItem`. `Panel` groups related content in a contained region.
- **Text:** `Heading` and `Text` for copy you compose, `Prose` for rich text, such as markdown rendered with `@monospaced/set-markdown`.
- **Everything else:** the matching Set component. Check the specs before writing raw HTML.

## When no Set component meets the need

This is a gap. Gaps can be large or small. For example:

- A component Set doesn't have, such as a stepper.
- A self-contained block that switches arrangement at its own width, such as a media object that stacks when narrow.
- A small adjustment, such as a wrapper adding one spacing token to correct an optical alignment.

Before using custom markup and CSS, check for a Set component or prop you missed. Many apparent gaps go away on a second look.

Fill a gap with the system:

1. Use Set components wherever they fit, including inside custom markup.
2. Use custom markup and CSS only for the parts no Set component covers.

The stepper example, `@monospaced/set-skills/set-strict/examples/stepper.md`, fills a gap this way.

If filling a gap takes a lot of custom markup and CSS, tell the user: Set may benefit from a new component.

## Materials

### Layout and space

- **Layout** comes from Set's layout components, or custom markup and CSS for a gap.
- **Vertical space** comes from component props, or vertical spacing tokens for a gap.
- **Horizontal space** comes from component props, or horizontal spacing tokens for a gap.
- **Breakpoints and container queries** live inside components, or in custom CSS for a gap.
- **Asymmetry** comes from `Grid` spans.
- **Bleeds** come from Set's layout components, or custom markup and CSS for a gap.
- **Overlaps:** none, except in components built for layering, such as `Poster`.

### Type

- **Font size** comes from components, or type composites and type steps for a gap.
- **Weight and width** come from components, or type tokens for a gap.
- **Slant** comes from semantic elements in copy, such as `em` and `cite`, or `font-style: italic` for a gap.

### Color

- **Color comes from components and surfaces**, or color tokens for a gap.

### Graphics and motion

- **SVG, canvas and WebGL:** no Set component serves them, so a need for them is always a gap.
- **Motion** comes from components, or motion tokens for a gap.
- **Images and video** use `Image` and `Video`. Raw elements only for a gap. A plain `img` is fine inside `Prose`.

### Components

- **Layout, structure, typographic and graphic components:** Set components first, custom only for a gap.
- **Control, navigation and status components:** Set components first, custom only for a gap.
