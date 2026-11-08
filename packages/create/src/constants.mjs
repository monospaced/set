/** Node major written to `engines` and `.node-version`. */
export const NODE_MAJOR = 26;

/** pnpm version written to `packageManager`; `engines` takes its major. */
export const PNPM_VERSION = "12.17.0";

/** One social-share card for every page, shared with the Set docs. */
export const OG_IMAGE =
  "https://res.cloudinary.com/monospaced/image/upload/v1789255512/2022-08-27_20.06.48--cyan--og--mid.png";

/** Installed live at generation time, so nothing in the template goes stale. */
export const RUNTIME_DEPENDENCIES = [
  "@monospaced/set-assets",
  "@monospaced/set-core",
];

export const DEV_DEPENDENCIES = [
  "@monospaced/set-config",
  "@monospaced/set-skills",
  "@monospaced/set-tokens",
  "husky",
  "lint-staged",
  "prettier",
  "vite",
  "vitest",
];

/**
 * Also devDependencies of the generated project, but installed at the range
 * @monospaced/set-config declares for each as a peer, rather than at latest,
 * so the preset and the tool it drives always agree.
 */
export const DEV_DEPENDENCIES_AT_CONFIG_RANGES = [
  "browserslist",
  "eslint",
  "lightningcss",
  "stylelint",
  "typescript",
];
