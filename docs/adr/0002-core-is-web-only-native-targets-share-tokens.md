# ADR-0002 — Core is web-only; native targets share tokens, not components

## Status

Accepted — 2026-10-07

## Context

Set's component library, `@monospaced/set-core`, renders native HTML through a `SetNode` intermediate representation (tags, attributes, children) styled by a co-located CSS contract. Each component also exports a machine-readable `SET_*_SPEC` describing its props, content shape, events and the attribute rules the renderer follows. The React adapter is generated from those SPECs and is thin because `reactify` is a faithful DOM walker.

Exploring a React Native target raised the question of whether a native component library should be generated from, or programmatically linked to, the same SPECs. Measured across all 43 components, the SPEC is a web rendering contract that happens to carry a mostly platform-neutral prop surface:

- `output` and `rules.attributes` are entirely HTML and ARIA. Rendering and accessibility, the two halves a native adapter would need most, do not transfer.
- Roughly 50 of 355 props are web-only (form plumbing, navigation, media, document attributes), plus `id` on every component. Some neutral-looking values encode CSS, such as a label visibility that is really a media query.
- Styling lives in component CSS as cascading selectors and `calc()` over custom properties, not in the SPEC. There is no non-DOM renderer to point the IR at.
- The inventory is shaped by web documents (`Page`, `Root`, `Prose`, `Link`, `Details`, `Grid`, `Sidebar`, `Nav`, `Video`); native apps need screens, navigation stacks, lists, sheets and safe areas that Set does not have.
- Nine components are DOM-bound custom elements, and icons enter the tree as raw SVG strings.

Design systems that support both web and native overwhelmingly share tokens and build native libraries to native idioms, using the web library as a reference. The exception, Material, authored a platform-agnostic specification first. Set's SPEC is downstream of core's HTML.

## Decision

Core and its SPEC are web-only by design. They are not refactored towards platform neutrality.

Non-web targets share Set's tokens through the resolver-driven Style Dictionary pipeline, which emits per-platform artifacts from the same DTCG sources. They may also share other genuinely platform-neutral data (for example icon geometry). They do not depend on `@monospaced/set-core` or `@monospaced/set-adapter`, and they are not generated from the SPEC.

A native component library, if built, is a sibling system: it depends on `@monospaced/set-tokens`, references core's SPECs and documentation for naming, intent and visual language, and otherwise adapts to its platform's paradigms rather than reproducing core's HTML boundaries.

## Consequences

Positive:

- Core keeps a single, honest contract. No platform-neutral abstraction is layered over HTML rendering that only one consumer needs.
- The token pipeline is proven to emit for a non-CSS platform, validating the choice to author in DTCG and build with Style Dictionary.
- Native work is free to use native idioms (pressables, sheets, safe areas, platform shadow models) without arguing with a web contract.
- The web adapter codegen stays simple: it only ever has to target the DOM.

Trade-offs:

- Component parity across web and native is a human responsibility. Prop names, size and tone vocabularies and behaviour are kept aligned by convention and review, not by generation.
- Two component libraries are two libraries to maintain. The native one is expected to stay small and be scoped to what apps actually need.
- Some brand nuances expressed through CSS (variable-font axes such as condensed widths, content-theme regions, forced-colours palettes) have no direct native equivalent and need platform-specific decisions, such as pre-instanced font files.

## Alternatives considered

Generate a React Native adapter from the SPEC via a second emitter in `@monospaced/set-adapter`. Rejected: the emitter could produce prop types and callback names but not render bodies or accessibility, and would import boundaries drawn for documents rather than screens.

Split each SPEC into a platform-neutral component contract and a web rendering contract, lifting accessibility rules from ARIA attributes to roles and states each platform encodes. Rejected for now: a core-wide refactor whose only consumer would be a native library that does not yet exist. It remains the route to a Material-style shared specification if that is ever wanted.

Rewrite core in React Native primitives and serve the web through `react-native-web`. Rejected: it inverts Set's SSR-first, native-HTML thesis and degrades the web output.
