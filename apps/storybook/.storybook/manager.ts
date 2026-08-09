import { addons } from "storybook/manager-api";

import { darkTheme, lightTheme } from "./themes";

/* Mirrors SET_LIGHTSWITCH_STORAGE_KEY in @monospaced/set-core. Hardcoded
   because importing core source into the manager bundle would drag component
   code in with it; manager-head.html repeats the key for the same reason. */
const storageKey = "set-theme";

const storedTheme = (): "light" | "dark" | undefined => {
  try {
    const value = window.localStorage.getItem(storageKey);
    return value === "light" || value === "dark" ? value : undefined;
  } catch {
    return undefined;
  }
};

const systemTheme = (): "light" | "dark" =>
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";

const resolvedTheme = () => storedTheme() ?? systemTheme();

addons.setConfig({
  layoutCustomisations: {
    showToolbar: (state, defaultValue) => {
      if (!defaultValue && state.layout.navSize === 0) return true;
      return defaultValue;
    },
  },
  theme: resolvedTheme() === "dark" ? darkTheme : lightTheme,
});

/* Re-themes the chrome without a reload when the lightswitch preference
   changes: `storage` fires on writes from other same-origin documents (the
   docs site in another tab, or a lightswitch inside the preview iframe), and
   the media listener covers system flips while no override is stored. Also
   re-stamps `data-set-theme` on <html> so the pre-paint CSS in
   manager-head.html stays in agreement. */
addons.register("set/lightswitch-sync", (api) => {
  const apply = () => {
    const stored = storedTheme();
    if (stored) {
      document.documentElement.setAttribute("data-set-theme", stored);
    } else {
      document.documentElement.removeAttribute("data-set-theme");
    }
    api.setOptions({
      theme: resolvedTheme() === "dark" ? darkTheme : lightTheme,
    });
  };

  window.addEventListener("storage", (event) => {
    if (event.key === storageKey || event.key === null) apply();
  });
  window
    .matchMedia?.("(prefers-color-scheme: dark)")
    .addEventListener("change", apply);
});
