import js from "@eslint/js";
import json from "@eslint/json";
import setEslint from "@monospaced/set-config/eslint";
import storybook from "eslint-plugin-storybook";
import globals from "globals";
import tseslint from "typescript-eslint";

const nodeGlobalsOff = Object.fromEntries(
  Object.keys(globals.node).map((name) => [name, "off"]),
);

export default [
  ...setEslint,
  {
    ignores: [
      "**/build/**",
      "**/dist/**",
      "**/storybook-static/**",
      "packages/system/schemas/**",
    ],
  },
  {
    // Baseline targets browsers. These files run under Node (build scripts,
    // codegen, the Eleventy docs build, tool configs), where the Node engine
    // range in package.json is the support contract instead.
    files: [
      "**/*.config.{js,mjs,ts}",
      "**/*.mjs",
      "**/scripts/**",
      "apps/documentation/src/**",
      "packages/adapter/**",
      "packages/system/**",
    ],
    rules: { "baseline-js/use-baseline": "off" },
  },
  {
    files: ["**/*.json"],
    ...json.configs.recommended,
    language: "json/json",
  },
  {
    files: ["**/*.mjs"],
    ...js.configs.recommended,
    languageOptions: { globals: { ...globals.node } },
  },
  ...tseslint.configs.recommended.map((config) => ({
    ...config,
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      ...(config.languageOptions ?? {}),
      globals: { ...globals.node },
    },
  })),
  {
    files: ["packages/core/src/**/*.ts", "packages/react/src/**/*.{ts,tsx}"],
    languageOptions: { globals: { ...nodeGlobalsOff, ...globals.browser } },
  },
  ...storybook.configs["flat/recommended"].map((config) => ({
    ...config,
    files: ["**/*.stories.ts"],
    languageOptions: { globals: { ...nodeGlobalsOff, ...globals.browser } },
  })),
];
