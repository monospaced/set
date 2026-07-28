# Architecture Decision Records

This directory captures significant architectural decisions for Set. Each record is one decision; once accepted, an ADR is durable — superseded rather than edited when context changes.

## When to write an ADR

- A choice that defines or constrains how Set is built or consumed.
- A choice you'd otherwise re-litigate in PRs, planning, or future debates.
- A choice with non-obvious trade-offs worth articulating.

If a decision is small, local, or easily reversed in code, it doesn't need an ADR.

## File format

- One file per decision.
- Filename: `NNNN-kebab-case-title.md` (e.g. `0001-code-first-authorship-no-design-tool-intermediary.md`).
- Number monotonically; never reuse.

## Structure

Each ADR contains:

- **Title** (`# ADR-NNNN — Short title`)
- **Status** — one of: Proposed / Accepted / Superseded by ADR-NNNN / Rejected — with the date the status was set.
- **Context** — what problem or pressure forced a choice. State the situation, not the conclusion.
- **Decision** — the choice. Direct, declarative.
- **Consequences** — what becomes easier or harder. List both. Trade-offs aren't a weakness; they're the point of writing the ADR.
- **Alternatives considered** — what was rejected and why.

## Updating

- Don't edit accepted ADRs except to fix typos or add cross-references.
- If a decision changes, write a new ADR that supersedes the old one. Link both ways.
- Re-litigation belongs in PRs and conversations, not in mutating prior records.
