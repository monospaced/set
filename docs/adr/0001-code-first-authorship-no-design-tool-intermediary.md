# ADR-0001 — Code-first authorship; no design-tool intermediary

## Status

Accepted — 2026-07-21

## Context

Mainstream design system practice keeps a design tool (Figma, Sketch, Penpot, etc.) as the canonical visual artifact alongside a code library as the canonical implementation. The two drift; teams build process to manage the drift. The pattern propagates downstream: consumers of a design system typically expect both an npm package _and_ a design-tool library to integrate into their own workflows.

## Decision

Set has no design-tool intermediary on either side of the package boundary.

For Set maintainers: the system is authored in code (tokens, components, stories, descriptions). Design decisions are made in the browser, against shipped rendering. There is no parallel Figma file.

For Set consumers: the published artifacts are the entire delivery surface — `@monospaced/set-tokens` (JSON), `@monospaced/set-core` (custom elements, component CSS, token CSS variables), and optional framework bindings (e.g. `@monospaced/set-react`) for teams targeting a specific framework. Intent travels with these artifacts as embedded metadata: `$description` on every published token, plus the documentation surfaces that ride with the framework and component packages. Consumers integrate via code; we do not ship a Figma library, Penpot file, or any other design-tool asset to accompany the packages. Consumers who maintain a separate Figma canon for their product do so independently of Set.

Both producer and consumer work against the same substrate the system ships against: code, browser, and the descriptions that travel with the tokens.

## Consequences

Positive:

- One source of truth on each side of the package boundary.
- No drift between a design-tool representation and shipped output.
- Agents have full context (behavior, state, a11y, motion, prose) alongside visual on both sides.
- Intent travels through the package boundary intact: `$description` on tokens, plus the documentation surfaces native to the framework / component packages. There is no separate "design documentation" canon to keep in sync.

Trade-offs:

- Producers and consumers must work in code (or pair with agents) for token / component changes. Set isn't a fit for teams unwilling to cross that boundary on either side.
- No path for round-trip integration with design tools. Export-only integration (one-way) was considered and rejected as shallow value — round-trip creates source-of-truth conflict that we choose not to enter.
- A large slice of Set's expressiveness lives in `core/` (component compositions, surface contexts, responsive media bindings, layered selectors) and isn't representable in design tools regardless. Any export would represent the leaves and miss the system.
- Consumers who require their internal product workflow to start in a design tool will need to maintain their visual canon independently and treat Set as the implementation substrate underneath. Set does not bridge that gap.

## Alternatives considered

Adopt Tokens Studio dialect as the canonical artifact for round-trip with Penpot and Figma (via the Tokens Studio plugin). Rejected for the reasons above; further, the canonical artifact would be optimised for one specific consumer (design tools) at the expense of others (docs, MCP, agents) where lookup ergonomics, schema validation, and modifier-axis metadata matter.

Ship a one-way export to Tokens Studio dialect alongside the existing `@monospaced/set-tokens`. Rejected: export without import is shallow value (consumers can already read CSS variables, JSON tokens, components), and signalling design-tool support implies a workflow Set intentionally doesn't endorse.
