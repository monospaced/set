import assert from "node:assert/strict";
import { test } from "node:test";

import { ESLint } from "eslint";

import appConfig from "../eslint/app.mjs";
import reactConfig from "../eslint/react.mjs";

/**
 * Lints a source string as if it lived at `filePath` under the test
 * directory, returning the reported rule ids with their severities.
 *
 * @param {import("eslint").Linter.Config[]} config
 * @param {string} filePath
 * @param {string} code
 */
async function lint(config, filePath, code) {
  const eslint = new ESLint({
    cwd: import.meta.dirname,
    overrideConfig: config,
    overrideConfigFile: true,
  });
  const [result] = await eslint.lintText(code, { filePath });

  return result.messages.map(({ ruleId, severity, message }) => ({
    message,
    ruleId,
    severity,
  }));
}

const ruleIds = (messages) => messages.map(({ ruleId }) => ruleId);

test("app: browser TypeScript with sorted imports is clean", async () => {
  const messages = await lint(
    appConfig,
    "src/main.ts",
    `import { a } from "a";\nimport { b } from "b";\n\ndocument.body.append(a(), b());\n`,
  );

  assert.deepEqual(messages, []);
});

test("app: enforces Set's import sort", async () => {
  const messages = await lint(
    appConfig,
    "src/main.ts",
    `import { b } from "b";\nimport { a } from "a";\n\nexport const ab = [a, b];\n`,
  );

  assert.deepEqual(ruleIds(messages), ["simple-import-sort/imports"]);
});

test("app: browser globals in src, Node globals in scripts", async () => {
  const inSrc = await lint(appConfig, "src/main.mjs", "process.exit(0);\n");
  const inScripts = await lint(
    appConfig,
    "scripts/build.mjs",
    "process.exit(0);\ndocument.title;\n",
  );

  assert.deepEqual(ruleIds(inSrc), ["no-undef"]);
  assert.deepEqual(ruleIds(inScripts), ["no-undef"]);
  assert.match(inScripts[0].message, /'document'/);
});

test("app: Baseline applies to src and not to tool configs", async () => {
  const code =
    "const ready = await Promise.resolve(true);\nexport { ready };\n";
  const inSrc = await lint(appConfig, "src/main.ts", code);
  const inConfig = await lint(appConfig, "vite.config.ts", code);

  assert.deepEqual(ruleIds(inSrc), ["baseline-js/use-baseline"]);
  assert.equal(inSrc[0].severity, 2);
  assert.deepEqual(inConfig, []);
});

test("app: lints JSON, and allows comments in tsconfig", async () => {
  const duplicate = await lint(
    appConfig,
    "package.json",
    '{ "name": "a", "name": "b" }\n',
  );
  const tsconfig = await lint(
    appConfig,
    "tsconfig.json",
    '{\n  // Comments are fine here.\n  "compilerOptions": { "strict": true },\n}\n',
  );

  assert.deepEqual(ruleIds(duplicate), ["json/no-duplicate-keys"]);
  assert.deepEqual(tsconfig, []);
});

test("react: hooks rules report as errors", async () => {
  const messages = await lint(
    reactConfig,
    "src/App.tsx",
    `import { useEffect } from "react";\n\nexport function App({ id }: { id: string }) {\n  useEffect(() => {\n    document.title = id;\n  }, []);\n\n  return <h1>{id}</h1>;\n}\n`,
  );

  assert.deepEqual(ruleIds(messages), ["react-hooks/exhaustive-deps"]);
  assert.equal(messages[0].severity, 2);
});

test("react: component files only export components", async () => {
  const messages = await lint(
    reactConfig,
    "src/App.tsx",
    `export const helper = () => 1;\n\nexport function App() {\n  return <h1>{helper()}</h1>;\n}\n`,
  );

  assert.deepEqual(ruleIds(messages), ["react-refresh/only-export-components"]);
});

test("react: a clean component is clean", async () => {
  const messages = await lint(
    reactConfig,
    "src/App.tsx",
    `export const LIMIT = 3;\n\nexport function App() {\n  return <h1>{LIMIT}</h1>;\n}\n`,
  );

  assert.deepEqual(messages, []);
});
