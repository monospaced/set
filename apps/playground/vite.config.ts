import target from "@monospaced/set-config/browserslist/esbuild";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  build: { target },
  plugins: [react()],
  server: { port: 5173 },
});
