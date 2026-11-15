---
"@monospaced/set-skills": minor
---

One stepper example, generated from the playground. The hand-written examples (compose-first's full page and custom-with-tokens' stepper, in core and React) are replaced by `custom-with-tokens/examples/stepper.md`, built by `pnpm skills:sync` from the playground's `Stepper.tsx` and `Stepper.css`, so the code an agent copies is code that builds, type-checks and passes lint. The stepper itself restates `font-variation-settings` after the `font` shorthand, uses the correct `--set-typography-text-body-xs-font` token, moves its checkmark with transitions rather than keyframes so nothing animates on load, drops the scale under reduced motion, and centres its end labels with a grid column rather than a physical offset so it mirrors in right-to-left text.
