import assert from "node:assert/strict";
import { test } from "node:test";

import stylelint from "stylelint";

import stylelintConfig from "../stylelint/index.mjs";

/**
 * Lints one declaration inside a Set-scoped rule and returns the rules that
 * reported it. Stylelint validates the preset while linting, so a malformed
 * plugin or rule entry throws here.
 *
 * @param {string} declaration
 */
async function violations(declaration) {
  const { results } = await stylelint.lint({
    code: `:where(.set) .app-thing {\n  ${declaration}\n}\n`,
    codeFilename: "src/thing.css",
    config: stylelintConfig,
  });

  return results.flatMap((result) =>
    result.warnings.map((warning) => warning.rule),
  );
}

const passes = async (declaration) =>
  assert.deepEqual(await violations(declaration), [], declaration);

const fails = async (declaration, rule) =>
  assert.ok(
    (await violations(declaration)).includes(rule),
    `${declaration} should fail ${rule}`,
  );

test("time units are allowed, alongside the duration tokens", async () => {
  await passes("transition-duration: 200ms;");
  await passes("animation-duration: 1.5s;");
  await passes("transition-duration: var(--set-motion-duration-200);");
});

test("easing keywords are allowed, alongside the easing tokens", async () => {
  await passes("transition-timing-function: linear;");
  await passes("animation-timing-function: step-end;");
  await passes(
    "transition-timing-function: var(--set-motion-easing-ease-out);",
  );
  await passes("transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);");
  await fails("line-height: 1.5;", "scale-unlimited/declaration-strict-value");
});

test("font-weight takes a number or a token, never a keyword", async () => {
  await passes("font-weight: 650;");
  await passes("font-weight: var(--set-typography-font-weight-bold);");
  await fails("font-weight: bold;", "font-weight-notation");
  await fails("font-weight: normal;", "font-weight-notation");
});

test("letter-spacing is banned", async () => {
  await fails("letter-spacing: 0.1em;", "property-disallowed-list");
  await fails("letter-spacing: normal;", "property-disallowed-list");
});

test("absolute lengths and raw colours still fail", async () => {
  await fails("padding-block: 16px;", "unit-disallowed-list");
  await fails("color: #fff;", "color-no-hex");
});
