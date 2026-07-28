#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";

import { isObject, parseJsonPointer } from "./helpers/json.mjs";

/**
 * Pipeline stage that merges and normalizes token sources for Style Dictionary.
 *
 * This script resolves `$ref` links, applies token-layer/domain wrapping rules,
 * normalizes public-layer aliases, and emits a single merged token document
 * used as SD source input for one resolved context.
 */

const cwd = process.cwd();
const SVG_XMLNS = "http://www.w3.org/2000/svg";

/**
 * Parses required CLI flags and validates invocation shape.
 *
 * @param {string[]} argv
 * @returns {Record<string, string>}
 */
function parseArgs(argv) {
  const args = {
    sourcesFile: null,
    outFile: null,
    resolver: null,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--sources-file") args.sourcesFile = argv[i + 1];
    if (arg === "--out-file") args.outFile = argv[i + 1];
    if (arg === "--resolver") args.resolver = argv[i + 1];
  }

  if (!args.sourcesFile || !args.outFile || !args.resolver) {
    throw new Error(
      "Usage: node scripts/pipeline/prepare-sd-sources.mjs --sources-file <sources.json> --out-file <tokens.json> --resolver <resolver.json>",
    );
  }

  return args;
}

/**
 * Deep-merges token documents so later sources override earlier ones predictably.
 *
 * @param {unknown} target
 * @param {unknown} source
 * @returns {unknown}
 */
function deepMerge(target, source) {
  if (Array.isArray(source)) return source.slice();
  if (!isObject(source)) return source;

  const out = isObject(target) ? { ...target } : {};

  for (const [key, value] of Object.entries(source)) {
    if (isObject(value) && isObject(out[key]))
      out[key] = deepMerge(out[key], value);
    else out[key] = deepMerge(undefined, value);
  }

  return out;
}

/**
 * Converts DTCG `{ value, unit }` objects into SD-friendly scalar strings.
 *
 * Temporary compatibility shim while SD DTCG support is still converging for
 * nested dimension fields inside composite CSS transforms (e.g. typography/shadow):
 * https://github.com/style-dictionary/style-dictionary/issues/1590
 *
 * @param {unknown} node
 * @returns {unknown}
 */
function normalizeDtcgValueObjects(node) {
  if (Array.isArray(node)) return node.map(normalizeDtcgValueObjects);
  if (!isObject(node)) return node;

  if (
    Object.prototype.hasOwnProperty.call(node, "value") &&
    Object.prototype.hasOwnProperty.call(node, "unit") &&
    (typeof node.value === "number" || typeof node.value === "string") &&
    typeof node.unit === "string"
  ) {
    return `${node.value}${node.unit}`;
  }

  const out = {};
  for (const [key, value] of Object.entries(node)) {
    out[key] = normalizeDtcgValueObjects(value);
  }

  return out;
}

/**
 * Reads a token leaf string value if present.
 *
 * @param {unknown} node
 * @returns {string | null}
 */
function readTokenStringValue(node) {
  if (!isObject(node) || typeof node.$value !== "string") return null;
  return node.$value;
}

/**
 * Builds a CSS-ready SVG data URI.
 *
 * @param {{ viewBox: string, path: string, fill: string }} shape
 * @returns {string}
 */
function buildShapeImageValue({ viewBox, path, fill }) {
  const svg = `<svg xmlns="${SVG_XMLNS}" viewBox="${viewBox}"><path d="${path}" fill="${fill}"/></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

/**
 * Derives an aspect-ratio string from a square/rectangular SVG viewBox.
 *
 * @param {string} viewBox
 * @returns {{ aspectRatio: string, blockSize: string }}
 */
function deriveShapeDimensions(viewBox) {
  const parts = viewBox.trim().split(/\s+/);

  if (parts.length !== 4) {
    throw new Error(`Invalid shape viewBox: ${viewBox}`);
  }

  const width = Number(parts[2]);
  const height = Number(parts[3]);

  if (
    !Number.isFinite(width) ||
    !Number.isFinite(height) ||
    width === 0 ||
    height === 0
  ) {
    throw new Error(`Invalid shape viewBox dimensions: ${viewBox}`);
  }

  return {
    aspectRatio: `${width} / ${height}`,
    blockSize: `${height}px`,
  };
}

/**
 * Derives semantic shape CSS outputs from raw primitive shape geometry.
 *
 * @param {unknown} semanticNode
 * @param {unknown} primitiveNode
 */
function appendSemanticShapeDerivatives(semanticNode, primitiveNode) {
  if (!isObject(semanticNode) || !isObject(primitiveNode)) return;

  const viewBox = readTokenStringValue(primitiveNode.viewBox);
  const shapePath = readTokenStringValue(primitiveNode.path);
  const fill = readTokenStringValue(primitiveNode.fill);

  if (viewBox && shapePath) {
    const dimensions = deriveShapeDimensions(viewBox);

    semanticNode.image = {
      $value: buildShapeImageValue({
        viewBox,
        path: shapePath,
        fill: fill ?? "currentColor",
      }),
    };
    semanticNode.aspectRatio = {
      $value: dimensions.aspectRatio,
    };
    semanticNode.blockSize = {
      $value: dimensions.blockSize,
    };
  }

  for (const [key, value] of Object.entries(semanticNode)) {
    if (key.startsWith("$")) continue;
    appendSemanticShapeDerivatives(value, primitiveNode[key]);
  }
}

/**
 * Reads a nested value by path segment array.
 *
 * @param {unknown} obj
 * @param {string[]} segments
 * @returns {unknown | undefined}
 */
function getPath(obj, segments) {
  let current = obj;

  for (const segment of segments) {
    if (!isObject(current) && !Array.isArray(current)) return undefined;

    current = current[segment];

    if (current === undefined) return undefined;
  }

  return current;
}

/**
 * Resolves `$ref` nodes recursively in a document with cycle detection.
 *
 * @param {unknown} value
 * @param {string} ownerFile
 * @param {(filePath: string) => Promise<unknown>} loader
 * @param {string[]} stack
 * @returns {Promise<unknown>}
 */
async function resolveRefsInDocument(value, ownerFile, loader, stack = []) {
  if (Array.isArray(value)) {
    const items = [];

    for (const item of value) {
      items.push(await resolveRefsInDocument(item, ownerFile, loader, stack));
    }

    return items;
  }

  if (!isObject(value)) return value;

  const keys = Object.keys(value);
  if (keys.length === 1 && keys[0] === "$ref") {
    const ref = value.$ref;
    const [filePart, pointerPart] = ref.split("#");
    const pointer = pointerPart ? `#${pointerPart}` : "#";
    const targetFile = filePart
      ? path.resolve(path.dirname(ownerFile), filePart)
      : ownerFile;
    const stackKey = `${ownerFile}->${ref}`;

    if (stack.includes(stackKey)) {
      throw new Error(
        `$ref cycle detected: ${stack.concat(stackKey).join(" | ")}`,
      );
    }

    const targetDoc = await loader(targetFile);
    const targetValue = getPath(targetDoc, parseJsonPointer(pointer));

    if (targetValue === undefined) {
      throw new Error(`$ref target not found: ${ref} (from ${ownerFile})`);
    }

    return resolveRefsInDocument(
      targetValue,
      targetFile,
      loader,
      stack.concat(stackKey),
    );
  }

  const out = {};

  for (const [key, child] of Object.entries(value)) {
    out[key] = await resolveRefsInDocument(child, ownerFile, loader, stack);
  }

  return out;
}

/**
 * Prefixes local aliases with semantic domain roots for public token layers.
 *
 * @param {unknown} node
 * @param {string} domain
 * @param {Set<string>} localRootKeys
 * @param {Set<string>} semanticDomainRoots
 * @param {Set<string>} knownLayers
 * @returns {unknown}
 */
function normalizePublicLayerAliases(
  node,
  domain,
  localRootKeys,
  semanticDomainRoots,
  knownTokenLayers,
) {
  const normalizeAliasString = (raw) => {
    const exactAlias = raw.match(/^\{([^}]+)\}$/);

    if (!exactAlias) return raw;

    const aliasPath = exactAlias[1];
    const first = aliasPath.split(".")[0];

    if (
      knownTokenLayers.has(first) ||
      semanticDomainRoots.has(first) ||
      !localRootKeys.has(first)
    ) {
      return raw;
    }

    return `{${domain}.${aliasPath}}`;
  };

  const visit = (value) => {
    if (Array.isArray(value)) return value.map(visit);
    if (!isObject(value))
      return typeof value === "string" ? normalizeAliasString(value) : value;

    const out = {};

    for (const [key, child] of Object.entries(value)) out[key] = visit(child);

    return out;
  };

  return visit(node);
}

/**
 * Discovers semantic domain root names from token source directory structure.
 *
 * @returns {Promise<Set<string>>}
 */
async function discoverSemanticDomainRoots() {
  const root = path.join(cwd, "src");
  const domains = new Set();

  async function walk(dir) {
    const entries = await fs.readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const full = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        await walk(full);
        continue;
      }

      if (!entry.isFile() || !entry.name.endsWith(".json")) continue;

      const rel = path.relative(root, full).replaceAll(path.sep, "/");
      const parts = rel.split("/");
      const semanticIndex = parts.indexOf("semantic");

      if (semanticIndex === -1) continue;

      const next = parts[semanticIndex + 1];

      if (!next) continue;

      const domain = next.endsWith(".tokens.json")
        ? path.basename(next, ".tokens.json")
        : next;

      domains.add(domain);
    }
  }

  await walk(root);

  return domains;
}

/**
 * Infers tokenLayer/domain from source path segments.
 *
 * @param {string} relPath
 * @param {Set<string>} knownTokenLayers
 * @returns {{ tokenLayer: string, domain: string }}
 */
function deriveLayerAndDomain(relPath, knownTokenLayers) {
  const parts = relPath.split("/");
  const tokenLayerIndex = parts.findIndex((part) => knownTokenLayers.has(part));

  if (tokenLayerIndex === -1)
    throw new Error(`Cannot infer tokenLayer/domain for source: ${relPath}`);

  const tokenLayer = parts[tokenLayerIndex];
  const next = parts[tokenLayerIndex + 1];

  if (!next)
    throw new Error(`Cannot infer token domain for source: ${relPath}`);

  const domain = next.endsWith(".tokens.json")
    ? path.basename(next, ".tokens.json")
    : next;

  return { tokenLayer, domain };
}

/**
 * Loads, resolves, normalizes, and merges context token sources into one object.
 *
 * @param {string[]} sources
 * @param {Record<string, unknown>} layerConfig
 * @returns {Promise<Record<string, unknown>>}
 */
async function buildMergedTokenObject(sources, layerConfig) {
  const rawCache = new Map();
  const resolvedCache = new Map();
  const loadRaw = async (filePath) => {
    const full = path.resolve(cwd, filePath);

    if (rawCache.has(full)) return rawCache.get(full);

    const doc = JSON.parse(await fs.readFile(full, "utf8"));

    rawCache.set(full, doc);

    return doc;
  };

  const loadResolved = async (filePath) => {
    const full = path.resolve(cwd, filePath);

    if (resolvedCache.has(full)) return resolvedCache.get(full);

    const raw = await loadRaw(filePath);
    const resolved = await resolveRefsInDocument(raw, full, loadRaw);

    resolvedCache.set(full, resolved);

    return resolved;
  };

  let merged = {};
  const semanticDomainRoots = await discoverSemanticDomainRoots();
  const knownTokenLayers = new Set([
    ...(layerConfig?.private ?? []),
    ...(layerConfig?.public ?? []),
  ]);
  const privateTokenLayers = new Set(layerConfig?.private ?? []);
  const publicTokenLayers = new Set(layerConfig?.public ?? []);

  if (knownTokenLayers.size === 0) {
    throw new Error(
      "Resolver build.tokenLayers is required and cannot be empty.",
    );
  }

  for (const sourcePath of sources) {
    const resolvedDoc = await loadResolved(sourcePath);
    const relPath = sourcePath.replaceAll(path.sep, "/");
    const { tokenLayer, domain } = deriveLayerAndDomain(
      relPath,
      knownTokenLayers,
    );
    const docBody = Object.fromEntries(
      Object.entries(resolvedDoc).filter(([k]) => k !== "$schema"),
    );
    const localRootKeys = new Set(
      Object.keys(docBody).filter((key) => !key.startsWith("$")),
    );
    const normalizedDoc = publicTokenLayers.has(tokenLayer)
      ? normalizePublicLayerAliases(
          docBody,
          domain,
          localRootKeys,
          semanticDomainRoots,
          knownTokenLayers,
        )
      : docBody;
    const wrapped = privateTokenLayers.has(tokenLayer)
      ? { [tokenLayer]: { [domain]: normalizedDoc } }
      : { [domain]: normalizedDoc };

    merged = deepMerge(merged, wrapped);
  }

  appendSemanticShapeDerivatives(merged.shape, merged.primitive?.shape);

  return normalizeDtcgValueObjects(merged);
}

/**
 * Builds context token overlays and CSS block manifests for Style Dictionary.
 *
 * @returns {Promise<void>}
 */
async function main() {
  const args = parseArgs(process.argv.slice(2));
  const sourcesDoc = JSON.parse(
    await fs.readFile(path.resolve(cwd, args.sourcesFile), "utf8"),
  );
  const resolverDoc = JSON.parse(
    await fs.readFile(path.resolve(cwd, args.resolver), "utf8"),
  );
  const layerConfig = resolverDoc?.$defs?.build?.tokenLayers;

  if (!isObject(layerConfig)) {
    throw new Error("Resolver missing $defs.build.tokenLayers metadata.");
  }

  if (!Array.isArray(sourcesDoc.sources)) {
    throw new Error(`Expected sources array in: ${args.sourcesFile}`);
  }

  const merged = await buildMergedTokenObject(sourcesDoc.sources, layerConfig);
  const outFull = path.resolve(cwd, args.outFile);

  await fs.mkdir(path.dirname(outFull), { recursive: true });
  await fs.writeFile(outFull, `${JSON.stringify(merged, null, 2)}\n`, "utf8");
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
