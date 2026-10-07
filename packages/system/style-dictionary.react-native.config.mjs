import fs from "node:fs";

import StyleDictionary from "style-dictionary";

/**
 * Style Dictionary config for the React Native token target.
 *
 * Input is the context-matrix source written by
 * `scripts/pipeline/prepare-react-native-output.mjs`. This config owns the
 * value conversions (CSS-authored DTCG values → React Native style values)
 * and the two emitted files: an ESM module (SD's built-in `javascript/esm`,
 * values only) and a precise `.d.ts` beside it.
 */

const sourceFile = process.env.TOKENS_RN_SOURCE_FILE;
const outJsFile = process.env.TOKENS_RN_JS_OUT;
const outDtsFile = process.env.TOKENS_RN_DTS_OUT;

if (!sourceFile) throw new Error("Missing TOKENS_RN_SOURCE_FILE env var.");
if (!outJsFile) throw new Error("Missing TOKENS_RN_JS_OUT env var.");
if (!outDtsFile) throw new Error("Missing TOKENS_RN_DTS_OUT env var.");
if (!fs.existsSync(sourceFile)) {
  throw new Error(`Missing React Native source input file: ${sourceFile}`);
}

// -----------------------------------------------------------------------------
// Value conversion.
//
// Authored values are CSS-shaped (px strings, ms strings, DTCG color
// objects, composite shadow/typography objects). React Native wants
// unitless numbers (density-independent points), color strings, and
// platform-shaped style objects. Every conversion is total or throws: a
// value this target cannot express is a build error, not a silent string.
// -----------------------------------------------------------------------------

const round = (n) => Math.round(n * 10000) / 10000;

/**
 * @param {unknown} value
 * @param {string} what
 * @returns {number}
 */
function toNumber(value, what) {
  const n = typeof value === "number" ? value : Number(value);

  if (!Number.isFinite(n)) {
    throw new Error(
      `react-native: ${what} is not numeric: ${JSON.stringify(value)}`,
    );
  }

  return n;
}

/**
 * CSS px dimension → unitless points. Only `px` is accepted; the authoring
 * convention is px with rem conversion left to the CSS target.
 *
 * @param {unknown} value
 * @returns {number}
 */
function dimension(value) {
  if (typeof value === "number") return value;
  if (value && typeof value === "object" && "value" in value) {
    const unit = value.unit ?? "px";

    if (unit !== "px") {
      throw new Error(`react-native: unsupported dimension unit "${unit}".`);
    }

    return toNumber(value.value, "dimension");
  }
  if (typeof value === "string") {
    const match = value.trim().match(/^(-?\d*\.?\d+)(px)?$/);

    if (!match) {
      throw new Error(`react-native: unsupported dimension "${value}".`);
    }

    return toNumber(match[1], "dimension");
  }

  throw new Error(
    `react-native: unsupported dimension ${JSON.stringify(value)}.`,
  );
}

/**
 * CSS duration → milliseconds.
 *
 * @param {unknown} value
 * @returns {number}
 */
function duration(value) {
  if (typeof value === "number") return value;
  if (value && typeof value === "object" && "value" in value) {
    const n = toNumber(value.value, "duration");

    return value.unit === "s" ? n * 1000 : n;
  }
  if (typeof value === "string") {
    const match = value.trim().match(/^(-?\d*\.?\d+)(ms|s)$/);

    if (!match)
      throw new Error(`react-native: unsupported duration "${value}".`);

    const n = toNumber(match[1], "duration");

    return match[2] === "s" ? n * 1000 : n;
  }

  throw new Error(
    `react-native: unsupported duration ${JSON.stringify(value)}.`,
  );
}

/**
 * @param {number} channel 0–1
 * @returns {string}
 */
function hexChannel(channel) {
  return Math.round(Math.min(1, Math.max(0, channel)) * 255)
    .toString(16)
    .padStart(2, "0");
}

/**
 * DTCG color object → `{ hex, alpha }` in sRGB.
 *
 * @param {unknown} value
 * @returns {{ hex: string, alpha: number }}
 */
function colorParts(value) {
  if (typeof value === "string") {
    const match = value.trim().match(/^#([0-9a-f]{6})([0-9a-f]{2})?$/i);

    if (!match) throw new Error(`react-native: unsupported color "${value}".`);

    return {
      hex: `#${match[1].toLowerCase()}`,
      alpha: match[2] ? parseInt(match[2], 16) / 255 : 1,
    };
  }
  if (value && typeof value === "object") {
    const { colorSpace = "srgb", components, alpha = 1 } = value;

    if (colorSpace !== "srgb" || !Array.isArray(components)) {
      throw new Error(
        `react-native: only sRGB component colors are supported, got ${JSON.stringify(value)}.`,
      );
    }

    const [r, g, b] = components.map((c) => toNumber(c, "color component"));

    return {
      hex: `#${hexChannel(r)}${hexChannel(g)}${hexChannel(b)}`,
      alpha: toNumber(alpha, "color alpha"),
    };
  }

  throw new Error(`react-native: unsupported color ${JSON.stringify(value)}.`);
}

/**
 * DTCG color → React Native color string. Opaque colors become `#rrggbb`;
 * translucent ones `rgba()`, which RN parses natively.
 *
 * @param {unknown} value
 * @returns {string}
 */
function color(value) {
  const { hex, alpha } = colorParts(value);

  if (alpha >= 1) return hex;

  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  return `rgba(${r}, ${g}, ${b}, ${round(alpha)})`;
}

/**
 * Font-family stack → single family. React Native has no fallback stacks;
 * the first entry is the family the app is expected to load (via
 * `expo-font` or native linking).
 *
 * @param {unknown} value
 * @returns {string}
 */
function fontFamily(value) {
  if (Array.isArray(value) && typeof value[0] === "string") return value[0];
  if (typeof value === "string") return value;

  throw new Error(
    `react-native: unsupported fontFamily ${JSON.stringify(value)}.`,
  );
}

/**
 * @param {unknown} value
 * @returns {number}
 */
function fontWeight(value) {
  return toNumber(value, "fontWeight");
}

/**
 * DTCG shadow → React Native shadow props. iOS reads `shadow*`; Android
 * reads `elevation`. CSS blur radius is roughly twice the Gaussian sigma
 * iOS's `shadowRadius` uses, so blur is halved. `spread` has no RN
 * equivalent and is dropped. Only the first shadow of a layered value is
 * kept: RN draws a single shadow per view.
 *
 * @param {unknown} value
 * @returns {{
 *  shadowColor: string,
 *  shadowOffset: { width: number, height: number },
 *  shadowOpacity: number,
 *  shadowRadius: number,
 *  elevation: number
 * }}
 */
function shadow(value) {
  const first = Array.isArray(value) ? value[0] : value;

  if (!first || typeof first !== "object") {
    throw new Error(
      `react-native: unsupported shadow ${JSON.stringify(value)}.`,
    );
  }

  const { hex, alpha } = colorParts(first.color);
  const blur = dimension(first.blur ?? 0);

  return {
    shadowColor: hex,
    shadowOffset: {
      width: dimension(first.offsetX ?? 0),
      height: dimension(first.offsetY ?? 0),
    },
    shadowOpacity: round(alpha),
    shadowRadius: round(blur / 2),
    elevation: Math.max(1, Math.round(blur / 2)),
  };
}

/**
 * DTCG typography composite → React Native text style. `lineHeight` is
 * authored as a unitless ratio; RN takes absolute points, so it is
 * multiplied out against `fontSize`.
 *
 * @param {unknown} value
 * @returns {Record<string, number | string>}
 */
function typography(value) {
  if (!value || typeof value !== "object") {
    throw new Error(
      `react-native: unsupported typography ${JSON.stringify(value)}.`,
    );
  }

  const fontSize = dimension(value.fontSize);
  const out = {};

  if (value.fontFamily !== undefined)
    out.fontFamily = fontFamily(value.fontFamily);
  out.fontSize = fontSize;
  if (value.fontWeight !== undefined)
    out.fontWeight = fontWeight(value.fontWeight);
  if (value.letterSpacing !== undefined) {
    out.letterSpacing = dimension(value.letterSpacing);
  }
  if (value.lineHeight !== undefined) {
    out.lineHeight =
      typeof value.lineHeight === "number"
        ? round(fontSize * value.lineHeight)
        : dimension(value.lineHeight);
  }

  return out;
}

/**
 * @param {unknown} value
 * @returns {number[]}
 */
function cubicBezier(value) {
  if (!Array.isArray(value) || value.length !== 4) {
    throw new Error(
      `react-native: unsupported cubicBezier ${JSON.stringify(value)}.`,
    );
  }

  return value.map((n) => toNumber(n, "cubicBezier"));
}

const CONVERTERS = {
  color,
  cubicBezier,
  dimension,
  duration,
  fontFamily,
  fontWeight,
  number: (value) => toNumber(value, "number"),
  shadow,
  typography,
};

StyleDictionary.registerTransform({
  name: "value/set-react-native",
  type: "value",
  transitive: false,
  filter: () => true,
  transform: (token) => {
    const type = token.$type;
    const convert = CONVERTERS[type];

    if (!convert) {
      throw new Error(
        `react-native: no converter for $type "${type}" at ${token.path.join(".")}.`,
      );
    }

    return convert(token.$value);
  },
});

// -----------------------------------------------------------------------------
// Declarations format.
//
// SD's built-in `typescript/module-declarations` types every leaf as a loose
// `DesignToken`. Consumers want the real shape (`number`, `string`, the RN
// shadow object), so this walks the transformed tree and prints literal
// structural types with `$description` as JSDoc.
// -----------------------------------------------------------------------------

const IDENTIFIER = /^[A-Za-z_$][\w$]*$/;

const propertyKey = (key) => (IDENTIFIER.test(key) ? key : JSON.stringify(key));

/**
 * @param {unknown} value
 * @param {string} pad
 * @returns {string}
 */
function typeOfValue(value, pad) {
  if (Array.isArray(value)) {
    return `readonly [${value.map((v) => typeOfValue(v, pad)).join(", ")}]`;
  }
  if (value && typeof value === "object") {
    const inner = pad + "  ";
    const lines = Object.entries(value).map(
      ([k, v]) =>
        `${inner}readonly ${propertyKey(k)}: ${typeOfValue(v, inner)};`,
    );

    return `{\n${lines.join("\n")}\n${pad}}`;
  }

  return typeof value;
}

/**
 * @param {Record<string, unknown>} node
 * @param {string} pad
 * @returns {string}
 */
function typeOfTree(node, pad) {
  const inner = pad + "  ";
  const lines = [];

  for (const [key, child] of Object.entries(node)) {
    if (key.startsWith("$")) continue;
    if (!child || typeof child !== "object") continue;

    if (Object.hasOwn(child, "$value")) {
      if (typeof child.$description === "string" && child.$description) {
        lines.push(
          `${inner}/** ${child.$description.replace(/\*\//g, "* /")} */`,
        );
      }
      lines.push(
        `${inner}readonly ${propertyKey(key)}: ${typeOfValue(child.$value, inner)};`,
      );
      continue;
    }

    lines.push(
      `${inner}readonly ${propertyKey(key)}: ${typeOfTree(child, inner)};`,
    );
  }

  return `{\n${lines.join("\n")}\n${pad}}`;
}

StyleDictionary.registerFormat({
  name: "typescript/set-react-native-declarations",
  format: async ({ dictionary, file, options }) => {
    const header = await StyleDictionary.hooks.fileHeaders.default?.();
    const headerLines = Array.isArray(header)
      ? header
      : ["Do not edit directly, this file was auto-generated."];
    const comment = `/**\n${headerLines.map((l) => ` * ${l}`).join("\n")}\n */\n\n`;
    const moduleName = options?.moduleName ?? "tokens";

    void file;

    return `${comment}declare const ${moduleName}: ${typeOfTree(dictionary.tokens, "")};\n\nexport default ${moduleName};\n`;
  },
});

export default {
  usesDtcg: true,
  source: [sourceFile],
  platforms: {
    reactNative: {
      transforms: ["value/set-react-native"],
      buildPath: "",
      files: [
        {
          destination: outJsFile,
          format: "javascript/esm",
          options: { minify: true },
        },
        {
          destination: outDtsFile,
          format: "typescript/set-react-native-declarations",
        },
      ],
    },
  },
};
