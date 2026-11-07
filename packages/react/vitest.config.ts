import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    // Node 25+ defines its own global localStorage, which vitest 4's jsdom
    // environment does not shadow (fixed in vitest 5). Disable Node's so
    // jsdom's Storage lands as usual.
    execArgv: ["--no-webstorage"],
    include: ["src/**/*.test.{ts,tsx}"],
    passWithNoTests: true,
    setupFiles: ["src/test/setup.ts"],
  },
});
