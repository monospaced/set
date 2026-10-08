#!/usr/bin/env node

import { spawnSync } from "node:child_process";

/**
 * Verification entrypoint for the generated icon registry.
 *
 * `src/icons.generated.ts` is generated from the authored lists and checked
 * in, so it can silently drift when a list changes and nobody regenerates.
 * This regenerates and fails if `src` differs from the checked-in state —
 * the same guard the system, tokens and react packages apply.
 */

const cwd = process.cwd();

const generate = spawnSync("node", ["scripts/generate-icons.mjs"], {
  cwd,
  stdio: "inherit",
});

if (generate.status !== 0) {
  throw new Error("generate-icons.mjs failed.");
}

const diff = spawnSync("git", ["diff", "--exit-code", "--", "src"], {
  cwd,
  stdio: "pipe",
  encoding: "utf8",
});

if (diff.status !== 0) {
  process.stdout.write(diff.stdout || "");
  process.stderr.write(diff.stderr || "");
  throw new Error(
    "packages/icons/src is not up to date. Run `pnpm icons:generate` and commit the result.",
  );
}

console.log("packages/icons/src is up to date.");
