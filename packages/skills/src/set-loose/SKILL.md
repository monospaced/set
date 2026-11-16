---
name: set-loose
description: "The rules for Set's loose mode: compose with Set's components, and also use custom markup and CSS for layout and expression wherever that fits better. Use with the set skill when loose is the active mode."
---

# Loose mode

Loose is for work with expressive layout, type and graphics. Where the request leaves room, use that freedom rather than defaulting to Set components.

## Layout and expression

For layout and expression, custom markup and CSS is on a par with Set components: use whichever fits better. For example, a page can be laid out in custom CSS Grid rather than `Grid` and `GridItem`, and a display heading can be styled in custom CSS rather than with `Heading`.

## Materials

### Layout and space

- **Layout** comes from Set's layout components, or custom markup and CSS.
- **Vertical space** comes from component props, or vertical spacing tokens.
- **Horizontal space** comes from component props, or horizontal spacing tokens.
- **Breakpoints and container queries** live inside components, or in custom CSS.
- **Asymmetry** comes from `Grid` spans, or custom markup and CSS.
- **Bleeds** come from Set's layout components, or custom markup and CSS.
- **Overlaps:** none, except in components built for layering, such as `Poster`.

### Type

- **Font size** comes from components, or type composites and type steps. For display type, it can also be fluid between any two type steps, or fit to its container's width. The line height for each:
  - **Fluid:** runs between the two steps' line heights, rounded up to the 6px grid.
  - **Fit to width:** line height 1, with the type on one line or broken by hand, and any space above and below from vertical spacing tokens.
- **Weight and width** come from components or type tokens. At 28px (type step 600) and up, any weight token can pair with any width token.
- **Slant** comes from semantic elements in copy, such as `em` and `cite`, or `font-style: italic`.

### Color

- **Color comes from components and surfaces**, or color tokens.

### Graphics and motion

- **SVG, canvas and WebGL** are fine.
- **Motion** comes from components, or motion tokens. Graphics step on frame tokens (`--set-motion-frame-*`).
- **Images and video** use `Image` and `Video`, or raw elements.

### Components

- **Layout, structure, typographic and graphic components:** Set components or custom, whichever fits.
- **Control, navigation and status components:** Set components first, custom only for a gap.
