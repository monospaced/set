import { addons } from "storybook/manager-api";

import { darkTheme, lightTheme } from "./themes";

const prefersDark =
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-color-scheme: dark)").matches;

addons.setConfig({
  layoutCustomisations: {
    showToolbar: (state, defaultValue) => {
      if (!defaultValue && state.layout.navSize === 0) return true;
      return defaultValue;
    },
  },
  theme: prefersDark ? darkTheme : lightTheme,
});
