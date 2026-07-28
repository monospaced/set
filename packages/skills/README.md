## @monospaced/set-skills

Markdown guardrails for AI coding agents (and humans) building sites and apps with Set.

Each skill is a folder containing a `SKILL.md` (with `name` and `description` frontmatter) plus optional sibling `examples/`, `references/`, and `assets/` folders. The shape is shared by Claude Code and OpenAI Codex, so authoring vendor-neutral skills works in both.

## About Set

These skills are companion content for the Set design system: `@monospaced/set-{core,assets,config,tokens}` (and `@monospaced/set-react` for React projects), serving the **Monospaced** brand.

- **Compositional** — components encode design choices in their props; consumers compose UI from the system's vocabulary rather than authoring custom CSS.
- **Multi-context** — tokens resolve under theme (light / dark), brand, and surface context automatically.
- **Brand contexts**:
  - `mnsp` — the public-facing Monospaced brand.
  - `wrfr` — a stripped-back wireframe expression of the same brand (monochrome, no rounding, no motion). Use for wireframes, sketches, and internal tools.
  - `base` — structural foundation layer. Not a brand; consumers don't pick it.
- **Voice (for content, copy, and naming decisions)** — calm, business-like, time-less; organised and precise.

The operational skills below cover _how_ to use the system; this section is just orientation.

## Install

```sh
pnpm add -D @monospaced/set-skills
```

## Use

Copy or symlink the skill folders this package ships into your agent's discovery directory:

- **Claude Code** → `.claude/skills/`
- **OpenAI Codex** → `.agents/skills/`

```sh
# Example: install all skills for Claude Code
cp -r node_modules/@monospaced/set-skills/src/* .claude/skills/
```

Refer to your agent's documentation for the canonical discovery paths.
