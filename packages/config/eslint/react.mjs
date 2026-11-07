import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";

import appConfig from "./app.mjs";

// Set lints pass or fail; a warning is noise that gets ignored. Lift the
// plugin's recommended levels to errors, keeping anything it turns off.
const asErrors = (rules) =>
  Object.fromEntries(
    Object.entries(rules).map(([name, entry]) => {
      const [level, ...options] = Array.isArray(entry) ? entry : [entry];
      const isOff = level === "off" || level === 0;
      return [name, isOff ? entry : ["error", ...options]];
    }),
  );

const reactConfig = [
  ...appConfig,
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    plugins: { "react-hooks": reactHooks, "react-refresh": reactRefresh },
    rules: {
      ...asErrors(reactHooks.configs.recommended.rules),
      // A React Compiler concern, not an app correctness one.
      "react-hooks/incompatible-library": "off",
      "react-refresh/only-export-components": [
        "error",
        { allowCompoundComponents: true, allowConstantExport: true },
      ],
    },
  },
];

export default reactConfig;
