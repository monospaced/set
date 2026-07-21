#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import Ajv from "ajv/dist/2020.js";

/**
 * Validates each emitted JSON token artifact in `dist/` against the
 * draft-2020-12 JSON Schema in `schemas/tokens.v1.json`.
 *
 * Catches drift between the pipeline's emission shape and the published
 * schema contract. Schema-level checks only — DTCG `$value` internals are
 * out of scope.
 */

const here = path.dirname(fileURLToPath(import.meta.url));
const pkgRoot = path.resolve(here, "..");

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
    `Validated ${tokenFiles.length} JSON token artifacts against tokens.v1.json.`,
  );
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
