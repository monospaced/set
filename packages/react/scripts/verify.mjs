#!/usr/bin/env node

import { spawnSync } from "node:child_process";

/**
 * Verification entrypoint for the generated React adapter.
 *
 * The `src/components/*` adapters are generated from the core component
 * SPECs (`@measured/set-adapter` → `generate:react`). They are
 * committed source, so they can silently drift when a core SPEC changes
 * and nobody regenerates. This rebuilds core and regenerates the adapter,
 * then fails if `src` differs from the checked-in state — the same guard
 * `system:verify` / `tokens:verify` apply to their generated artifacts.
 */

const cwd = process.cwd();

/**
 * Runs a subprocess and throws with captured output when it fails.
 *
 * @param {string} cmd
 * @param {string[]} args
 * @param {import("node:child_process").SpawnSyncOptions} opts
 * @returns {import("node:child_process").SpawnSyncReturns<string>}
 */
function run(cmd, args, opts = {}) {
  const res = spawnSync(cmd, args, {
    cwd,
    stdio: "pipe",
    encoding: "utf8",
    ...opts,
  });

  if (res.status !== 0) {
    throw new Error(
      `${cmd} ${args.join(" ")} failed.\n${res.stdout || ""}\n${res.stderr || ""}`,
    );
  }

  return res;
}

/**
 * Rebuilds core, regenerates the adapter, and verifies `src` cleanliness.
 *
 * @returns {void}
 */
function main() {
  // Core first — the generator reads its SPECs, so a stale core would
  // mask drift this guard exists to catch.
  run("pnpm", ["--filter", "@measured/set-core", "run", "build"], {
    stdio: "inherit",
  });
  run("pnpm", ["run", "prebuild"], { stdio: "inherit" });

  const diff = spawnSync("git", ["diff", "--exit-code", "--", "src"], {
    cwd,
    stdio: "pipe",
    encoding: "utf8",
  });

  if (diff.status !== 0) {
    console.error(
      "packages/react/src is not up to date with the core SPECs. Run `pnpm run prebuild` in packages/react and commit the regenerated adapter.",
    );

    if (diff.stdout) {
      console.error(diff.stdout);
    }
    if (diff.stderr) {
      console.error(diff.stderr);
    }

    process.exit(1);
  }

  console.log("packages/react/src is up to date.");
}

try {
  main();
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
