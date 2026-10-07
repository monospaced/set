import path from "node:path";

import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      fileName: (format) => (format === "es" ? "index.js" : "index.cjs"),
      formats: ["es", "cjs"],
    },
    rollupOptions: {
      external: [
        "react",
        "react/jsx-runtime",
        "react-native",
        "react-native-svg",
        /^@monospaced\/set-tokens(\/.*)?$/,
      ],
      output: {
        exports: "named",
      },
    },
    sourcemap: true,
    // Metro consumes the output; keep syntax modern but not bleeding edge.
    target: "es2022",
  },
});
