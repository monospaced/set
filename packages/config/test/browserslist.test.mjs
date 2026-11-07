import assert from "node:assert/strict";
import { test } from "node:test";

import lightningcssTargets from "../browserslist/lightningcss.mjs";

test("lightningcss targets cover the core browsers", () => {
  for (const browser of ["chrome", "edge", "firefox", "safari", "ios_saf"]) {
    assert.equal(typeof lightningcssTargets[browser], "number", browser);
  }
});
