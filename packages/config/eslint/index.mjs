import js from "@eslint/js";
import json from "@eslint/json";
import globals from "globals";
import tseslint from "typescript-eslint";

import setRules from "./rules.mjs";

// Files that run under Node rather than in the browser: root-level tool
// configs and the scripts directory. Anchored to the root so that shipped
// code such as src/scripts/ or src/theme.config.ts stays browser code.
const NODE_FILES = ["*.config.{js,cjs,mjs,ts,cts,mts}", "scripts/**"];

const off = (names) => Object.fromEntries(names.map((name) => [name, "off"]));

const eslintConfig = [
  {
    ignores: ["**/build/**", "**/coverage/**", "**/dist/**"],
  },
  ...setRules,
  {
    files: ["**/*.json"],
    ...json.configs.recommended,
    language: "json/json",
  },
  {
    // Editor and TypeScript config files allow comments and trailing commas.
    files: ["**/.vscode/*.json", "**/tsconfig*.json"],
    ...json.configs.recommended,
    language: "json/jsonc",
    languageOptions: { allowTrailingCommas: true },
  },
  {
    files: ["**/*.{js,cjs,mjs,jsx}"],
    ...js.configs.recommended,
    languageOptions: { globals: { ...globals.browser } },
  },
  ...tseslint.configs.recommended.map((config) => ({
    ...config,
    files: ["**/*.{ts,cts,mts,tsx}"],
    languageOptions: {
      ...(config.languageOptions ?? {}),
      globals: { ...globals.browser },
    },
  })),
  {
    files: NODE_FILES,
    languageOptions: {
      globals: { ...off(Object.keys(globals.browser)), ...globals.node },
    },
    rules: { "baseline-js/use-baseline": "off" },
  },
];

export default eslintConfig;
