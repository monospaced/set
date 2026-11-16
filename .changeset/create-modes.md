---
"@monospaced/create-set": minor
---

Asks which Set mode should be the default (`strict`, `loose` or `free`; `--mode` as a flag), and writes it into `CLAUDE.md` and `AGENTS.md` with a line to load the `set` skill before writing any UI. `scripts/sync-set.mjs` now also copies `DESIGN.md` into the project root, alongside the four skills. `pnpm create:pack <dir>` packs the workspace's Set packages for `CREATE_SET_PACK_DIR`, to scaffold against an unreleased branch.
