import path from "node:path";

import target from "@monospaced/set-config/browserslist/esbuild";
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
      // The icon registry is a runtime dependency shared with other
      // platforms; keep it out of core's bundle.
      external: ["@monospaced/set-icons"],
      output: {
        exports: "named",
      },
    },
    sourcemap: true,
  },
});
