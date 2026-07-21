#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";

import { deepEqual, isObject, isTokenObject } from "./helpers/json.mjs";
import {
  buildBaseContext,
  buildMergedDoc,
  contextId,
  getResolutionModifierNames,
  matchesScope,
  readJson,
  resolveAliasValues,
  resolveContextSources,
} from "./resolve-context-tree.mjs";

/**
 * Pipeline stage that emits a consumer-facing JSON token artifact.
 *
 * Reads the resolver, fully resolves every relevant context permutation,
 * and emits a token-centric JSON artifact suitable for downstream tools
 * (docs sites, MCP, agents). Values stay in source units (px) — language-
 * agnostic and DTCG-faithful; rem conversion is a CSS-specific concern that
 * lives in the CSS pipeline only.
 *
 * Per-token shape reflects how each token actually depends on context.
 * Override maps are overlay-only (DTCG-faithful: `$value` carries the default;
 * `by<Axis>` / `byContext` carry only the contexts that actually differ):
 *
 * - Constant tokens: `$value` only.
 * - Single-axis variation: `$value` (default) + `varyingModifiers: [axis]`
 *   + `by<Axis>: { <axisValue>: { $value, ... } }`.
 * - Multi-axis variation: `$value` (default) + `varyingModifiers: [a, b]`
 *   + `byContext: { "a=v1,b=v2": { $value, ... } }`. Only varying modifier
 *   axes appear in the partial-tuple key.
 *
 * Set-defined fields are bare-named (no `$`) to avoid squatting on
 * DTCG's reserved `$` prefix; DTCG-defined fields (`$value`, `$type`,
 * `$description`, `$extensions`) keep their `$` prefix as the spec requires.
 */

const cwd = process.cwd();

/**
 * Parses required CLI flags and validates invocation shape.
 *
 * @param {string[]} argv
 * @returns {Record<string, string>}
 */
function parseArgs(argv) {
  const args = {};

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];

    if (arg === "--resolver") args.resolver = argv[i + 1];
    if (arg === "--out") args.out = argv[i + 1];
  }

  if (typeof args.resolver !== "string" || typeof args.out !== "string") {
    throw new Error(
      "Usage: node scripts/pipeline/prepare-json-output.mjs --resolver <resolver.json> --out <output.json>",
    );
  }

  return args;
}

/**
 * Computes the cartesian product of modifier-context tuples.
 *
 * @param {Array<Array<Record<string, string>>>} groups
 * @returns {Array<Record<string, string>>}
 */
function cartesianProduct(groups) {
  return groups.reduce(
    (acc, group) =>
      acc.flatMap((combo) => group.map((value) => ({ ...combo, ...value }))),
    [{}],
  );
}

/**
 * Enumerates the relevant context tuples to resolve for the consumer artifact.
 *
 * Base axes (no scope) cartesian-multiply normally. State axes (with scope)
 * only emit non-default values where the scope predicate matches. This mirrors
 * the same enumeration the CSS pipeline does, ensuring no missing or extra
 * context entries in the consumer JSON.
 *
 * @param {string[]} modifierOrder
 * @param {Record<string, unknown>} modifiers
 * @param {Record<string, unknown>} modifierBuildDefs
 * @returns {Array<Record<string, string>>}
 */
function enumerateContexts(modifierOrder, modifiers, modifierBuildDefs) {
  const baseAxes = [];
  const stateAxes = [];

  for (const name of modifierOrder) {
    const modifierDef = modifierBuildDefs?.[name] ?? {};

    if (isObject(modifierDef.scope)) stateAxes.push(name);
    else baseAxes.push(name);
  }

  const baseGroups = baseAxes.map((axisName) => {
    const contexts = Object.keys(modifiers[axisName]?.contexts ?? {});

    if (contexts.length === 0) {
      throw new Error(`Modifier "${axisName}" has no contexts.`);
    }

    return contexts.map((ctx) => ({ [axisName]: ctx }));
  });

  const baseCombos = cartesianProduct(baseGroups);
  const out = [];

  for (const baseCombo of baseCombos) {
    out.push(buildBaseContext(modifierOrder, modifiers, baseCombo));

    for (const stateAxis of stateAxes) {
      const stateModifier = modifiers[stateAxis];
      const stateContexts = Object.keys(stateModifier?.contexts ?? {});
      const defaultState = stateModifier?.default ?? stateContexts[0];
      const stateModifierDef = modifierBuildDefs?.[stateAxis] ?? {};

      if (!matchesScope(baseCombo, stateModifierDef.scope)) continue;

      for (const stateContext of stateContexts) {
        if (stateContext === defaultState) continue;

        out.push(
          buildBaseContext(modifierOrder, modifiers, {
            ...baseCombo,
            [stateAxis]: stateContext,
          }),
        );
      }
    }
  }

  return out;
}

/**
 * Strips internal-only `$extensions` namespaces before emission.
 *
 * Keeps any third-party `$extensions` the source declares; removes
 * Set-internal bridge / build metadata that consumers shouldn't depend
 * on.
 *
 * @param {unknown} node
 * @returns {unknown}
 */
function stripInternalExtensions(node) {
  if (!isObject(node)) return node;

  const out = {};

  for (const [key, value] of Object.entries(node)) {
    if (key === "$extensions" && isObject(value)) {
      const filtered = {};

      for (const [extKey, extValue] of Object.entries(value)) {
        if (extKey.startsWith("co.monospaced.set")) continue;
        filtered[extKey] = extValue;
      }

      if (Object.keys(filtered).length > 0) out[key] = filtered;
      continue;
    }

    out[key] = value;
  }

  return out;
}

/**
 * Parses a context tuple identifier (positional values joined by `-`, e.g.
 * `"baseline-lightDefault-off"`) into an axis-keyed object using the
 * modifier order from the resolver.
 *
 * @param {string} ctxId
 * @param {string[]} modifierOrder
 * @returns {Record<string, string>}
 */
function parseCtxId(ctxId, modifierOrder) {
  const out = {};

  if (!ctxId) return out;

  const parts = ctxId.split("-");

  for (let i = 0; i < modifierOrder.length && i < parts.length; i += 1) {
    out[modifierOrder[i]] = parts[i];
  }

  return out;
}

/**
 * Tests whether the token value is fully determined by a given subset of
 * modifier axes. Groups every observed context by its projection onto `axes`
 * and returns false if any group contains differing values.
 *
 * @param {string[]} axes
 * @param {Record<string, { $value: unknown, $extensions?: unknown }>} valueByCtx
 * @returns {boolean}
 */
function valueOnlyDependsOn(axes, valueByCtx, modifierOrder) {
  const groups = new Map();

  for (const [ctxId, value] of Object.entries(valueByCtx)) {
    const parsed = parseCtxId(ctxId, modifierOrder);
    const key = axes.map((a) => `${a}=${parsed[a] ?? ""}`).join(",");
    const valueKey = JSON.stringify(value);

    if (groups.has(key)) {
      if (groups.get(key) !== valueKey) return false;
    } else {
      groups.set(key, valueKey);
    }
  }

  return true;
}

/**
 * Identifies which modifier axes the token's value actually depends on.
 *
 * An axis is varying iff fixing every other axis still leaves the value
 * indeterminate — i.e., projecting the contexts onto `modifierOrder \ {axis}`
 * yields a group with mismatched values.
 *
 * @param {Record<string, { $value: unknown, $extensions?: unknown }>} valueByCtx
 * @param {string[]} modifierOrder
 * @returns {string[]}
 */
function findVaryingModifiers(valueByCtx, modifierOrder) {
  const varying = [];

  for (const axis of modifierOrder) {
    const otherAxes = modifierOrder.filter((a) => a !== axis);

    if (!valueOnlyDependsOn(otherAxes, valueByCtx, modifierOrder)) {
      varying.push(axis);
    }
  }

  return varying;
}

/**
 * Capitalises the first character of a string for `by<Axis>` field naming.
 *
 * @param {string} s
 * @returns {string}
 */
function capitalize(s) {
  return s.length === 0 ? s : `${s[0].toUpperCase()}${s.slice(1)}`;
}

/**
 * Normalises one token path segment to the same kebab-case form used by CSS
 * custom property output.
 *
 * @param {string} segment
 * @returns {string}
 */
function toKebab(segment) {
  return segment
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/([A-Z]+)([A-Z][a-z0-9]+)/g, "$1-$2")
    .replace(/[^A-Za-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();
}

/**
 * Walks a resolved token tree and accumulates token entries in a flat map
 * keyed by dotted path. Each token entry collects per-context values plus
 * stable metadata (`$type`, `$description`, `layer`).
 *
 * `layer` reflects the tokenLayer the token belongs to (e.g. `primitive`,
 * `semantic`). Private-layer tokens (per resolver `tokenLayers.private`) are
 * wrapped under their layer name in the resolved tree (`primitive.color.…`),
 * so `pathStack[0]` identifies them directly. Public-layer tokens (per
 * `tokenLayers.public`) are not wrapped — they sit at the top level by
 * domain — so they default to the public layer name.
 *
 * @param {unknown} node
 * @param {string} ctxKey
 * @param {Map<string, Record<string, unknown>>} accumulator
 * @param {{
 *  privateLayers: Set<string>,
 *  publicLayer: string
 * }} layerConfig
 * @param {string[]} pathStack
 */
function walkTokens(node, ctxKey, accumulator, layerConfig, pathStack = []) {
  if (!isObject(node)) return;

  if (isTokenObject(node)) {
    const dottedPath = pathStack.map(toKebab).join(".");
    const layer = layerConfig.privateLayers.has(pathStack[0])
      ? pathStack[0]
      : layerConfig.publicLayer;

    if (!accumulator.has(dottedPath)) {
      accumulator.set(dottedPath, {
        layer,
        contexts: {},
      });
    }

    const entry = accumulator.get(dottedPath);
    const stripped = stripInternalExtensions(node);

    if (entry.$type === undefined && stripped.$type !== undefined) {
      entry.$type = stripped.$type;
    }
    if (
      entry.$description === undefined &&
      stripped.$description !== undefined
    ) {
      entry.$description = stripped.$description;
    }

    const contextValue = { $value: stripped.$value };

    if (stripped.$extensions !== undefined) {
      contextValue.$extensions = stripped.$extensions;
    }

    entry.contexts[ctxKey] = contextValue;
    return;
  }

  for (const [key, value] of Object.entries(node)) {
    if (key.startsWith("$")) continue;
    walkTokens(value, ctxKey, accumulator, layerConfig, pathStack.concat(key));
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const resolverPath = path.resolve(cwd, args.resolver);
  const outPath = path.resolve(cwd, args.out);
  const tmpDir = path.join(cwd, "build", "tmp-json");

  await fs.rm(tmpDir, { recursive: true, force: true });
  await fs.mkdir(tmpDir, { recursive: true });
  await fs.mkdir(path.dirname(outPath), { recursive: true });

  const resolverDoc = await readJson(resolverPath);
  const modifierOrder = getResolutionModifierNames(resolverDoc);
  const modifiers = resolverDoc?.modifiers ?? {};
  const buildDefs = resolverDoc?.$defs?.build ?? {};
  const namespace =
    typeof buildDefs?.namespace === "string" ? buildDefs.namespace : null;
  const brand = typeof buildDefs?.brand === "string" ? buildDefs.brand : null;
  const cssBuildDefs = buildDefs?.targets?.css ?? {};
  const modifierBuildDefs = cssBuildDefs?.modifiers ?? {};
  const tokenLayerDefs = buildDefs?.tokenLayers ?? {};
  const privateLayers = new Set(
    Array.isArray(tokenLayerDefs?.private) ? tokenLayerDefs.private : [],
  );
  const publicLayerNames = Array.isArray(tokenLayerDefs?.public)
    ? tokenLayerDefs.public
    : [];
  const publicLayer = publicLayerNames[0] ?? "semantic";
  const layerConfig = { privateLayers, publicLayer };

  const defaultContext = buildBaseContext(modifierOrder, modifiers);
  const defaultContextId = contextId(defaultContext, modifierOrder);
  const allContexts = enumerateContexts(
    modifierOrder,
    modifiers,
    modifierBuildDefs,
  );
  const contexts = [
    defaultContext,
    ...allContexts.filter(
      (ctx) => contextId(ctx, modifierOrder) !== defaultContextId,
    ),
  ];

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

    walkTokens(resolved, id, accumulator, layerConfig);
  }

  const orderedKeys = Array.from(accumulator.keys());
  const tokens = {};

  for (const key of orderedKeys) {
    const entry = accumulator.get(key);
    const tokenOut = { layer: entry.layer };

    if (entry.$type !== undefined) tokenOut.$type = entry.$type;
    if (entry.$description !== undefined) {
      tokenOut.$description = entry.$description;
    }

    const defaultValue = entry.contexts[defaultContextId];

    if (defaultValue !== undefined) {
      tokenOut.$value = defaultValue.$value;
      if (defaultValue.$extensions !== undefined) {
        tokenOut.$extensions = defaultValue.$extensions;
      }
    }

    const varying = findVaryingModifiers(entry.contexts, modifierOrder);

    if (varying.length === 1) {
      const axis = varying[0];
      const byKey = `by${capitalize(axis)}`;
      const byMap = {};
      const seen = new Set();

      for (const ctxId of Object.keys(entry.contexts).sort()) {
        const ctxValue = entry.contexts[ctxId];

        if (defaultValue !== undefined && deepEqual(ctxValue, defaultValue)) {
          continue;
        }

        const av = parseCtxId(ctxId, modifierOrder)[axis];

        if (av === undefined || seen.has(av)) continue;
        seen.add(av);
        byMap[av] = ctxValue;
      }

      tokenOut.varyingModifiers = varying;
      tokenOut[byKey] = byMap;
    } else if (varying.length > 1) {
      const byContext = {};

      for (const [ctxId, ctxValue] of Object.entries(entry.contexts)) {
        if (defaultValue !== undefined && deepEqual(ctxValue, defaultValue)) {
          continue;
        }

        const parsed = parseCtxId(ctxId, modifierOrder);
        const partialKey = varying
          .map((a) => `${a}=${parsed[a] ?? ""}`)
          .join(",");

        byContext[partialKey] = ctxValue;
      }

      tokenOut.varyingModifiers = varying;
      tokenOut.byContext = Object.fromEntries(
        Object.entries(byContext).sort(([a], [b]) => a.localeCompare(b)),
      );
    }

    tokens[key] = tokenOut;
  }

  const output = {
    $schema: "../schemas/tokens.v1.json",
    namespace,
    brand,
    modifierOrder,
    defaultContext,
    tokens,
  };

  await fs.writeFile(outPath, `${JSON.stringify(output, null, 2)}\n`, "utf8");
  await fs.rm(tmpDir, { recursive: true, force: true });

  console.log(`Wrote consumer JSON: ${path.relative(cwd, outPath)}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
