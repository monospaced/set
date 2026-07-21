import { createRequire } from "node:module";

import setTokensPlugin from "./plugin-set-tokens.mjs";

// Stylelint resolves `extends`/`plugins` strings from the consumer's config
// directory, not from the package that declared them. Resolve to absolute
// paths here so consumers don't need to install our internals themselves.
const require = createRequire(import.meta.url);

const COLOR_FUNCTIONS_DISALLOWED = [
  "color-mix",
  "color",
  "hsl",
  "hsla",
  "hwb",
  "lab",
  "lch",
  "oklab",
  "oklch",
  "rgb",
  "rgba",
];

const TOKENS_HINT =
  "Set values come from tokens — see @measured/set-config/set.catalog.css.";

const UNITS_DISALLOWED = ["cm", "in", "mm", "ms", "pc", "pt", "px", "Q", "s"];

const stylelintConfig = {
  extends: [
    require.resolve("stylelint-config-standard"),
    require.resolve("stylelint-plugin-logical-css/configs/recommended"),
  ],
  plugins: [
    require.resolve("stylelint-declaration-strict-value"),
    require.resolve("stylelint-order"),
    setTokensPlugin,
  ],
  rules: {
    "set/set-known-tokens": true,
    "color-named": [
      "never",
      { message: `Named colours are disallowed. ${TOKENS_HINT}` },
    ],
    "color-no-hex": [
      true,
      { message: `Hex colours are disallowed. ${TOKENS_HINT}` },
    ],
    "declaration-no-important": true,
    "declaration-property-unit-disallowed-list": [
      {
        "/^border(-(block|inline)(-(start|end))?)?$/": ["rem"],
        "/^gap$/": ["rem"],
        "/^inset/": ["rem"],
        "/^margin/": ["rem"],
        "/^padding/": ["rem"],
        "column-gap": ["rem"],
        "font-size": ["rem"],
        "outline-offset": ["rem"],
        "outline-width": ["rem"],
        "row-gap": ["rem"],
      },
      { message: `Property "%s" cannot use unit "%s". ${TOKENS_HINT}` },
    ],
    "function-disallowed-list": [
      COLOR_FUNCTIONS_DISALLOWED,
      { message: `Function "%s()" is disallowed. ${TOKENS_HINT}` },
    ],
    "logical-css/require-logical-keywords": [
      true,
      {
        ignore: ["caption-side", "offset-anchor", "offset-position", "resize"],
        severity: "error",
      },
    ],
    "no-descending-specificity": null,
    "order/properties-alphabetical-order": true,
    "scale-unlimited/declaration-strict-value": [
      [
        "/^border.*radius$/",
        "/^border.*width$/",
        "animation-timing-function",
        "box-shadow",
        "font-weight",
        "font",
        "line-height",
        "opacity",
        "transition-timing-function",
      ],
      {
        ignoreValues: [
          "/^[\\d.]+%$/",
          "0",
          "1",
          "inherit",
          "initial",
          "none",
          "revert",
          "unset",
        ],
        message: `Value for "\${property}" must be a token, calc(), %, 0, 1, or keyword. ${TOKENS_HINT}`,
      },
    ],
    "unit-disallowed-list": [
      UNITS_DISALLOWED,
      { message: `Unit "%s" is disallowed. ${TOKENS_HINT}` },
    ],
  },
};

export default stylelintConfig;
