#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";

/**
 * Validation entrypoint for token and resolver authoring inputs.
 *
 * This script validates JSON parseability, schema path wiring, resolver
 * structural sanity, and runs context preparation as a functional sanity check
 * to catch unresolved alias/cycle errors before build.
 */

const cwd = process.cwd();
const TOKENS_SRC_DIR = path.join(cwd, "src");
const TOKENS_RESOLVER_DIR = path.join(cwd, "resolver");
const TMP_VALIDATE_DIR = path.join(cwd, "build", "validate");

/**
 * Returns a workspace-relative POSIX path for readable diagnostics.
 *
 * @param {string} file
 * @returns {string}
 */
function rel(file) {
  return path.relative(cwd, file).replaceAll(path.sep, "/");
}

/**
 * Runs a subprocess and throws with captured output when it fails.
 *
 * @param {string} cmd
 * @param {string[]} args
 * @param {import("node:child_process").SpawnSyncOptions} opts
 * @returns {import("node:child_process").SpawnSyncReturns<string>}
 */
function run(cmd, args, opts = {}) {
  const result = spawnSync(cmd, args, {
    cwd,
    stdio: "pipe",
    encoding: "utf8",
    ...opts,
  });
  if (result.status !== 0) {
    throw new Error(
      `${cmd} ${args.join(" ")} failed.\n${result.stdout || ""}\n${result.stderr || ""}`,
    );
  }

  return result;
}

/**
 * Recursively lists files under a root directory using a filter predicate.
 *
 * @param {string} rootDir
 * @param {(filePath: string) => boolean} predicate
 * @returns {Promise<string[]>}
 */
async function listFiles(rootDir, predicate) {
  const out = [];

  async function walk(dir) {
    const entries = await fs.readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const full = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        await walk(full);
      } else if (predicate(full)) {
        out.push(full);
      }
    }
  }

  await walk(rootDir);

  out.sort((a, b) => a.localeCompare(b));

  return out;
}

/**
 * Validates that a local `$schema` ref exists and resolves to the expected path.
 *
 * @param {string} filePath
 * @param {unknown} schemaRef
 * @param {string} expectedSchemaTail
 * @param {string[]} errors
 * @returns {void}
 */
function checkSchemaRefPath(filePath, schemaRef, expectedSchemaTail, errors) {
  if (typeof schemaRef !== "string" || schemaRef.length === 0) {
    errors.push(`${rel(filePath)}: missing or invalid "$schema"`);
    return;
  }

  if (schemaRef.startsWith("http://") || schemaRef.startsWith("https://")) {
    errors.push(
      `${rel(filePath)}: "$schema" must be local vendored path, got remote URL`,
    );
    return;
  }

  const resolved = path.resolve(path.dirname(filePath), schemaRef);

  if (!resolved.endsWith(expectedSchemaTail)) {
    errors.push(
      `${rel(filePath)}: "$schema" should resolve to "${expectedSchemaTail}", got "${schemaRef}"`,
    );
  }
}

/**
 * Validates one token file for JSON structure and schema path correctness.
 *
 * @param {string} filePath
 * @param {string[]} errors
 * @returns {Promise<void>}
 */
async function validateTokenFile(filePath, errors) {
  let doc;

  try {
    doc = JSON.parse(await fs.readFile(filePath, "utf8"));
  } catch (error) {
    errors.push(`${rel(filePath)}: invalid JSON (${error.message})`);
    return;
  }

  if (typeof doc !== "object" || doc === null || Array.isArray(doc)) {
    errors.push(`${rel(filePath)}: top-level must be a JSON object`);
    return;
  }

  if (Object.prototype.hasOwnProperty.call(doc, "")) {
    errors.push(
      `${rel(filePath)}: invalid empty-string key found at top level`,
    );
  }

  checkSchemaRefPath(
    filePath,
    doc.$schema,
    `${path.sep}schemas${path.sep}2025.10${path.sep}schema${path.sep}format.json`,
    errors,
  );

  if (typeof doc.$schema === "string" && !doc.$schema.startsWith("http")) {
    const resolved = path.resolve(path.dirname(filePath), doc.$schema);

    try {
      await fs.access(resolved);
    } catch {
      errors.push(
        `${rel(filePath)}: "$schema" path not found (${doc.$schema})`,
      );
    }
  }
}

/**
 * Validates one resolver file for JSON/schema correctness and minimal semantics.
 *
 * @param {string} filePath
 * @param {string[]} errors
 * @returns {Promise<void>}
 */
async function validateResolverFile(filePath, errors) {
  let doc;

  try {
    doc = JSON.parse(await fs.readFile(filePath, "utf8"));
  } catch (error) {
    errors.push(`${rel(filePath)}: invalid JSON (${error.message})`);
    return;
  }

  if (typeof doc !== "object" || doc === null || Array.isArray(doc)) {
    errors.push(`${rel(filePath)}: top-level must be a JSON object`);
    return;
  }

  checkSchemaRefPath(
    filePath,
    doc.$schema,
    `${path.sep}schemas${path.sep}2025.10${path.sep}schema${path.sep}resolver.json`,
    errors,
  );

  if (typeof doc.$schema === "string" && !doc.$schema.startsWith("http")) {
    const resolved = path.resolve(path.dirname(filePath), doc.$schema);

    try {
      await fs.access(resolved);
    } catch {
      errors.push(
        `${rel(filePath)}: "$schema" path not found (${doc.$schema})`,
      );
    }
  }

  if (doc.version !== "2025.10") {
    errors.push(`${rel(filePath)}: resolver "version" must be "2025.10"`);
  }

  if (!Array.isArray(doc.resolutionOrder) || doc.resolutionOrder.length === 0) {
    errors.push(
      `${rel(filePath)}: resolver must define non-empty "resolutionOrder"`,
    );
  }

  if (typeof doc.modifiers !== "object" || doc.modifiers === null) {
    errors.push(`${rel(filePath)}: resolver must define "modifiers" object`);
    return;
  }

  const modifierNames = new Set(Object.keys(doc.modifiers));
  for (const entry of doc.resolutionOrder ?? []) {
    const ref = entry?.$ref;
    const match =
      typeof ref === "string" ? ref.match(/^#\/modifiers\/(.+)$/) : null;

    if (!match) continue;
    if (!modifierNames.has(match[1])) {
      errors.push(
        `${rel(filePath)}: resolutionOrder references missing modifier "${match[1]}"`,
      );
    }
  }
}

/**
 * Runs context-preparation checks for each resolver to catch resolution failures.
 *
 * @param {string[]} resolverFiles
 * @param {string[]} errors
 * @returns {void}
 */
function ensureNoResolverSelectionErrors(resolverFiles, errors) {
  for (const resolverPath of resolverFiles) {
    const base = path.basename(resolverPath, ".resolver.json");
    const outTokens = path.join(TMP_VALIDATE_DIR, `${base}.contexts.json`);
    const outManifest = path.join(
      TMP_VALIDATE_DIR,
      `${base}.css-manifest.json`,
    );

    try {
      run("node", [
        "scripts/pipeline/prepare-sd-contexts.mjs",
        "--resolver",
        rel(resolverPath),
        "--out-tokens",
        rel(outTokens),
        "--out-manifest",
        rel(outManifest),
      ]);
    } catch (error) {
      errors.push(
        `${rel(resolverPath)}: failed context preparation (possible unresolved alias or cycle)\n${error.message}`,
      );
    }
  }
}

/**
 * Executes full validation and exits non-zero when any validation fails.
 *
 * @returns {Promise<void>}
 */
async function main() {
  const errors = [];
  await fs.rm(TMP_VALIDATE_DIR, { recursive: true, force: true });
  await fs.mkdir(TMP_VALIDATE_DIR, { recursive: true });
  const tokenFiles = await listFiles(TOKENS_SRC_DIR, (filePath) =>
    filePath.endsWith(".json"),
  );
  const resolverFiles = await listFiles(TOKENS_RESOLVER_DIR, (filePath) =>
    filePath.endsWith(".resolver.json"),
  );

  for (const tokenFile of tokenFiles) {
    await validateTokenFile(tokenFile, errors);
  }
  for (const resolverFile of resolverFiles) {
    await validateResolverFile(resolverFile, errors);
  }

  ensureNoResolverSelectionErrors(resolverFiles, errors);

  if (errors.length > 0) {
    console.error("Token validation failed:");
    for (const err of errors) {
      console.error(`- ${err}`);
    }
    process.exit(1);
  }

  console.log(
    `Validated ${tokenFiles.length} token files and ${resolverFiles.length} resolver files.`,
  );
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
