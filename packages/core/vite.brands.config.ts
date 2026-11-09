import target from "@monospaced/set-config/browserslist/esbuild";
import { defineConfig, type Plugin } from "vite";

// Vite emits an empty script beside each CSS entry; keep only the stylesheets.
const cssOnly: Plugin = {
  name: "css-only",
  generateBundle(_options, bundle) {
    for (const [name, item] of Object.entries(bundle)) {
      if (item.type === "chunk") delete bundle[name];
    }
  },
};

// The per-brand stylesheets. The library build above writes core.css with
// both brands; this one adds core-mnsp.css and core-wrfr.css beside it.
export default defineConfig({
  build: {
    emptyOutDir: false,
    rollupOptions: {
      input: {
        "core-mnsp": "src/styles.mnsp.css",
        "core-wrfr": "src/styles.wrfr.css",
      },
      output: { assetFileNames: "[name][extname]" },
    },
    target,
  },
  plugins: [cssOnly],
});
