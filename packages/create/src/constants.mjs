/** One social-share card for every page, shared with the Set docs. */
export const OG_IMAGE =
  "https://res.cloudinary.com/monospaced/image/upload/v1789307953/2018-04-20_15.28.26--cyan--og--mid.png";

/** How pages are authored. The first is the default. */
export const VARIANTS = ["html", "prerender", "react"];

/** Set brands. The first is the default. */
export const BRANDS = ["mnsp", "wrfr"];

/** Installed live at generation time, so nothing in the template goes stale. */
export const RUNTIME_DEPENDENCIES = [
  "@monospaced/set-assets",
  "@monospaced/set-core",
];

/** The React variant's extra Set package. */
export const REACT_RUNTIME_DEPENDENCIES = ["@monospaced/set-react"];

/**
 * Set's own dev packages, at latest like the runtime ones. The rest of the
 * tooling installs at the monorepo's ranges, from `toolchain.mjs`.
 */
export const SET_DEV_DEPENDENCIES = [
  "@monospaced/set-config",
  "@monospaced/set-skills",
  "@monospaced/set-tokens",
];
