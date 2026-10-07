import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

import { defineConfig } from "vitest/config";

const require = createRequire(import.meta.url);

// Components are exercised through react-native-web in jsdom. This is a
// web rendering of React Native primitives, so tests assert on behaviour
// and accessibility semantics rather than pixel output. react-native-svg
// ships a web backend beside its native entry; its one React Native
// internal import is stubbed.
const alias = [
  { find: /^react-native$/, replacement: "react-native-web" },
  {
    find: /^react-native-svg$/,
    replacement:
      require.resolve("react-native-svg/lib/module/ReactNativeSVG.web.js"),
  },
  {
    find: /^@react-native\/assets-registry\/registry$/,
    replacement: fileURLToPath(
      new URL("./src/test/assets-registry.ts", import.meta.url),
    ),
  },
];

export default defineConfig({
  resolve: {
    alias,
    // React Native libraries ship platform-suffixed modules; Metro and
    // react-native-web's bundler config pick `.web.js` first.
    extensions: [
      ".web.tsx",
      ".web.ts",
      ".web.mjs",
      ".web.js",
      ".mjs",
      ".js",
      ".mts",
      ".ts",
      ".jsx",
      ".tsx",
      ".json",
    ],
  },
  test: {
    alias,
    environment: "jsdom",
    include: ["src/**/*.test.{ts,tsx}"],
    passWithNoTests: true,
    server: {
      // Externalised deps resolve through Node, bypassing the alias and
      // extension rules above; inline the svg package so vite resolves it.
      deps: { inline: ["react-native-svg"] },
    },
    setupFiles: ["src/test/setup.ts"],
  },
});
