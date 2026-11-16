---
name: set-free
description: "The rules for Set's free mode: compose with Set's components, and also use custom markup and CSS anywhere that fits better. Use with the set skill when free is the active mode."
---

# Free mode

Free is for expressive work. Where the request leaves room, reach for what only free allows, held to DESIGN.md's restraint.

## Anywhere

Custom markup and CSS is on a par with Set components everywhere: use whichever fits better.

## Materials

### Layout and space

- **Layout** comes from Set's layout components, or custom markup and CSS.
- **Vertical space** comes from component props, or vertical spacing tokens.
- **Horizontal space** comes from component props, horizontal spacing tokens, or the character cell (`ch`).
- **Breakpoints and container queries** live inside components, or in custom CSS.
- **Asymmetry** comes from `Grid` spans, or custom markup and CSS.
- **Bleeds** come from Set's layout components, or custom markup and CSS.
- **Overlaps:** in components built for layering, such as `Poster`, or with custom markup and CSS. Text meant to be read still needs contrast against anything it overlaps.

### Type

- **Font size** comes from components, or type composites and type steps. For display type, it can also be fluid between any two type steps, or fit to its container's width. The line height for each:
  - **Fluid:** runs between the two steps' line heights, rounded up to the 6px grid.
  - **Fit to width:** line height 1, with the type on one line or broken by hand, and any space above and below from vertical spacing tokens.
- **Weight and width** come from components, type tokens, or any value on the font's axes.
- **Slant** comes from semantic elements in copy, such as `em` and `cite`, `font-style: italic`, or any angle on the font's slant axis, set with `'slnt'` in `font-variation-settings`.

### Color

- **Color comes from components and surfaces**, or color tokens.

### Graphics and motion

- **SVG, canvas and WebGL** are fine.
- **Motion** comes from components, or motion tokens. Graphics can use any timing.
- **Images and video** use `Image` and `Video`, or raw elements.

### Components

- **Layout, structure, typographic and graphic components:** Set components or custom, whichever fits.
- **Control, navigation and status components:** Set components or custom, whichever fits.
