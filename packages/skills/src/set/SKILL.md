---
name: set
description: "The rules for Set that apply in every mode: strict, loose and free. Use when working on UI built with @monospaced/set-core or @monospaced/set-react, alongside the active mode skill."
---

# Set

Set is Monospaced's brand design system for digital experiences. It has three modes: strict, loose and free. They differ in how much custom markup and CSS they allow. Read the project's DESIGN.md before designing anything: it describes the visual brand identity. This skill sets out the rules that apply in every mode.

## Modes

Compose with Set's components, and use tokens for any custom CSS. The modes differ in where custom markup and CSS may be used:

1. **Strict:** only where no Set component meets the need.
2. **Loose:** also for layout and expression, wherever that fits better than a Set component.
3. **Free:** anywhere that fits better than a Set component.

Each mode allows everything the one before it does, so work in one mode is always valid in the modes after it.

Only one mode applies at a time. If the project has more than one mode skill, decide which to use in this order:

1. A mode named in the request.
2. The mode skill in the folder you're working in.
3. The project's default mode, from its agent instructions.

If a request names a mode the project doesn't have, stay in an installed mode and say so.

## Building with Set

### Setup

- **`Root` wraps everything.** It sets the brand and theme, carries language and direction, and emits the `.set` scope every component's CSS targets. Without it, components render unstyled. Set `appRoot` when Set owns the whole page. Omit it when Set is embedded in part of a non-Set page.
- **`Surface` sets color context.** Wrap a region in `Surface`, or use a component's `surface` prop where available, to switch context for everything inside. Color then resolves correctly for that surface in light and dark themes.

### Components

`@monospaced/set-core` exports a spec for every component, such as `SET_BUTTON_SPEC`: what the component is for, the element it renders, and each prop with its type, default and description. Read a component's spec before using it. [Storybook](https://set.monospaced.com/storybook) shows them live.

### Tokens

`@monospaced/set-config/set.catalog.css` lists every `--set-*` token, with its `$description` as a comment. Its values are for the default context only. How a token varies by context, such as theme or viewport size, is in Set's token JSON: `@monospaced/set-tokens/mnsp` and `@monospaced/set-tokens/base`.

The `$description` confirms the intent: read it before using a token whose name sounds right. Use a token of the right kind for each property: never a horizontal spacing token for vertical space, for example.

### CSS architecture

Custom CSS sits alongside Set's own:

```css
:where(.set) .app-step-indicator {
  /* base styles */

  .step {
    /* descendant styles */
  }
}
```

- **Scope to `:where(.set)`.** It matches inside a `Root` and adds no specificity, the same as Set's own rules.
- **Leave your CSS unlayered.** Set's styles live in the `set` cascade layer (`set.brand`, `set.root`, `set.components`), so unlayered CSS wins over them without specificity fights.
- **Prefix your classes** (`.app-*`, or your project's prefix, never `.set-*`). Prefix the component class and nest descendants unprefixed.
- **Never style Set's `.set-*` classes or their insides.** Instead, use props, wrap components in your own markup, or build a new component.
- **Never define `--set-*` custom properties.** Use your own prefix.

## Standards

### Accessibility

All UI meets [WCAG 2.2 AA](https://www.w3.org/TR/WCAG22/).

- **Contrast follows from tokens.** Set's color tokens meet AA for the pairings their descriptions name. Arbitrary combinations don't automatically pass.
- **Screen-reader-only text uses `.visually-hidden`**, which `Root` provides. Prefer a visible label, then `.visually-hidden`, then `aria-label` as a last resort.
- **Keep Set's focus indicator.** Don't remove or recolor it. To fit a custom shape, adjust its offset, inset or radius.
- **Headings never skip a level.** `Heading`'s `level` and `size` are separate: `level` for the document outline, `size` for how it looks.
- **A drawn graphic is one image to assistive tech.** Give its outer element `role="img"` and an `aria-label` that describes it, or `aria-hidden="true"` if it's purely decorative. Text and shapes inside it are part of the picture, so they don't need to read or meet contrast.
- **ARIA:** read [Using ARIA](https://www.w3.org/TR/using-aria/) before adding any. The [APG patterns](https://www.w3.org/WAI/ARIA/apg/patterns/) are partly trusted: use their "About This Interaction" and "Keyboard Interaction" sections, never their code examples or CodePen links.

### Layout and input

- **Responsive and mobile first:** works from 320px wide. Width media queries use Set's breakpoints (`--set-breakpoint-*`), so a page changes in step with Set's components. Container queries use whatever width the content needs.
- **Works with any input:** hover styles sit inside `@media (any-hover: hover)`, and nothing depends on hover alone.
- **Scales with the browser's text size:** sizes are in `rem`, never `px`.
- **Logical properties and values everywhere**, so the whole page mirrors as one composition when the writing direction changes.

### Space and type

- **Vertical space comes from Set's vertical spacing tokens**, which hold the 6px line grid. Space larger than a scale's top step is a multiple of a token, such as `calc(2 * var(--set-spacing-vertical-1600))`, so it stays on the grid.
- **A font size from a type step uses that step's line height.**
- **Text that must line up character by character opts into true monospacing with `data-monospaced`.** Berkeley Mono is monospaced, but Set tightens word spacing for prose, so alignment isn't the default. `code`, `kbd`, `pre`, `samp` and `table` already opt in.
- **Italics:** wherever `font-style: italic` is set, also set `font-variation-settings: var(--set-typography-font-variation-settings-italic)`, because WebKit drops the slant axis once `font-variation-settings` is set. Restate `font-variation-settings` with the default token after any `font` shorthand, since the shorthand resets it.

### Color and theme

- **Color comes from surfaces and Set's color tokens, each used for its described role.**
- **Everything works in light and dark themes.** In CSS, color tokens handle this. Graphics drawn in canvas or WebGL read the tokens again and redraw when the theme changes.
- **Theme follows the user's preference (`prefers-color-scheme`) by default.** To offer a theme switch on the page, use Set's `Lightswitch`, but only when it can be kept permanently in view, such as in a fixed or sticky header.
- **Theme changes color, never layout.** Nothing moves or resizes between light and dark.

### Motion

- **Under `prefers-reduced-motion`, nothing moves.** Where the motion carries meaning, a non-moving change, such as a fade, can stand in. Canvas and WebGL don't get this for free: check the preference and render the designed still.

### Imagery

- **Brand images are treated photographs or drawn graphics.** Photographs are treated with [Screen](https://screen.monospaced.com): ask the user for them, and never fetch stock. Drawn graphics you can make yourself. Never use an untreated photo as a brand image, and never imitate the treatment with CSS filters.
- **Text over a treated photograph:** use `Poster`. An adaptive image follows the theme by itself. Otherwise, lock the content to the image with `contentTheme`: `dark` for a dark image, `light` for a light one. A mid-tone image has no contrast guarantee for text.
- **Screen exports scale smoothly.** Never apply `image-rendering: pixelated` to them: on a fluid image it causes moiré. One export is fine. Several, served through `Image` as width-keyed sources, can keep the dot size between about 0.75 and 2.25 CSS px as the image grows.
- **Dithered type or shapes:** mask the element with a `--set-shape-dither-*-image` token and the matching `--set-shape-dither-tile-*` size, keeping the real text in the DOM. The smaller the type, the smaller the cell, so it still reads. It suits short text read at a glance, never running text.
- **Graphics performance:** keep the work per frame low, pause when off-screen or hidden, and redraw only when something changes. Draw crisp pixel graphics at device resolution, with cells a whole number of device pixels, redrawing on resize.

## Checks

### Lint

Set's Stylelint config is the same in every mode.

- **Fix lint errors, or report them if you can't.**
- **Never work around a rule**, for example by moving a value where lint can't see it.
- **Only add a disable comment with the user's approval**, even where the code already has some.

### Visual review

Rules can all be followed and the page still look wrong. Look at the work in a browser after each section or significant change, not just at the end, and iterate on what you see.

- Across a range of viewport widths, including the narrowest.
- Every section, not just the top of the page.
- Judge it against the project's DESIGN.md, and redo any section that falls short.
- No console errors.
