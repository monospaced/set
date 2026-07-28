import fs from "node:fs";

import StyleDictionary from "style-dictionary";

const contextsFile = process.env.TOKENS_CONTEXTS_FILE;
const manifestFile = process.env.TOKENS_MANIFEST_FILE;
const outPrivateFile = process.env.TOKENS_CSS_PRIVATE_OUT;
const outPublicFile = process.env.TOKENS_CSS_OUT;

if (!contextsFile) {
  throw new Error("Missing TOKENS_CONTEXTS_FILE env var.");
}
if (!manifestFile) {
  throw new Error("Missing TOKENS_MANIFEST_FILE env var.");
}
if (!outPrivateFile) {
  throw new Error("Missing TOKENS_CSS_PRIVATE_OUT env var.");
}
if (!outPublicFile) {
  throw new Error("Missing TOKENS_CSS_OUT env var.");
}
if (!fs.existsSync(contextsFile)) {
  throw new Error(`Missing contexts token input file: ${contextsFile}`);
}
if (!fs.existsSync(manifestFile)) {
  throw new Error(`Missing manifest input file: ${manifestFile}`);
}

const getBridgeMeta = (token) => {
  const meta =
    token?.original?.$extensions?.["co.monospaced.set.bridge"] ??
    token?.$extensions?.["co.monospaced.set.bridge"] ??
    null;

  if (
    !meta ||
    typeof meta.contextId !== "string" ||
    typeof meta.role !== "string" ||
    !Array.isArray(meta.path)
  ) {
    return null;
  }

  return meta;
};

StyleDictionary.registerFilter({
  name: "set/role-public",
  filter: (token) => getBridgeMeta(token)?.role === "public",
});

StyleDictionary.registerFilter({
  name: "set/role-private",
  filter: (token) => getBridgeMeta(token)?.role === "private",
});

const manifest = JSON.parse(fs.readFileSync(manifestFile, "utf8"));
const cssLayer = manifest?.targets?.css?.layer;
const cssLayerOrder = Array.isArray(manifest?.targets?.css?.layerOrder)
  ? manifest.targets.css.layerOrder
  : [];
const cssTransformGroup = Array.isArray(
  StyleDictionary.hooks?.transformGroups?.css,
)
  ? StyleDictionary.hooks.transformGroups.css
  : [];

const toKebab = (segment) =>
  String(segment)
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/([A-Z]+)([A-Z][a-z0-9]+)/g, "$1-$2")
    .replace(/[^A-Za-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();

const namespacePrefix =
  typeof manifest?.namespace === "string" && manifest.namespace.length > 0
    ? toKebab(manifest.namespace)
    : "";

const cssVarNameFromBridgePath = (pathSegments) => {
  const core = pathSegments.map(toKebab).join("-");
  return namespacePrefix ? `--${namespacePrefix}-${core}` : `--${core}`;
};

StyleDictionary.registerTransform({
  name: "name/set-bridge-css-var",
  type: "name",
  transform: (token) => {
    const bridgeMeta = getBridgeMeta(token);
    if (!bridgeMeta) return token.name;
    return cssVarNameFromBridgePath(bridgeMeta.path);
  },
});

StyleDictionary.registerTransformGroup({
  name: "css-set",
  transforms: [
    ...cssTransformGroup.filter(
      (transformName) => !String(transformName).startsWith("name/"),
    ),
    "name/set-bridge-css-var",
  ],
});

const indent = (text, spaces = 2) => {
  const pad = " ".repeat(spaces);

  return text
    .split("\n")
    .map((line) => (line.length ? `${pad}${line}` : line))
    .join("\n");
};

const normalizeNumber = (value) => {
  const rounded = Math.round(value * 1000000) / 1000000;

  return Number.isInteger(rounded)
    ? String(rounded)
    : String(rounded).replace(/\.?0+$/, "");
};

const pxToUnit = (raw, unit) =>
  raw.replace(
    /(-?\d*\.?\d+)px\b/g,
    (_, n) => `${normalizeNumber(Number(n) / 16)}${unit}`,
  );

const formatTokenValueForCss = (token) => {
  const value = token.value ?? token.$value;

  if (value === undefined || value === null) return value;

  const forcedUnit =
    token.original?.$extensions?.["co.monospaced.set.css"]?.unit;

  if (
    typeof value === "number" &&
    typeof forcedUnit === "string" &&
    forcedUnit.length > 0
  ) {
    return `${normalizeNumber(value)}${forcedUnit}`;
  }
  if (typeof value === "string") {
    return pxToUnit(value, "rem");
  }

  return value;
};

const formatMediaConditionForCss = (condition) => {
  if (typeof condition !== "string") return condition;

  return pxToUnit(condition, "em");
};

const wrapMedia = (block, mediaConditions = []) => {
  let out = block;

  for (let i = mediaConditions.length - 1; i >= 0; i -= 1) {
    const cond = formatMediaConditionForCss(mediaConditions[i]);

    out = `@media ${cond} {\n${indent(out, 2)}\n}`;
  }

  return out;
};

StyleDictionary.registerFormat({
  name: "css/set-contexts",
  format: ({ dictionary }) => {
    const byContext = new Map();

    for (const token of dictionary.allTokens) {
      const bridgeMeta = getBridgeMeta(token);

      if (!bridgeMeta) continue;

      const ctxId = bridgeMeta.contextId;
      const varPath = token.name;
      const description = token.original?.$description;
      const value = formatTokenValueForCss(token);

      if (value === undefined) continue;

      const comment =
        typeof description === "string" && description.length > 0
          ? ` /** ${description} */`
          : "";
      const declaration = `${token.name}: ${value};${comment}`;

      if (!byContext.has(ctxId)) byContext.set(ctxId, []);

      byContext.get(ctxId).push({ key: varPath, declaration });
    }

    const blocks = [];

    for (const block of manifest.blocks || []) {
      const items = byContext.get(block.id) || [];

      if (items.length === 0) continue;

      items.sort((a, b) => a.key.localeCompare(b.key));

      const declarations = items.map((item) => item.declaration).join("\n");
      const wrapped = `${block.selector} {\n${indent(declarations, 2)}\n}`;
      const withMedia = wrapMedia(
        wrapped,
        Array.isArray(block.media) ? block.media : [],
      );

      blocks.push(`/* ${block.comment} */\n${withMedia}`);
    }

    const sourceLine = manifest.source
      ? ` * Source: ${manifest.source} + context manifest.\n`
      : "";
    const content = blocks.join("\n\n");
    const layerOrderDecl =
      cssLayerOrder.length > 0 ? `@layer ${cssLayerOrder.join(", ")};\n\n` : "";
    const layeredContent =
      typeof cssLayer === "string" && cssLayer.length > 0
        ? `@layer ${cssLayer} {\n${indent(content, 2)}\n}\n`
        : `${content}\n`;

    return `/**\n * Do not edit directly, this file was auto-generated.\n${sourceLine} */\n\n${layerOrderDecl}${layeredContent}`;
  },
});

export default {
  source: [contextsFile],
  platforms: {
    cssPublic: {
      transformGroup: "css-set",
      buildPath: "",
      files: [
        {
          destination: outPublicFile,
          format: "css/set-contexts",
          filter: "set/role-public",
        },
      ],
    },
    cssPrivate: {
      transformGroup: "css-set",
      buildPath: "",
      files: [
        {
          destination: outPrivateFile,
          format: "css/set-contexts",
          filter: "set/role-private",
        },
      ],
    },
  },
};
