import assert from "node:assert/strict";
import { test } from "node:test";

import baseline from "../baseline/index.mjs";
import esbuildTarget from "../browserslist/esbuild.mjs";
import browserslist from "../browserslist/index.mjs";
import lightningcssTargets from "../browserslist/lightningcss.mjs";

test("every target derives from the one Baseline constant", () => {
  assert.deepEqual(browserslist, [`baseline ${baseline} available`]);
  assert.equal(esbuildTarget, `baseline-${baseline}-available`);
});

test("lightningcss targets cover the core browsers", () => {
  for (const browser of ["chrome", "edge", "firefox", "safari", "ios_saf"]) {
    assert.equal(typeof lightningcssTargets[browser], "number", browser);
  }
});
