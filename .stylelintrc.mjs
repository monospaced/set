export default {
  extends: ["@measured/set-config/stylelint"],
  ignoreFiles: [
    "**/build/**",
    "**/dist/**",
    "**/storybook-static/**",
    "packages/config/set.catalog.css",
  ],
};
