#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

import Ajv from "ajv/dist/2020.js";

/**
 * Validates each emitted JSON token artifact in `dist/` against the
 * draft-2020-12 JSON Schema in `schemas/tokens.v1.json`.
 *
 * Catches drift between the pipeline's emission shape and the published
 * schema contract. Schema-level checks only — DTCG `$value` internals are
 * out of scope.
 *
 * Also validates the React Native modules in `dist/react-native/` against
 * their documented shape (see `README.md` → React Native).
 */

const here = path.dirname(fileURLToPath(import.meta.url));
const pkgRoot = path.resolve(here, "..");

/**
 * Collects every token leaf in a values-only tree, keyed by dotted path.
 *
 * A leaf is a primitive, an array (cubic-bézier), or one of the two React
 * Native style objects the target emits (typography, recognised by
 * `fontSize`; shadow, recognised by `shadowColor`). Everything else is a
 * group and is descended into.
 *
 * @param {unknown} node
 * @param {string[]} pathStack
 * @param {Map<string, unknown>} out
 */
function collectLeaves(node, pathStack, out) {
  const isGroup =
    node !== null &&
    typeof node === "object" &&
    !Array.isArray(node) &&
    !("fontSize" in node) &&
    !("shadowColor" in node);

  if (!isGroup) {
    out.set(pathStack.join("."), node);
    return;
  }

  for (const [key, value] of Object.entries(node)) {
    collectLeaves(value, pathStack.concat(key), out);
  }
}

/**
 * Asserts a React Native token module has the documented shape: three
 * disjoint partitions (`static`, `size`, `theme`), every size context and
 * every theme × surface slice carrying the same token paths, and no
 * unconvertible leaf (undefined, null, NaN, empty string).
 *
 * @param {string} filePath
 * @returns {Promise<string[]>} human-readable failures (empty when valid)
 */
async function validateReactNativeModule(filePath) {
  const failures = [];
  const mod = await import(pathToFileURL(filePath).href);
  const tokens = mod.default;

  if (!tokens || typeof tokens !== "object") {
    return [`default export is not an object`];
  }

  const topKeys = Object.keys(tokens).sort();

  if (topKeys.join(",") !== "size,static,theme") {
    failures.push(
      `top-level keys are ${topKeys.join(",")}, expected size,static,theme`,
    );
    return failures;
  }

  const staticLeaves = new Map();
  collectLeaves(tokens.static, [], staticLeaves);

  const sizeSlices = Object.entries(tokens.size).map(([ctx, tree]) => {
    const leaves = new Map();
    collectLeaves(tree, [], leaves);
    return { id: `size.${ctx}`, leaves };
  });

  const themeSlices = [];
  for (const [theme, surfaces] of Object.entries(tokens.theme)) {
    for (const [surface, tree] of Object.entries(surfaces)) {
      const leaves = new Map();
      collectLeaves(tree, [], leaves);
      themeSlices.push({ id: `theme.${theme}.${surface}`, leaves });
    }
  }

  const sameKeys = (slices, label) => {
    if (slices.length === 0) {
      failures.push(`${label}: no slices emitted`);
      return;
    }
    const reference = [...slices[0].leaves.keys()].sort().join("\n");
    for (const slice of slices.slice(1)) {
      const keys = [...slice.leaves.keys()].sort().join("\n");
      if (keys !== reference) {
        failures.push(
          `${label}: ${slice.id} carries different token paths than ${slices[0].id}`,
        );
      }
    }
  };

  sameKeys(sizeSlices, "size");
  sameKeys(themeSlices, "theme");

  const themes = Object.keys(tokens.theme).sort().join(",");
  if (themes !== "dark,light") {
    failures.push(`theme keys are ${themes}, expected dark,light`);
  }

  const partitions = [
    { id: "static", leaves: staticLeaves },
    ...sizeSlices.slice(0, 1),
    ...themeSlices.slice(0, 1),
  ];
  for (let i = 0; i < partitions.length; i += 1) {
    for (let j = i + 1; j < partitions.length; j += 1) {
      for (const key of partitions[i].leaves.keys()) {
        if (partitions[j].leaves.has(key)) {
          failures.push(
            `${key} appears in both ${partitions[i].id} and ${partitions[j].id}`,
          );
        }
      }
    }
  }

  const checkLeaf = (sliceId, key, value) => {
    const bad = (v) =>
      v === undefined ||
      v === null ||
      (typeof v === "number" && !Number.isFinite(v)) ||
      (typeof v === "string" && v.length === 0);
    const walk = (v) => {
      if (bad(v)) return true;
      if (Array.isArray(v)) return v.some(walk);
      if (typeof v === "object") return Object.values(v).some(walk);
      return false;
    };
    if (walk(value))
      failures.push(`${sliceId}.${key} has an unconvertible value`);
  };
  for (const slice of [
    { id: "static", leaves: staticLeaves },
    ...sizeSlices,
    ...themeSlices,
  ]) {
    for (const [key, value] of slice.leaves) checkLeaf(slice.id, key, value);
  }

  const dts = filePath.replace(/\.js$/, ".d.ts");
  try {
    await fs.access(dts);
  } catch {
    failures.push(`missing declarations file ${path.basename(dts)}`);
  }

  return failures;
}

async function main() {
  const schemaPath = path.join(pkgRoot, "schemas", "tokens.v1.json");
  const distDir = path.join(pkgRoot, "dist");

  try {
    await fs.access(distDir);
  } catch {
    throw new Error(
      `Missing dist/. Run \`pnpm --filter @monospaced/set-system build\` first.`,
    );
  }

  const schema = JSON.parse(await fs.readFile(schemaPath, "utf8"));
  const ajv = new Ajv({ strict: false, allErrors: true });
  const validate = ajv.compile(schema);

  const entries = await fs.readdir(distDir);
  const tokenFiles = entries.filter((entry) => entry.endsWith(".tokens.json"));
  const failures = [];

  for (const entry of tokenFiles) {
    const filePath = path.join(distDir, entry);
    const data = JSON.parse(await fs.readFile(filePath, "utf8"));

    if (!validate(data)) {
      failures.push({
        file: path.relative(pkgRoot, filePath),
        errors: validate.errors,
      });
    }
  }

  const rnDir = path.join(distDir, "react-native");
  const rnFiles = (await fs.readdir(rnDir)).filter((entry) =>
    entry.endsWith(".tokens.js"),
  );

  for (const entry of rnFiles) {
    const filePath = path.join(rnDir, entry);
    const errors = await validateReactNativeModule(filePath);

    if (errors.length > 0) {
      failures.push({ file: path.relative(pkgRoot, filePath), errors });
    }
  }

  if (failures.length > 0) {
    for (const { file, errors } of failures) {
      console.error(`Schema validation failed: ${file}`);
      console.error(JSON.stringify(errors, null, 2));
    }
    throw new Error(
      `Schema validation failed for ${failures.length} artifact(s).`,
    );
  }

  console.log(
    `Validated ${tokenFiles.length} JSON token artifacts against tokens.v1.json and ${rnFiles.length} React Native module(s).`,
  );
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
