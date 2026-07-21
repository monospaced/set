#!/usr/bin/env node

import { spawnSync } from "node:child_process";

/**
 * Verification entrypoint for the generated token catalog.
 *
 * Re-runs the system pipeline (which writes `set.catalog.css` into this
 * package) and fails if the regenerated artifact differs from the
 * checked-in state. Catches source/output drift the same way
 * `@measured/set-tokens` verifies its JSON outputs.
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
  run("pnpm", ["--filter", "@measured/set-system", "build"]);

  const diff = spawnSync(
    "git",
    ["diff", "--exit-code", "--", "set.catalog.css"],
    {
      cwd,
      stdio: "pipe",
      encoding: "utf8",
    },
  );

  if (diff.status !== 0) {
    process.stdout.write(diff.stdout || "");
    process.stderr.write(diff.stderr || "");
    throw new Error(
      "packages/config/set.catalog.css is not up to date. Run `pnpm --filter @measured/set-system build` and commit the updated artifact.",
    );
  }

  console.log("packages/config/set.catalog.css is up to date.");
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
