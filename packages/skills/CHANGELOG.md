# @monospaced/set-skills

## 0.26.0

### Minor Changes

- f5babc7: Three modes. `compose-first` and `custom-with-tokens` are replaced by four skills: `set`, the rules that apply in every mode, and `set-strict`, `set-loose` and `set-free`, one per mode. Strict composes with Set's components, with custom markup and CSS only where no component meets the need. Loose adds custom layout and expression on tokens. Free adds any weight, width and slant, overlaps, custom controls and any timing for graphics. Every mode shares the same floor, lint and `DESIGN.md`, Monospaced's visual brand identity, which the package now ships at `@monospaced/set-skills/DESIGN.md`. The generated stepper example moves to `set-strict/examples/stepper.md`.

### Patch Changes

- f5babc7: `DESIGN.md` drops the "brand color expresses; intent color informs" bullet, which read as there being two kinds of color and left the other semantic groups, such as the avatar palette, outside the rule. The `set` skill's "each token used for its described role" and the token descriptions already say what each group is for. With `Panel` removed from core, the strict skill and `DESIGN.md` no longer mention it.
- f5babc7: `DESIGN.md`'s Typography section adds two bullets: headings and display text never end in a full stop and mostly avoid other punctuation, and numbers at display size take no thousands separator or decimal point, because every mark takes a full character width.
- f5babc7: `DESIGN.md`'s heading is "Design", with the brand named by the frontmatter's `name` as the format intends, and its lead is "Principles for designing in Monospaced's visual brand identity: what to aim for, and why.", with the Set sentence as its own paragraph. The `set` skill adds an accessibility rule: a drawn graphic is one image to assistive tech, with `role="img"` and an `aria-label`, or `aria-hidden` when decorative, so the text and shapes inside it needn't read or meet contrast.
- f5babc7: `DESIGN.md` wording: the neutrals bullet drops paper and ink, the brand-colour-on-text rationale says cyan text gets mistaken for a link, and the punctuation rationale says the gap grows with the type rather than being a letter wide.
- f5babc7: `DESIGN.md`'s Logo section says a project's type wordmark is its logo until a drawn one exists, and that when it links home the link wraps it, keeping its own color and taking no underline.

## 0.25.0

### Minor Changes

- a65c0dd: One stepper example, generated from the playground. The hand-written examples (compose-first's full page and custom-with-tokens' stepper, in core and React) are replaced by `custom-with-tokens/examples/stepper.md`, built by `pnpm skills:sync` from the playground's `Stepper.tsx` and `Stepper.css`, so the code an agent copies is code that builds, type-checks and passes lint. The stepper itself restates `font-variation-settings` after the `font` shorthand, uses the correct `--set-typography-text-body-xs-font` token, moves its checkmark with transitions rather than keyframes so nothing animates on load, drops the scale under reduced motion, and centres its end labels with a grid column rather than a physical offset so it mirrors in right-to-left text.

## 0.24.0

No changes in this release.

## 0.23.0

No changes in this release.

## 0.22.0

## 0.21.0

## 0.20.2

## 0.20.1

## 0.20.0

## 0.19.1

## 0.19.0

## 0.18.0

## 0.17.0

## 0.16.0

## 0.15.0

## 0.14.2

## 0.14.1

## 0.14.0

## 0.13.0

## 0.12.0

## 0.11.0

## 0.10.1

## 0.10.0

## 0.9.0

## 0.8.0

## 0.7.0

## 0.6.0

## 0.5.1

## 0.5.0

## 0.4.0

## 0.3.0

## 0.2.0

## 0.1.0

## 0.0.1
