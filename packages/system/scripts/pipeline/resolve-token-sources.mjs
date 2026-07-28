#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";

import { isObject, parseJsonPointer } from "./helpers/json.mjs";

/**
 * Pipeline stage that resolves ordered token source files for one context.
 *
 * This script walks resolver `resolutionOrder`, expands set refs, applies
 * modifier context selection (including `baseContext` inheritance), and writes
 * a deterministic ordered source list for downstream merge/build steps.
 */

const cwd = process.cwd();

/**
 * Parses required CLI flags and validates invocation shape.
 *
 * @param {string[]} argv
 * @returns {Record<string, string>}
 */
function parseArgs(argv) {
  const args = {
    resolver: null,
    context: null,
    out: null,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];

    if (arg === "--resolver") args.resolver = argv[i + 1];
    if (arg === "--context") args.context = argv[i + 1];
    if (arg === "--out") args.out = argv[i + 1];
  }

  if (!args.resolver || !args.context || !args.out) {
    throw new Error(
      "Usage: node scripts/pipeline/resolve-token-sources.mjs --resolver <resolver.json> --context <context.json> --out <sources.json>",
    );
  }

  return args;
}

/**
 * Reads a nested value by JSON Pointer lookup.
 *
 * @param {unknown} root
 * @param {string} pointer
 * @returns {unknown | undefined}
 */
function getByPointer(root, pointer) {
  const segments = parseJsonPointer(pointer);
  let current = root;

  for (const segment of segments) {
    if (!isObject(current) && !Array.isArray(current)) return undefined;

    current = current[segment];

    if (current === undefined) return undefined;
  }

  return current;
}

/**
 * Normalizes resolver `$ref` file paths to workspace-relative POSIX paths.
 *
 * @param {string} baseFile
 * @param {string} ref
 * @returns {string}
 */
function normalizeRef(baseFile, ref) {
  if (ref.startsWith("#/")) return ref;

  const hashIndex = ref.indexOf("#");
  const fileOnly = hashIndex === -1 ? ref : ref.slice(0, hashIndex);
  const fragment = hashIndex === -1 ? "" : ref.slice(hashIndex);
  const abs = path.resolve(path.dirname(baseFile), fileOnly);

  return `${path.relative(cwd, abs).replaceAll(path.sep, "/")}${fragment}`;
}

/**
 * Returns build metadata for a modifier context from resolver definitions.
 *
 * @param {Record<string, unknown>} resolverDoc
 * @param {string} modifierName
 * @param {string} contextName
 * @returns {Record<string, unknown> | null}
 */
function getModifierBuildContextDef(resolverDoc, modifierName, contextName) {
  const defs = resolverDoc?.$defs?.build;

  if (!isObject(defs)) return null;

  const targets = defs.targets;

  if (!isObject(targets)) return null;

  // Current adapter stores modifier build metadata under targets.css.modifiers.
  // If future targets are added, this can be generalized.
  const cssTarget = targets.css;

  if (!isObject(cssTarget)) return null;

  const modifiers = cssTarget.modifiers;

  if (!isObject(modifiers)) return null;

  const modifierDef = modifiers[modifierName];

  if (!isObject(modifierDef)) return null;

  const contexts = modifierDef.contexts;

  if (!isObject(contexts)) return null;

  const contextDef = contexts[contextName];

  return isObject(contextDef) ? contextDef : null;
}

/**
 * Expands modifier context source arrays including inherited `baseContext` chain.
 *
 * @param {{
 *  resolverDoc: Record<string, unknown>,
 *  modifierName: string,
 *  selectedContext: string,
 *  sourceContexts: Record<string, unknown>
 * }} options
 * @returns {Array<{ contextName: string, sourceArray: unknown[] }>}
 */
function resolveModifierContextSourceArrays({
  resolverDoc,
  modifierName,
  selectedContext,
  sourceContexts,
}) {
  const out = [];
  const visiting = new Set();
  const visited = new Set();
  const visit = (contextName) => {
    if (visited.has(contextName)) return;
    if (visiting.has(contextName)) {
      throw new Error(
        `Cycle detected in modifier "${modifierName}" baseContext chain at "${contextName}".`,
      );
    }

    const sourceArray = sourceContexts[contextName];

    if (!Array.isArray(sourceArray)) {
      throw new Error(
        `Modifier "${modifierName}" does not contain context "${contextName}".`,
      );
    }

    visiting.add(contextName);

    const buildContextDef = getModifierBuildContextDef(
      resolverDoc,
      modifierName,
      contextName,
    );
    const baseContext = buildContextDef?.baseContext;

    if (typeof baseContext === "string" && baseContext.length > 0) {
      visit(baseContext);
    }

    visiting.delete(contextName);
    visited.add(contextName);
    out.push({ contextName, sourceArray });
  };

  visit(selectedContext);

  return out;
}

/**
 * Resolves set and file refs into ordered concrete source file paths.
 *
 * @param {{
 *  resolverDoc: Record<string, unknown>,
 *  resolverPath: string,
 *  sourceArray: unknown[],
 *  output: string[],
 *  stack: string[]
 * }} options
 * @returns {void}
 */
function resolveSourceArray({
  resolverDoc,
  resolverPath,
  sourceArray,
  output,
  stack,
}) {
  for (const source of sourceArray) {
    if (!isObject(source)) {
      throw new Error("Unsupported non-object source entry in resolver.");
    }

    if (Object.prototype.hasOwnProperty.call(source, "$ref")) {
      const ref = source.$ref;

      if (typeof ref !== "string") {
        throw new Error("Source $ref must be a string.");
      }

      if (!ref.startsWith("#/")) {
        // Allow duplicate file refs: baseContext chains may re-apply a source
        // the base already included (e.g. a cross-palette inverse surface
        // overriding back to its own palette). Downstream deepMerge is
        // last-wins and idempotent for identical data.
        output.push(normalizeRef(resolverPath, ref));
        continue;
      }

      if (stack.includes(ref)) {
        throw new Error(
          `Circular internal resolver reference: ${stack.join(" -> ")} -> ${ref}`,
        );
      }

      const target = getByPointer(resolverDoc, ref);

      if (!target)
        throw new Error(`Resolver internal reference not found: ${ref}`);

      // Set reference.
      if (ref.startsWith("#/sets/")) {
        if (!Array.isArray(target.sources)) {
          throw new Error(`Set ${ref} has no sources array.`);
        }

        resolveSourceArray({
          resolverDoc,
          resolverPath,
          sourceArray: target.sources,
          output,
          stack: [...stack, ref],
        });

        continue;
      }

      // Modifier reference in resolutionOrder.
      if (ref.startsWith("#/modifiers/")) {
        throw new Error(
          `Unexpected modifier ref inside source array: ${ref}. Modifiers are only resolved via resolutionOrder.`,
        );
      }

      throw new Error(`Unsupported internal resolver reference: ${ref}`);
    } else {
      // Inline tokens are valid per spec, but cannot be passed as SD source paths.
      throw new Error(
        "Inline token sources are not supported by this adapter yet; use file or set references.",
      );
    }
  }
}

/**
 * Resolves final source ordering for a selected context across resolutionOrder.
 *
 * @param {{
 *  resolverDoc: Record<string, unknown>,
 *  resolverPath: string,
 *  contextInput: Record<string, string>
 * }} options
 * @returns {string[]}
 */
function resolveOrderedSources({ resolverDoc, resolverPath, contextInput }) {
  if (!Array.isArray(resolverDoc.resolutionOrder)) {
    throw new Error("Resolver must include resolutionOrder array.");
  }

  const output = [];

  for (const item of resolverDoc.resolutionOrder) {
    if (!isObject(item) || typeof item.$ref !== "string") {
      throw new Error("resolutionOrder entries must be $ref objects.");
    }

    const ref = item.$ref;

    if (!ref.startsWith("#/modifiers/") && !ref.startsWith("#/sets/")) {
      throw new Error(`Unsupported resolutionOrder ref: ${ref}`);
    }

    if (ref.startsWith("#/sets/")) {
      const setObj = getByPointer(resolverDoc, ref);

      if (!setObj || !Array.isArray(setObj.sources)) {
        throw new Error(`Set in resolutionOrder has no sources: ${ref}`);
      }

      resolveSourceArray({
        resolverDoc,
        resolverPath,
        sourceArray: setObj.sources,
        output,
        stack: [ref],
      });

      continue;
    }

    const modifierObj = getByPointer(resolverDoc, ref);

    if (!modifierObj || !isObject(modifierObj.contexts)) {
      throw new Error(`Modifier in resolutionOrder has no contexts: ${ref}`);
    }

    const modifierName = ref.split("/").at(-1);
    const selected = contextInput[modifierName] ?? modifierObj.default;

    if (typeof selected !== "string" || selected.length === 0) {
      throw new Error(
        `No selected context for modifier "${modifierName}" and no default provided.`,
      );
    }

    const sourceArray = modifierObj.contexts[selected];

    if (!Array.isArray(sourceArray)) {
      throw new Error(
        `Modifier "${modifierName}" does not contain context "${selected}".`,
      );
    }

    const sourceArrays = resolveModifierContextSourceArrays({
      resolverDoc,
      modifierName,
      selectedContext: selected,
      sourceContexts: modifierObj.contexts,
    });

    for (const entry of sourceArrays) {
      resolveSourceArray({
        resolverDoc,
        resolverPath,
        sourceArray: entry.sourceArray,
        output,
        stack: [
          ref,
          `#/modifiers/${modifierName}/contexts/${entry.contextName}`,
        ],
      });
    }
  }

  return output;
}

/**
 * Loads resolver/context input, resolves ordered sources, and writes output.
 *
 * @returns {import("node:child_process").SpawnSyncReturns<string>}
 */
async function run() {
  const args = parseArgs(process.argv.slice(2));
  const resolverPath = path.resolve(cwd, args.resolver);
  const contextPath = path.resolve(cwd, args.context);
  const resolverDoc = JSON.parse(await fs.readFile(resolverPath, "utf8"));
  const contextInput = JSON.parse(await fs.readFile(contextPath, "utf8"));
  const orderedSources = resolveOrderedSources({
    resolverDoc,
    resolverPath,
    contextInput,
  });
  const payload = {
    resolver: path.relative(cwd, resolverPath).replaceAll(path.sep, "/"),
    context: path.relative(cwd, contextPath).replaceAll(path.sep, "/"),
    inputs: contextInput,
    sources: orderedSources,
  };

  if (args.out) {
    const outPath = path.resolve(cwd, args.out);

    await fs.mkdir(path.dirname(outPath), { recursive: true });
    await fs.writeFile(
      outPath,
      `${JSON.stringify(payload, null, 2)}\n`,
      "utf8",
    );

    console.log(`Wrote ordered sources to ${path.relative(cwd, outPath)}`);
  } else {
    console.log(JSON.stringify(payload, null, 2));
  }
}

run().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
