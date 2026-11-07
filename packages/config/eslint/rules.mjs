import baselineJs from "eslint-plugin-baseline-js";
import simpleImportSort from "eslint-plugin-simple-import-sort";

import baseline from "../baseline/index.mjs";

const rulesConfig = [
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
  // Baseline: JS builtins and Web APIs available at Set's Baseline level.
  baselineJs.configs.recommended({ available: baseline }),
  baselineJs.configs["recommended-ts"]({ available: baseline }),
];

export default rulesConfig;
