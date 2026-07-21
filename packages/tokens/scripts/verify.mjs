#!/usr/bin/env node

import { spawnSync } from "node:child_process";

/**
 * Verification entrypoint for the consumer-facing tokens artifacts.
 *
 * Re-runs the system pipeline (which writes JSON into this package's `dist`),
 * validates each artifact against `schemas/tokens.v1.json`, and fails if the
 * regenerated `dist` differs from the checked-in state. Together those three
 * steps catch source/output drift, schema regressions, and uncommitted
 * generated artifacts.
 */

const cwd = process.cwd();

/**
 * Runs a subprocess inheriting stdio and throws on non-zero exit.
 *
 * @param {string} cmd
 * @param {string[]} args
 */
function run(cmd, args) {
  const res = spawnSync(cmd, args, { cwd, stdio: "inherit" });

  if (res.status !== 0) {
    throw new Error(`${cmd} ${args.join(" ")} failed.`);
  }
}

async function main() {
  run("pnpm", ["--filter", "@monospaced/set-system", "build"]);
  run("pnpm", ["--filter", "@monospaced/set-tokens", "validate"]);

  const diff = spawnSync("git", ["diff", "--exit-code", "--", "dist"], {
    cwd,
    stdio: "pipe",
    encoding: "utf8",
  });

  if (diff.status !== 0) {
    process.stdout.write(diff.stdout || "");
    process.stderr.write(diff.stderr || "");
    throw new Error(
      "packages/tokens/dist is not up to date. Run `pnpm --filter @monospaced/set-system build` and commit updated dist artifacts.",
    );
  }

  console.log("packages/tokens/dist is up to date.");
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
