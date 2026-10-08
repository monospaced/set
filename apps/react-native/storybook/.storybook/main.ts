import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

import type { StorybookConfig } from "@storybook/react-native-web-vite";

/**
 * Stories import components from the package source; the preview imports
 * the provider by package name. Point the name at the same source so both
 * share one module graph (and one React context), and so the Storybook
 * does not depend on a prior package build.
 */
const PACKAGE_SOURCE = fileURLToPath(
  new URL("../../../../packages/react-native/src/index.ts", import.meta.url),
);
const require = createRequire(import.meta.url);

/**
 * react-native-svg ships a web backend beside its native entry. Resolve it
 * from this app so the alias is an absolute path and never depends on where
 * the importing file sits.
 */
const SVG_WEB_ENTRY =
  require.resolve("react-native-svg/lib/module/ReactNativeSVG.web.js");
const ASSETS_REGISTRY_STUB = fileURLToPath(
  new URL(
    "../../../../packages/react-native/src/test/assets-registry.ts",
    import.meta.url,
  ),
);

/**
 * Storybook for `@monospaced/set-react-native`, rendered in the browser
 * through react-native-web. A faithful but not pixel-exact stand-in for a
 * device: fonts, shadows and text metrics differ at the margins, so treat
 * it as the component workbench and check on a device before judging
 * visual detail.
 */
const config: StorybookConfig = {
  addons: ["@storybook/addon-a11y", "@storybook/addon-docs"],
  features: {
    outline: false,
  },
  framework: "@storybook/react-native-web-vite",
  staticDirs: [{ from: "../../../../packages/assets/src", to: "/set-assets" }],
  stories: [
    "../stories/**/*.mdx",
    "../../../../packages/react-native/src/**/*.stories.tsx",
  ],
  viteFinal: async (viteConfig, { configType }) => {
    if (configType === "PRODUCTION") {
      viteConfig.base = "/storybook/react-native/";
    }

    const existing = viteConfig.resolve?.alias ?? [];
    const aliases = Array.isArray(existing)
      ? existing
      : Object.entries(existing).map(([find, replacement]) => ({
          find,
          replacement,
        }));

    viteConfig.resolve = {
      ...viteConfig.resolve,
      alias: [
        ...aliases,
        {
          find: /^@monospaced\/set-react-native$/,
          replacement: PACKAGE_SOURCE,
        },
        // Point react-native-svg at its web backend, and stub the one React
        // Native internal (Flow-typed) it imports.
        { find: /^react-native-svg$/, replacement: SVG_WEB_ENTRY },
        {
          find: /^@react-native\/assets-registry\/registry$/,
          replacement: ASSETS_REGISTRY_STUB,
        },
      ],
    };

    return viteConfig;
  },
};

export default config;
