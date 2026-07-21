import path from "node:path";

import target from "@measured/set-config/browserslist/esbuild";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    target,
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      fileName: (format) => (format === "es" ? "index.js" : "index.cjs"),
      formats: ["es", "cjs"],
    },
    rollupOptions: {
      external: [
        "react",
        "react/jsx-runtime",
        "react-dom",
        "@measured/set-core",
      ],
      output: {
        exports: "named",
      },
    },
    sourcemap: true,
  },
});
