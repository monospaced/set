---
"@monospaced/create-set": patch
---

Bootstrapped projects set `allowBuilds: esbuild: false` in their `pnpm-workspace.yaml`, as Set's own workspace does, so installs don't stop at esbuild's build-script prompt. Its postinstall only swaps in a prebuilt binary; the JS fallback is fine.
