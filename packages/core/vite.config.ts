import path from "node:path";

import target from "@measured/set-config/browserslist/esbuild";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    target,
    lib: {
      cssFileName: "core",
      entry: path.resolve(__dirname, "src/index.ts"),
      fileName: (format) => (format === "es" ? "index.js" : "index.cjs"),
      formats: ["es", "cjs"],
    },
    rollupOptions: {
      output: {
        exports: "named",
      },
    },
    sourcemap: true,
  },
});
