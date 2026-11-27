# @monospaced/set-skills

Markdown guardrails for AI coding agents (and humans) building sites and apps with Set: the `set` skill, a skill for each of Set's three modes, and `DESIGN.md`.

Each skill is a folder containing a `SKILL.md` (with `name` and `description` frontmatter) plus optional sibling `examples/`, `references/`, and `assets/` folders. The shape is shared by Claude Code and OpenAI Codex, so authoring vendor-neutral skills works in both.

## About Set

These skills are companion content for the Set design system: `@monospaced/set-{core,assets,config,tokens}` (and `@monospaced/set-react` for React projects), serving the **Monospaced** brand.

- **Compositional** — components encode design choices in their props; consumers compose UI from the system's vocabulary, and custom CSS takes its values from tokens.
- **Multi-context** — tokens resolve under theme (light / dark), brand, and surface context automatically.
- **Brand contexts**:
  - `mnsp` — the public-facing Monospaced brand.
  - `wrfr` — a stripped-back wireframe expression of the same brand (monochrome, no rounding, no motion). Use for wireframes, sketches, and internal tools.
  - `base` — structural foundation layer. Not a brand; consumers don't pick it.
- **Voice (for content, copy, and naming decisions)** — calm, business-like, time-less; organised and precise.

## What ships

| File                  | What it is                                                                                                                                                                          |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `set/SKILL.md`        | The rules that apply in every mode: setup, components, tokens, CSS architecture, accessibility, layout, type, color, motion, imagery, lint and visual review.                       |
| `set-strict/SKILL.md` | Strict mode. Its `examples/stepper.md` fills a gap with the system; it is generated from the playground's stepper, so the code an agent copies builds, type-checks and passes lint. |
| `set-loose/SKILL.md`  | Loose mode.                                                                                                                                                                         |
| `set-free/SKILL.md`   | Free mode.                                                                                                                                                                          |
| `DESIGN.md`           | Monospaced's visual brand identity: what to aim for, and why. Every mode judges the work against it.                                                                                |

## Modes

A project picks one mode as its default. The modes differ in where custom markup and CSS may be used instead of a Set component. Each allows everything the one before it does, so work in one mode is always valid in the modes after it.

- **Strict** composes with Set's components. Custom markup and CSS only where no Set component meets the need: a component Set doesn't have, a block that switches arrangement at its own width, a one-token optical adjustment. For product UI, tools and anything that should look like Set out of the box.
- **Loose** adds custom layout and expression on tokens. A page can be laid out in custom CSS Grid rather than `Grid`, display type can be styled in custom CSS rather than `Heading`, fluid or fit to its container's width, and graphics in SVG, canvas and WebGL step on Set's frame tokens. Controls, navigation and status still come from Set. For marketing pages, editorial layouts and anything with expressive type and graphics.
- **Free** adds any weight, width and slant on the font's axes, overlaps, custom controls and any timing for graphics. Custom markup and CSS is on a par with Set components everywhere. For posters, experiments and work where the brand is the subject.

Every mode shares the same floor: the `set` skill's rules, Set's Stylelint config, and `DESIGN.md`. A mode changes how much is built outside Set's components, never how good the result has to be.

Only one mode applies at a time. With more than one mode skill installed, an agent follows a mode named in the request, then the mode skill in the folder it's working in, then the project's default mode from its agent instructions.

## Install

```sh
pnpm add -D @monospaced/set-skills
```

`pnpm create @monospaced/set` does the rest of this section for you: it installs the skills and `DESIGN.md`, asks which mode should be the default, and writes it into `CLAUDE.md` and `AGENTS.md`.

## Use

Copy or symlink the skill folders this package ships into your agent's discovery directory, and `DESIGN.md` into the project root:

- **Claude Code** → `.claude/skills/`
- **OpenAI Codex** → `.agents/skills/`

```sh
# Example: install all skills and DESIGN.md for Claude Code
cp -r node_modules/@monospaced/set-skills/src/* .claude/skills/
cp node_modules/@monospaced/set-skills/DESIGN.md .
```

Then name the default mode in the project's agent instructions (`CLAUDE.md`, `AGENTS.md`), with a line to load `set` before writing UI:

```md
Built with Set. Load the `set` skill before writing any UI. The default mode is strict.
```

Refer to your agent's documentation for the canonical discovery paths.
