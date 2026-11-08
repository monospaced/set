import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { expect, test } from "vitest";

import { NODE_MAJOR, PNPM_VERSION } from "../src/constants.mjs";

const root = (path) =>
  fileURLToPath(new URL(`../../../${path}`, import.meta.url));

test("the toolchain constants match the monorepo", () => {
  const nodeVersion = readFileSync(root(".node-version"), "utf8").trim();
  const { packageManager } = JSON.parse(
    readFileSync(root("package.json"), "utf8"),
  );

  expect(String(NODE_MAJOR)).toBe(nodeVersion);
  expect(`pnpm@${PNPM_VERSION}`).toBe(packageManager.split("+")[0]);
});
