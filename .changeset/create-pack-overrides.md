---
"@monospaced/create-set": patch
---

Dev harness only: with `CREATE_SET_PACK_DIR` set, every packed Set package is also pinned as a pnpm override in the generated workspace, so transitive dependencies such as core's icons resolve to the tarballs rather than the registry.
