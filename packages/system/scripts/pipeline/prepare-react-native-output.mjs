#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";

import {
  enumerateContexts,
  findVaryingModifiers,
} from "./helpers/contexts.mjs";
import { isObject, isTokenObject } from "./helpers/json.mjs";
import {
  buildBaseContext,
  buildMergedDoc,
  contextId,
  getAxisDefault,
  getResolutionModifierNames,
  readJson,
  resolveAliasValues,
  resolveContextSources,
} from "./resolve-context-tree.mjs";

/**
 * Pipeline stage that prepares the Style Dictionary source for the React
 * Native token target.
 *
 * React Native has no cascade, media queries or selectors, so the CSS
 * target's context mechanics (deltas, forcing selectors, content-theme
 * overrides) do not transfer. Instead this stage resolves every relevant
 * context permutation and re-shapes the public (semantic) tokens into a
 * context matrix the runtime can index directly:
 *
 * - `static`: tokens whose value does not vary on any kept axis.
 * - `size.<context>`: tokens that vary on the size axis, fully resolved at
 *   each size context (no inheritance left for the runtime to do).
 * - `theme.<theme>.<surface>`: tokens that vary on the theme axis, keyed by
 *   the plain theme × surface pairs the resolver's `reactNative` target
 *   metadata maps its theme contexts to.
 *
 * Axes the resolver does not list under `targets.reactNative.axes` (e.g.
 * `forcedColors`, `root`) are dropped: only contexts at those axes'
 * defaults are considered. Theme contexts without a mapping (the CSS
 * content-theme overrides) are dropped for the same reason; in RN an
 * always-dark region simply reads `theme.dark` from the provider.
 *
 * Only DTCG-typed tokens are emitted. Untyped tokens are CSS-specific
 * strings (display keywords, data URIs, font-variation settings) with no
 * React Native meaning. Value conversion to RN units/shapes is left to the
 * Style Dictionary transform in `style-dictionary.react-native.config.mjs`;
 * this stage only decides *which* tokens appear *where*.
 *
 * A base resolver (brand-agnostic spacing, layout, breakpoints) is merged
 * underneath the brand resolver so consumers import one object per brand.
 */

const cwd = process.cwd();

/** DTCG `$type`s the React Native transform knows how to convert. */
const SUPPORTED_TYPES = new Set([
  "color",
  "cubicBezier",
  "dimension",
  "duration",
  "fontFamily",
  "fontWeight",
  "number",
  "shadow",
  "typography",
]);

/**
 * Parses required CLI flags and validates invocation shape.
 *
 * @param {string[]} argv
 * @returns {{ resolver: string, baseResolver?: string, out: string }}
 */
function parseArgs(argv) {
  const args = {};

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];

    if (arg === "--resolver") args.resolver = argv[i + 1];
    if (arg === "--base-resolver") args.baseResolver = argv[i + 1];
    if (arg === "--out") args.out = argv[i + 1];
  }

  if (typeof args.resolver !== "string" || typeof args.out !== "string") {
    throw new Error(
      "Usage: node scripts/pipeline/prepare-react-native-output.mjs --resolver <resolver.json> [--base-resolver <resolver.json>] --out <sd-source.json>",
    );
  }

  return args;
}

/**
 * Reads the `targets.reactNative` build metadata from a resolver.
 *
 * @param {Record<string, unknown>} resolverDoc
 * @param {string} resolverPath
 * @returns {{
 *  sizeAxis: string | null,
 *  themeAxis: string | null,
 *  themeContexts: Record<string, { theme: string, surface: string }>
 * }}
 */
function readReactNativeDefs(resolverDoc, resolverPath) {
  const defs = resolverDoc?.$defs?.build?.targets?.reactNative;

  if (!isObject(defs)) {
    throw new Error(
      `${resolverPath}: missing $defs.build.targets.reactNative. The React Native target is opt-in per resolver.`,
    );
  }

  const axes = isObject(defs.axes) ? defs.axes : {};
  const themeContexts = isObject(defs.themeContexts) ? defs.themeContexts : {};

  for (const [ctx, mapping] of Object.entries(themeContexts)) {
    if (
      !isObject(mapping) ||
      typeof mapping.theme !== "string" ||
      typeof mapping.surface !== "string"
    ) {
      throw new Error(
        `${resolverPath}: targets.reactNative.themeContexts.${ctx} must be { theme, surface }.`,
      );
    }
  }

  return {
    sizeAxis: typeof axes.size === "string" ? axes.size : null,
    themeAxis: typeof axes.theme === "string" ? axes.theme : null,
    themeContexts,
  };
}

/**
 * Walks a resolved token tree, propagating group-level `$type` down to
 * token leaves, and records each public-layer token's value for `ctxId`.
 *
 * @param {unknown} node
 * @param {string} ctxId
 * @param {Map<string, {
 *  path: string[],
 *  $type: string | undefined,
 *  $description: string | undefined,
 *  values: Record<string, unknown>
 * }>} accumulator
 * @param {Set<string>} privateLayers
 * @param {string[]} pathStack
 * @param {string | undefined} inheritedType
 */
function walkTokens(
  node,
  ctxId,
  accumulator,
  privateLayers,
  pathStack = [],
  inheritedType = undefined,
) {
  if (!isObject(node)) return;

  const type = typeof node.$type === "string" ? node.$type : inheritedType;

  if (isTokenObject(node)) {
    if (pathStack.length > 0 && privateLayers.has(pathStack[0])) return;

    const key = pathStack.join(".");

    if (!accumulator.has(key)) {
      accumulator.set(key, {
        path: [...pathStack],
        $type: type,
        $description:
          typeof node.$description === "string" ? node.$description : undefined,
        values: {},
      });
    }

    accumulator.get(key).values[ctxId] = node.$value;
    return;
  }

  for (const [key, value] of Object.entries(node)) {
    if (key.startsWith("$")) continue;
    walkTokens(
      value,
      ctxId,
      accumulator,
      privateLayers,
      pathStack.concat(key),
      type,
    );
  }
}

/**
 * Assigns a token leaf into a nested tree at `segments`.
 *
 * @param {Record<string, unknown>} root
 * @param {string[]} segments
 * @param {unknown} leaf
 */
function setPath(root, segments, leaf) {
  let node = root;

  for (const segment of segments.slice(0, -1)) {
    if (!isObject(node[segment])) node[segment] = {};
    node = node[segment];
  }

  node[segments[segments.length - 1]] = leaf;
}

/**
 * Builds a DTCG token leaf for the SD source.
 *
 * @param {{ $type: string, $description?: string }} entry
 * @param {unknown} value
 * @returns {Record<string, unknown>}
 */
function leafFor(entry, value) {
  const leaf = { $type: entry.$type, $value: value };

  if (entry.$description !== undefined) leaf.$description = entry.$description;

  return leaf;
}

/**
 * Resolves one resolver into the React Native context matrix.
 *
 * @param {string} resolverPath
 * @param {string} tmpDir
 * @returns {Promise<{
 *  tree: { static: object, size: Record<string, object>, theme: Record<string, Record<string, object>> },
 *  skipped: string[]
 * }>}
 */
async function collectResolver(resolverPath, tmpDir) {
  const resolverDoc = await readJson(resolverPath);
  const modifierOrder = getResolutionModifierNames(resolverDoc);
  const modifiers = resolverDoc?.modifiers ?? {};
  const buildDefs = resolverDoc?.$defs?.build ?? {};
  const cssModifierDefs = buildDefs?.targets?.css?.modifiers ?? {};
  const privateLayers = new Set(
    Array.isArray(buildDefs?.tokenLayers?.private)
      ? buildDefs.tokenLayers.private
      : [],
  );
  const { sizeAxis, themeAxis, themeContexts } = readReactNativeDefs(
    resolverDoc,
    resolverPath,
  );

  for (const axis of [sizeAxis, themeAxis]) {
    if (axis !== null && !modifierOrder.includes(axis)) {
      throw new Error(
        `${resolverPath}: targets.reactNative names axis "${axis}" which is not in the resolution order.`,
      );
    }
  }

  const keptAxes = new Set([sizeAxis, themeAxis].filter((a) => a !== null));
  const droppedAxes = modifierOrder.filter((axis) => !keptAxes.has(axis));
  const defaultContext = buildBaseContext(modifierOrder, modifiers);

  const isKept = (ctx) => {
    for (const axis of droppedAxes) {
      if (ctx[axis] !== defaultContext[axis]) return false;
    }
    if (themeAxis !== null && !(ctx[themeAxis] in themeContexts)) return false;
    return true;
  };

  const allContexts = [
    defaultContext,
    ...enumerateContexts(modifierOrder, modifiers, cssModifierDefs),
  ];
  const seen = new Set();
  const contexts = [];

  for (const ctx of allContexts) {
    const id = contextId(ctx, modifierOrder);

    if (seen.has(id) || !isKept(ctx)) continue;
    seen.add(id);
    contexts.push(ctx);
  }

  if (contexts.length === 0) {
    throw new Error(
      `${resolverPath}: no contexts survive the React Native axis filter.`,
    );
  }

  const accumulator = new Map();

  for (const ctx of contexts) {
    const id = contextId(ctx, modifierOrder);
    const sources = await resolveContextSources({
      cwd,
      resolverPath,
      tmpDir,
      ctx,
      modifierOrder,
    });
    const fullDoc = await buildMergedDoc({
      cwd,
      resolverPath,
      tmpDir,
      id,
      sources,
    });
    const resolved = resolveAliasValues(fullDoc, fullDoc);

    walkTokens(resolved, id, accumulator, privateLayers);
  }

  // The context used for `static` values and as the fixed point for the
  // other axis when projecting a single-axis token.
  const anchor = contexts.find((ctx) => isKept(ctx)) ?? contexts[0];
  const anchorId = contextId(anchor, modifierOrder);
  const sizeContexts =
    sizeAxis !== null ? Object.keys(modifiers[sizeAxis]?.contexts ?? {}) : [];
  const sizeDefault =
    sizeAxis !== null
      ? getAxisDefault(modifiers[sizeAxis], modifiers[sizeAxis]?.contexts ?? {})
      : null;

  const tree = { static: {}, size: {}, theme: {} };
  const skipped = [];

  for (const entry of accumulator.values()) {
    const key = entry.path.join(".");

    if (entry.$type === undefined) {
      skipped.push(`${key} (untyped)`);
      continue;
    }
    if (!SUPPORTED_TYPES.has(entry.$type)) {
      skipped.push(`${key} ($type ${entry.$type})`);
      continue;
    }

    const varying = findVaryingModifiers(entry.values, modifierOrder);

    if (varying.length === 0) {
      setPath(tree.static, entry.path, leafFor(entry, entry.values[anchorId]));
      continue;
    }

    if (varying.length === 1 && varying[0] === sizeAxis) {
      for (const sizeCtx of sizeContexts) {
        const ctx = { ...anchor, [sizeAxis]: sizeCtx };
        const value = entry.values[contextId(ctx, modifierOrder)];

        if (value === undefined) continue;
        if (!isObject(tree.size[sizeCtx])) tree.size[sizeCtx] = {};
        setPath(tree.size[sizeCtx], entry.path, leafFor(entry, value));
      }
      continue;
    }

    if (varying.length === 1 && varying[0] === themeAxis) {
      for (const [themeCtx, { theme, surface }] of Object.entries(
        themeContexts,
      )) {
        const ctx = {
          ...anchor,
          [themeAxis]: themeCtx,
          ...(sizeAxis !== null ? { [sizeAxis]: sizeDefault } : {}),
        };
        const value = entry.values[contextId(ctx, modifierOrder)];

        if (value === undefined) continue;
        if (!isObject(tree.theme[theme])) tree.theme[theme] = {};
        if (!isObject(tree.theme[theme][surface])) {
          tree.theme[theme][surface] = {};
        }
        setPath(tree.theme[theme][surface], entry.path, leafFor(entry, value));
      }
      continue;
    }

    throw new Error(
      `${resolverPath}: token "${key}" varies on ${JSON.stringify(varying)}. The React Native matrix supports a single axis per token; add a nested shape before emitting it.`,
    );
  }

  return { tree, skipped };
}

/**
 * Deep-merges `source` into `target` (last wins on leaves).
 *
 * @param {Record<string, unknown>} target
 * @param {Record<string, unknown>} source
 * @returns {Record<string, unknown>}
 */
function deepMerge(target, source) {
  for (const [key, value] of Object.entries(source)) {
    if (isObject(value) && !isTokenObject(value) && isObject(target[key])) {
      deepMerge(target[key], value);
    } else {
      target[key] = value;
    }
  }

  return target;
}

/**
 * Returns a copy of `node` with keys sorted at every level, so output is
 * independent of source iteration order.
 *
 * @param {unknown} node
 * @returns {unknown}
 */
function sortKeys(node) {
  if (Array.isArray(node)) return node.map(sortKeys);
  if (!isObject(node)) return node;

  const out = {};

  for (const key of Object.keys(node).sort((a, b) => a.localeCompare(b))) {
    out[key] = sortKeys(node[key]);
  }

  return out;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const resolverPath = path.resolve(cwd, args.resolver);
  const outPath = path.resolve(cwd, args.out);
  const tmpDir = path.join(cwd, "build", "tmp-react-native");

  await fs.rm(tmpDir, { recursive: true, force: true });
  await fs.mkdir(tmpDir, { recursive: true });
  await fs.mkdir(path.dirname(outPath), { recursive: true });

  const merged = { static: {}, size: {}, theme: {} };
  const skipped = [];

  if (typeof args.baseResolver === "string") {
    const base = await collectResolver(
      path.resolve(cwd, args.baseResolver),
      tmpDir,
    );

    deepMerge(merged, base.tree);
    skipped.push(...base.skipped);
  }

  const brand = await collectResolver(resolverPath, tmpDir);

  deepMerge(merged, brand.tree);
  skipped.push(...brand.skipped);

  await fs.writeFile(
    outPath,
    `${JSON.stringify(sortKeys(merged), null, 2)}\n`,
    "utf8",
  );
  await fs.rm(tmpDir, { recursive: true, force: true });

  console.log(
    `Wrote React Native SD source: ${path.relative(cwd, outPath)} (skipped ${skipped.length} non-RN token(s))`,
  );

  for (const entry of skipped.sort((a, b) => a.localeCompare(b))) {
    console.log(`  skipped ${entry}`);
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
