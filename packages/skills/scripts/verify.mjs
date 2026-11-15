#!/usr/bin/env node

import { readFileSync } from "node:fs";

import { EXAMPLE, render } from "./sync.mjs";

/**
 * Fails when the stepper example no longer matches its template and the
 * playground's stepper source.
 */

if (readFileSync(EXAMPLE, "utf8") !== (await render())) {
  console.error(
    "packages/skills/src/custom-with-tokens/examples/stepper.md is not up to date. Run `pnpm skills:sync` and commit the result.",
  );
  process.exit(1);
}

console.log(
  "packages/skills/src/custom-with-tokens/examples/stepper.md is up to date.",
);
