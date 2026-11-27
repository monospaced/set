---
"@monospaced/set-skills": minor
---

Three modes. `compose-first` and `custom-with-tokens` are replaced by four skills: `set`, the rules that apply in every mode, and `set-strict`, `set-loose` and `set-free`, one per mode. Strict composes with Set's components, with custom markup and CSS only where no component meets the need. Loose adds custom layout and expression on tokens. Free adds any weight, width and slant, overlaps, custom controls and any timing for graphics. Every mode shares the same floor, lint and `DESIGN.md`, Monospaced's visual brand identity, which the package now ships at `@monospaced/set-skills/DESIGN.md`. The generated stepper example moves to `set-strict/examples/stepper.md`.
