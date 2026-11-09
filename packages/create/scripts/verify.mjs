#!/usr/bin/env node

import { readFileSync } from "node:fs";

import { render, TOOLCHAIN } from "./sync.mjs";

/**
 * Fails when `src/toolchain.mjs` no longer matches the monorepo's toolchain.
 */

if (readFileSync(TOOLCHAIN, "utf8") !== (await render())) {
  console.error(
    "packages/create/src/toolchain.mjs is not up to date. Run `pnpm create:sync` and commit the result.",
  );
  process.exit(1);
}

console.log("packages/create/src/toolchain.mjs is up to date.");
