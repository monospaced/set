import { spawnSync } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";

import { isObject } from "./helpers/json.mjs";

/**
 * Pure DTCG resolver semantics for context-aware token resolution.
 *
 * This module isolates the resolver mechanics (modifier walking, alias
 * resolution, context-tuple naming, source ordering) from CSS-specific
 * output planning. When Style Dictionary lands native DTCG resolver
 * support, the bulk of this module becomes replaceable in a single swap;
 * downstream output stages (CSS, JSON, etc.) consume the resolved trees
 * unchanged.
 */

/**
 * Runs a subprocess and throws with captured stdout/stderr on failure.
 *
 * @param {string} cmd
 * @param {string[]} args
 * @param {import("node:child_process").SpawnSyncOptions} opts
 * @returns {import("node:child_process").SpawnSyncReturns<string>}
 */
function run(cmd, args, opts = {}) {
  const res = spawnSync(cmd, args, {
    stdio: "pipe",
    encoding: "utf8",
    ...opts,
  });

  if (res.status !== 0) {
    throw new Error(
      `${cmd} ${args.join(" ")} failed.\n${res.stdout || ""}\n${res.stderr || ""}`,
    );
  }

  return res;
}

/**
 * Reads and parses a JSON file from disk.
 *
 * @param {string} filePath
 * @returns {Promise<unknown>}
 */
export async function readJson(filePath) {
  return JSON.parse(await fs.readFile(filePath, "utf8"));
}

/**
 * Extracts ordered modifier names from resolver `resolutionOrder` refs.
 *
 * @param {Record<string, unknown>} resolverDoc
 * @returns {string[]}
 */
export function getResolutionModifierNames(resolverDoc) {
  const refs = Array.isArray(resolverDoc?.resolutionOrder)
    ? resolverDoc.resolutionOrder
    : [];
  const names = refs
    .map((entry) => {
      const ref = entry?.$ref;
      if (typeof ref !== "string") return null;
      const match = ref.match(/^#\/modifiers\/(.+)$/);
      return match ? match[1] : null;
    })
    .filter(Boolean);

  if (names.length === 0) {
    throw new Error(
      "Resolver resolutionOrder must reference modifiers (e.g. #/modifiers/size).",
    );
  }

  return names;
}

/**
 * Builds a stable context ID from resolution-order modifier values.
 *
 * @param {Record<string, unknown>} context
 * @param {string[]} modifierOrder
 * @returns {string}
 */
export function contextId(context, modifierOrder) {
  return modifierOrder
    .map((modifierName) => {
      const value = context?.[modifierName];

      if (value === undefined) {
        throw new Error(
          `Context is missing modifier "${modifierName}" required by resolutionOrder.`,
        );
      }

      return String(value);
    })
    .join("-");
}

/**
 * Parses `{alias.path}` syntax and returns the alias path when valid.
 *
 * @param {unknown} value
 * @returns {string | null}
 */
export function parseAliasRef(value) {
  if (typeof value !== "string") return null;
  const match = value.match(/^\{([^}]+)\}$/);
  return match ? match[1] : null;
}

/**
 * Reads a nested value by dotted path lookup.
 *
 * @param {unknown} root
 * @param {string} dotted
 * @returns {unknown | undefined}
 */
export function getByDottedPath(root, dotted) {
  const parts = dotted.split(".");
  let current = root;

  for (const part of parts) {
    if (!isObject(current)) return undefined;

    current = current[part];

    if (current === undefined) return undefined;
  }

  return current;
}

/**
 * Safely reads a dotted path value, returning undefined for invalid input.
 *
 * @param {unknown} root
 * @param {string} dotted
 * @returns {unknown | undefined}
 */
export function getByDottedPathOrUndefined(root, dotted) {
  if (!isObject(root) || typeof dotted !== "string" || dotted.length === 0)
    return undefined;

  return getByDottedPath(root, dotted);
}

/**
 * Reads a nested value by JSON Pointer lookup.
 *
 * @param {unknown} root
 * @param {string} pointer
 * @returns {unknown | undefined}
 */
export function getByJsonPointer(root, pointer) {
  if (!pointer || pointer === "#") return root;
  if (!pointer.startsWith("#/")) {
    throw new Error(`Unsupported JSON pointer: ${pointer}`);
  }

  const segments = pointer
    .slice(2)
    .split("/")
    .map((segment) => segment.replace(/~1/g, "/").replace(/~0/g, "~"));
  let current = root;

  for (const segment of segments) {
    if (!isObject(current) && !Array.isArray(current)) return undefined;
    current = current[segment];

    if (current === undefined) return undefined;
  }

  return current;
}

/**
 * Resolves `$value` aliases recursively within a token tree with cycle checks.
 *
 * @param {unknown} node
 * @param {Record<string, unknown>} lookupRoot
 * @param {string[]} stack
 * @returns {unknown}
 */
export function resolveAliasValues(node, lookupRoot, stack = []) {
  const resolveValue = (value, localStack) => {
    if (Array.isArray(value))
      return value.map((item) => resolveValue(item, localStack));

    if (isObject(value)) {
      const out = {};

      for (const [k, v] of Object.entries(value))
        out[k] = resolveValue(v, localStack);

      return out;
    }
    if (typeof value === "string") {
      const alias = parseAliasRef(value);

      if (alias) {
        if (localStack.includes(alias)) {
          throw new Error(
            `Alias cycle detected while resolving context token: ${localStack.join(" -> ")} -> ${alias}`,
          );
        }

        const target = getByDottedPath(lookupRoot, alias);

        if (target === undefined) {
          throw new Error(
            `Alias target not found while resolving context token: {${alias}}`,
          );
        }

        if (
          isObject(target) &&
          Object.prototype.hasOwnProperty.call(target, "$value")
        ) {
          return resolveValue(target.$value, localStack.concat(alias));
        }
        return resolveValue(target, localStack.concat(alias));
      }
    }
    return value;
  };

  if (Array.isArray(node)) {
    return node.map((item) => resolveAliasValues(item, lookupRoot, stack));
  }
  if (!isObject(node)) return node;

  if (Object.prototype.hasOwnProperty.call(node, "$value")) {
    return { ...node, $value: resolveValue(node.$value, stack) };
  }

  const out = {};

  for (const [key, value] of Object.entries(node)) {
    out[key] = resolveAliasValues(value, lookupRoot, stack);
  }

  return out;
}

/**
 * Resolves alias strings to terminal literal values with cycle protection.
 *
 * @param {unknown} value
 * @param {Record<string, unknown>} lookupRoot
 * @param {Set<string>} seen
 * @returns {unknown}
 */
export function resolveAliasOrLiteral(value, lookupRoot, seen = new Set()) {
  if (typeof value !== "string") return value;

  const alias = parseAliasRef(value);

  if (!alias) return value;
  if (seen.has(alias)) {
    throw new Error(
      `Alias cycle detected while resolving media condition: ${Array.from(seen).join(" -> ")} -> ${alias}`,
    );
  }

  const target = getByDottedPath(lookupRoot, alias);

  if (target === undefined) {
    throw new Error(
      `Alias target not found while resolving media condition: {${alias}}`,
    );
  }

  const nextSeen = new Set(seen);

  nextSeen.add(alias);

  if (
    isObject(target) &&
    Object.prototype.hasOwnProperty.call(target, "$value")
  ) {
    return resolveAliasOrLiteral(target.$value, lookupRoot, nextSeen);
  }
  return resolveAliasOrLiteral(target, lookupRoot, nextSeen);
}

/**
 * Returns the configured modifier default context, or the first context key.
 *
 * @param {Record<string, unknown>} modifierDoc
 * @param {string[]} contexts
 * @returns {string}
 */
export function getAxisDefault(modifierDoc, contexts) {
  return modifierDoc?.default ?? contexts[0];
}

/**
 * Builds a fully-specified context object from defaults and explicit overrides.
 *
 * @param {string[]} modifierOrder
 * @param {Record<string, unknown>} modifiers
 * @param {unknown} overrides
 * @returns {Record<string, string>}
 */
export function buildBaseContext(modifierOrder, modifiers, overrides = {}) {
  const out = {};

  for (const modifierName of modifierOrder) {
    const modifierDoc = modifiers?.[modifierName];
    const contexts = Object.keys(modifierDoc?.contexts ?? {});

    if (contexts.length === 0) {
      throw new Error(`Modifier "${modifierName}" has no contexts.`);
    }

    out[modifierName] =
      overrides[modifierName] ?? getAxisDefault(modifierDoc, contexts);
  }

  return out;
}

/**
 * Checks whether a resolved context satisfies a variant scope constraint.
 *
 * @param {Record<string, string>} selection
 * @param {Record<string, string[]> | null} scope
 * @returns {boolean}
 */
export function matchesScope(selection, scope) {
  if (!isObject(scope)) return true;

  for (const [axis, allowed] of Object.entries(scope)) {
    if (!Array.isArray(allowed) || allowed.length === 0) continue;
    if (!allowed.includes(selection[axis])) return false;
  }

  return true;
}

/**
 * Builds default variant scope using defaults of non-target modifier axes.
 *
 * @param {string} modifierName
 * @param {string[]} modifierOrder
 * @param {Record<string, unknown>} modifiers
 * @returns {Record<string, string[]> | null}
 */
export function buildDefaultScopeForModifier(
  modifierName,
  modifierOrder,
  modifiers,
) {
  const scope = {};

  for (const axis of modifierOrder) {
    if (axis === modifierName) continue;

    const modifierDoc = modifiers?.[axis];
    const contexts = Object.keys(modifierDoc?.contexts ?? {});

    if (contexts.length === 0) continue;

    scope[axis] = [getAxisDefault(modifierDoc, contexts)];
  }

  return Object.keys(scope).length > 0 ? scope : null;
}

/**
 * Merges default and override variant scopes.
 *
 * @param {Record<string, string[]> | null} defaultScope
 * @param {Record<string, string[]> | null} overrideScope
 * @returns {Record<string, string[]> | null}
 */
export function mergeScope(defaultScope, overrideScope) {
  if (!isObject(defaultScope) && !isObject(overrideScope)) return null;
  if (!isObject(defaultScope)) return overrideScope;
  if (!isObject(overrideScope)) return defaultScope;

  return { ...defaultScope, ...overrideScope };
}

/**
 * Resolves ordered token source file paths for a specific context.
 *
 * @param {{
 *  cwd: string,
 *  resolverPath: string,
 *  tmpDir: string,
 *  ctx: Record<string, unknown>,
 *  modifierOrder: string[]
 * }} options
 * @returns {Promise<string[]>}
 */
export async function resolveContextSources({
  cwd,
  resolverPath,
  tmpDir,
  ctx,
  modifierOrder,
}) {
  const id = contextId(ctx, modifierOrder);
  const contextPath = path.join(tmpDir, `${id}.context.json`);
  const sourcesPath = path.join(tmpDir, `${id}.sources.json`);

  await fs.writeFile(contextPath, `${JSON.stringify(ctx, null, 2)}\n`, "utf8");

  run(
    "node",
    [
      "scripts/pipeline/resolve-token-sources.mjs",
      "--resolver",
      path.relative(cwd, resolverPath),
      "--context",
      path.relative(cwd, contextPath),
      "--out",
      path.relative(cwd, sourcesPath),
    ],
    { cwd },
  );

  const sourcesDoc = JSON.parse(await fs.readFile(sourcesPath, "utf8"));

  if (!Array.isArray(sourcesDoc.sources) || sourcesDoc.sources.length === 0) {
    throw new Error(`No sources resolved for context ${id}`);
  }
  return sourcesDoc.sources;
}

/**
 * Builds a merged token document for one context via the source-merge pipeline.
 *
 * @param {{
 *  cwd: string,
 *  resolverPath: string,
 *  tmpDir: string,
 *  id: string,
 *  sources: string[]
 * }} options
 * @returns {Promise<unknown>}
 */
export async function buildMergedDoc({
  cwd,
  resolverPath,
  tmpDir,
  id,
  sources,
}) {
  const sourcesPath = path.join(tmpDir, `${id}.merge.sources.json`);
  const tokensPath = path.join(tmpDir, `${id}.merge.tokens.json`);

  await fs.writeFile(
    sourcesPath,
    `${JSON.stringify({ sources }, null, 2)}\n`,
    "utf8",
  );

  run(
    "node",
    [
      "scripts/pipeline/prepare-sd-sources.mjs",
      "--sources-file",
      path.relative(cwd, sourcesPath),
      "--resolver",
      path.relative(cwd, resolverPath),
      "--out-file",
      path.relative(cwd, tokensPath),
    ],
    { cwd },
  );

  return readJson(tokensPath);
}
