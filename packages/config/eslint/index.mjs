import baselineJs from "eslint-plugin-baseline-js";
import simpleImportSort from "eslint-plugin-simple-import-sort";

import baseline from "../baseline/index.mjs";

const eslintConfig = [
  {
    files: ["**/*.{js,cjs,mjs,jsx,ts,cts,mts,tsx}"],
    plugins: {
      "baseline-js": baselineJs,
      "simple-import-sort": simpleImportSort,
    },
    rules: {
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
    },
  },
  // Baseline: JS builtins and Web APIs must be available at Set's Baseline
  // level, the same level the browserslist query targets. The JS preset
  // covers plain JavaScript; the TS preset adds type-aware member checks
  // when type information is present and degrades gracefully when it isn't.
  baselineJs.configs.recommended({ available: baseline }),
  baselineJs.configs["recommended-ts"]({ available: baseline }),
];

export default eslintConfig;
