import { createRequire } from "node:module";

import baseline from "../baseline/index.mjs";
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
  "Set values come from tokens — see @monospaced/set-config/set.catalog.css.";

// Time units stay: durations come from tokens, and graphics in loose and
// free mode may step on any timing.
const UNITS_DISALLOWED = ["cm", "in", "mm", "pc", "pt", "px", "Q"];

// What the strict-value properties may take besides a token or a function.
const STRICT_VALUE_KEYWORDS = [
  "/^[\\d.]+%$/",
  "0",
  "1",
  "inherit",
  "initial",
  "none",
  "revert",
  "unset",
];

// The CSS easing keywords, allowed alongside the easing tokens.
const EASING_KEYWORDS = [
  "ease",
  "ease-in",
  "ease-in-out",
  "ease-out",
  "linear",
  "step-end",
  "step-start",
];

const stylelintConfig = {
  extends: [
    require.resolve("stylelint-config-standard"),
    require.resolve("stylelint-plugin-logical-css/configs/recommended"),
  ],
  plugins: [
    require.resolve("stylelint-declaration-strict-value"),
    require.resolve("stylelint-order"),
    require.resolve("stylelint-plugin-use-baseline"),
    setTokensPlugin,
  ],
  // A disable that suppresses nothing fails, so a Baseline justification is
  // removed the moment the data makes it unnecessary.
  reportNeedlessDisables: true,
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
    // Any value is a number: a weight token resolves to one, and free mode
    // can set any weight on the font's axis. Keywords never.
    "font-weight-notation": [
      "numeric",
      { message: "Use a numeric font-weight: a token, or a number." },
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
    // Baseline: CSS features available at Set's Baseline level. The ignores
    // are progressive enhancements that degrade gracefully; prune each once
    // it reaches Widely available.
    "plugin/use-baseline": [
      true,
      {
        available: baseline,
        ignoreProperties: {
          "accent-color": ["/^.+$/"],
          "forced-color-adjust": ["/^.+$/"],
          "/^overscroll-behavior/": ["/^.+$/"],
          resize: ["/^.+$/"],
          "text-wrap": ["balance", "pretty"],
        },
        ignoreSelectors: ["marker", "selection"],
      },
    ],
    "property-disallowed-list": [
      ["letter-spacing"],
      {
        message:
          "letter-spacing is disallowed. Tracking breaks the character grid, and Set already fits the type.",
      },
    ],
    "scale-unlimited/declaration-strict-value": [
      [
        "/^border.*radius$/",
        "/^border.*width$/",
        "animation-timing-function",
        "box-shadow",
        "font",
        "line-height",
        "opacity",
        "transition-timing-function",
      ],
      {
        // A property's own list replaces the catch-all, so the timing
        // functions restate it.
        ignoreValues: {
          "": STRICT_VALUE_KEYWORDS,
          "animation-timing-function": [
            ...STRICT_VALUE_KEYWORDS,
            ...EASING_KEYWORDS,
          ],
          "transition-timing-function": [
            ...STRICT_VALUE_KEYWORDS,
            ...EASING_KEYWORDS,
          ],
        },
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
