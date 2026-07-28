export default {
  extends: ["@monospaced/set-config/stylelint"],
  ignoreFiles: [
    "**/build/**",
    "**/dist/**",
    "**/storybook-static/**",
    "packages/config/set.catalog.css",
  ],
};
