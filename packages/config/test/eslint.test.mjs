import assert from "node:assert/strict";
import { test } from "node:test";

import { ESLint } from "eslint";

import eslintConfig from "../eslint/index.mjs";
import reactConfig from "../eslint/react.mjs";

/**
 * Resolves the config ESLint would apply to `filePath` under a preset. ESLint
 * validates the preset while resolving, so a malformed plugin or rule entry
 * throws here.
 *
 * @param {import("eslint").Linter.Config[]} config
 * @param {string} filePath
 */
function resolve(config, filePath) {
  const eslint = new ESLint({
    cwd: import.meta.dirname,
    overrideConfig: config,
    overrideConfigFile: true,
  });

  return eslint.calculateConfigForFile(filePath);
}

const severity = (config, rule) => config.rules[rule]?.[0];

// `globals` marks a readonly global `false`; absent or "off" means undeclared.
const declared = (config, name) => {
  const value = config.languageOptions.globals[name];

  return value !== undefined && value !== "off";
};

test("source files get browser globals and Set's rules", async () => {
  // Node-file globs are anchored to the root, so these are all browser code.
  for (const file of [
    "src/main.ts",
    "src/scripts/entry.ts",
    "src/theme.config.ts",
  ]) {
    const src = await resolve(eslintConfig, file);

    assert.equal(declared(src, "document"), true, file);
    assert.equal(declared(src, "process"), false, file);
    assert.equal(severity(src, "baseline-js/use-baseline"), 2, file);
    assert.equal(severity(src, "simple-import-sort/imports"), 2, file);
  }
});

test("Node-run files get Node globals and no Baseline rule", async () => {
  for (const file of ["vite.config.ts", "scripts/build.mjs"]) {
    const node = await resolve(eslintConfig, file);

    assert.equal(declared(node, "process"), true, file);
    assert.equal(declared(node, "document"), false, file);
    assert.equal(severity(node, "baseline-js/use-baseline"), 0, file);
  }
});

test("tsconfig and VS Code settings get the JSONC override", async () => {
  const jsonc = async (file) =>
    (await resolve(eslintConfig, file)).languageOptions.allowTrailingCommas;

  assert.equal(await jsonc("package.json"), undefined);
  assert.equal(await jsonc("tsconfig.json"), true);
  assert.equal(await jsonc(".vscode/settings.json"), true);
});

test("react adds the hooks and fast-refresh rules to components", async () => {
  const component = await resolve(reactConfig, "src/App.tsx");

  assert.equal(severity(component, "react-hooks/rules-of-hooks"), 2);
  assert.ok("react-refresh/only-export-components" in component.rules);
});
