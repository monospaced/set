# @measured/set-skills

## 0.4.3

## 0.4.2

### Patch Changes

- 05d4806: Update the Storybook component-catalog link to the new canonical domain `set.measured.co` (was `set.mnsp.dev`).

## 0.4.1

## 0.4.0

### Minor Changes

- 505cde5: Add an `exports` subpath map (`./*` → `./src/*`) so skills resolve at clean paths — `@measured/set-skills/<skill>/SKILL.md` and `.../<skill>/examples/...` — instead of leaking the internal `src/` directory. References that used the `@measured/set-skills/src/...` form should drop the `src/` segment.

### Patch Changes

- 505cde5: Editorial polish to `compose-first` and `custom-with-tokens` so they read well as published docs prose: component names are consistently inline code (not bold), prose uses curly quotes/apostrophes (code samples unchanged), the JSX-notation note is a paragraph rather than a blockquote, and the component-catalog reference links as "Storybook" rather than a bare URL. No guidance changes.
- 2c56312: Clarify a layout nuance in the skills: `Stack` / `Inline` hold a single fixed arrangement (`Inline` only wraps) and `Grid` / `GridItem` responsiveness is page-level, so a self-contained block needing its own breakpoint-driven layout switch is a genuine custom-with-tokens gap — not a reason to force the layout primitives.

## 0.3.0

### Patch Changes

- f08a227: Add an "About Set" orientation section to the package README. Brief context for AI agents (and humans) reading skills cold: what the system is, the compositional + multi-context model, brand context disambiguation (`mnsp` for production, `wrfr` for wireframes / sketches / internal tools, `base` as a structural foundation that consumers don't pick), and the brand voice for content / copy / naming decisions.

  A standalone design-language skill was considered and deliberately not authored — most of its actionable content was already encoded in tokens, components, and the operational `compose-first` / `custom-with-tokens` skills.

- 7c52969: Compose-first full-page example now passes `appOverscrollBehavior="none"` on the Root, matching app-shell layout best practice (prevents iOS/macOS rubber-band overscroll at the document root). Both flavors updated together.
- 7c52969: Polish the compose-first full-page example: switch the header `Logo` from `variant="primary"` to `variant="secondary"` (the more common pairing for compact site furniture), and tighten the footer `Box paddingBlock` from `md` to `sm`. Both flavors (`examples/core/full-page.md`, `examples/react/full-page.md`) updated together.
- 4884b80: compose-first: pass `headerBorder: "scroll"` (core) / `headerBorder="scroll"` (react) on Page in the full-page examples. Restores the bottom-border-on-stuck behaviour now that Page has decoupled border from sticky.
- 4884b80: compose-first: pass `headerSize: "lg"` (core) / `headerSize="lg"` (react) on Page in the full-page examples to match the new Page default behaviour. The previous default mapped to ~72/84px header band; under the new `"sm" | "md" | "lg"` enum, that height now requires `"lg"` explicitly.
- 62a4386: Update the live component catalog URL in `compose-first` and `custom-with-tokens` skills from `set-storybook.mnsp.dev` (retired) to `set.mnsp.dev/storybook` (the bundled docs-site deploy).

## 0.2.0

### Minor Changes

- 056f669: Author the "Compose first" skill — the canonical guardrail for AI coding agents (and humans) building sites and apps with Set. The skill establishes the compose-first paradigm: reach for layout primitives (Page, Container, Stack, Inline, Box, Grid, GridItem), Surface for color context, and content components (Heading, Text, Prose, etc.) before authoring custom CSS. Worked end-to-end full-page examples ship under `examples/core/` (template-string flavor for `@measured/set-core` consumers) and `examples/react/` (JSX flavor for `@measured/set-react` consumers).
- 18843e4: Author the "Custom with tokens" skill — the second operational guardrail in the skills package, paired with `compose-first`. Read this when compose-first has run out and you're about to author custom markup. The skill establishes the layered model: existing components for everything that fits, custom markup + CSS for the parts no component covers, tokens for any design value, plain CSS for structural concerns. Includes guidance on picking the right token (catalog + `$description`), accessibility (contrast via tokens, the `.visually-hidden` utility, focus indicator integrity, ARIA references), CSS architecture (`:where(.set)` scoping, project-prefixed class names), and smell tests for when custom-with-tokens has slipped into building parallel infrastructure. Worked Stepper examples ship under `examples/core/` (template-string flavor for `@measured/set-core` consumers) and `examples/react/` (TSX flavor for `@measured/set-react` consumers).

  Aligns the `compose-first` skill's References section to the same shape (same four bullets — Storybook, Component SPECs, CSS catalog, JSON tokens — same wording per bullet) and routes inline component pointers through References rather than directly at Storybook, matching the dual-audience (agent + human) framing.

- 056f669: Scaffold the `@measured/set-skills` package. Establishes the workspace presence and consumer install/copy story; skill content lands in subsequent changes.
