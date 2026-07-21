#!/usr/bin/env node

import { spawnSync } from "node:child_process";

/**
 * Verification entrypoint for generated distribution artifacts.
 *
 * This script rebuilds token outputs and fails if `dist` differs from
 * the checked-in state, ensuring generated artifacts stay committed and current.
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
 * Executes build + dist cleanliness verification.
 *
 * @returns {void}
 */
function main() {
  run("pnpm", ["run", "build"], { stdio: "inherit" });

  const diff = spawnSync("git", ["diff", "--exit-code", "--", "dist"], {
    cwd,
    stdio: "pipe",
    encoding: "utf8",
  });

  if (diff.status !== 0) {
    console.error(
      "packages/system/dist is not up to date. Run `pnpm run build` in packages/system and commit updated dist artifacts.",
    );

    if (diff.stdout) {
      console.error(diff.stdout);
    }
    if (diff.stderr) {
      console.error(diff.stderr);
    }

    process.exit(1);
  }

  console.log("packages/system/dist is up to date.");
}

try {
  main();
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
