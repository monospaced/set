# Stepper

A stepper shows where someone is in a multi-step process: onboarding, checkout, a long form split across pages. It's a row of numbered steps, each done, current or upcoming, joined by a line. Set doesn't ship one, so it's a gap to fill with the system: a Set component where one fits, custom markup for the rest, and tokens for every design value.

<!-- tsx -->

<!-- css -->

## Notes

- **`Icon` is the one leaf a component covers.** It handles the checkmark's sizing and color inheritance. The number and the icon both render on every step, and CSS reveals the one the state calls for.
- **Why not `Text` for the number and label?** The design needs specific weights and tabular figures, and `Text` doesn't expose `font-weight` or `font-variant-numeric`. So the example drops to a plain `span`, takes the body-xs composite font token, and overrides only the deviations.
- **`data-state` is the seam between markup and styling.** State semantics live on the element, and each visual state is a CSS rule keyed off the attribute. An `error` state would be one more value in the data and one more CSS block, colored with `--set-color-intent-danger-*`.
- **One size, from one token.** `--app-stepper-size` is set once from a vertical spacing token, so the bubble follows the vertical rhythm and both sides match. It's round by convention, as step markers are, with a radius of `--set-radius-ratio-lg` times its size. The property is defined and consumed in the same file, which keeps it local to the component and satisfies the `set/set-known-tokens` lint rule.
- **The step is a one-column grid as wide as the bubble.** Centring the label in that column places it under the bubble whether the step is justified to the start, the centre or the end, in either writing direction, so the first and last labels need no offset of their own. A label wider than the bubble overhangs the row's ends by half the difference, so keep end labels short or give the row room.
- **Transitions, not keyframes.** A transition doesn't run on first render, so completed steps don't animate in as the page loads; the checkmark only moves when a step becomes done. Under `prefers-reduced-motion: reduce` the scale is dropped and the fade stands in.
- **Accessibility.** `aria-current="step"` marks the active step. The bubble is `aria-hidden` because the state is already carried by `aria-current` and by the `.visually-hidden` text appended to each label. `.visually-hidden` ships from `Root`, so there's nothing to redefine.
