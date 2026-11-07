import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";

import appConfig from "./app.mjs";

const hooks = reactHooks.configs.flat.recommended;
const refresh = reactRefresh.configs.vite;

const reactConfig = [
  ...appConfig,
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    plugins: { ...hooks.plugins, ...refresh.plugins },
    rules: { ...hooks.rules, ...refresh.rules },
  },
];

export default reactConfig;
