#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";

/**
 * Pipeline stage that emits a CSS catalog file for editor and tooling lookup.
 *
 * Reads the public token CSS files produced earlier in the pipeline,
 * extracts the default-context `--set-*` declarations, and emits a
 * combined `:root { ... }` block. The output ships at
 * `@monospaced/set-config/set.catalog.css`; consumers drop it into
 * their editor's CSS-data directory (e.g. `.vscode/`) for typeahead +
 * value hover, and the @monospaced/set-config stylelint plugin reads
 * it to validate `var(--set-*)` references.
 */

const cwd = process.cwd();

/**
 * Parses required CLI flags and validates invocation shape.
 *
 * @param {string[]} argv
 * @returns {{ inputs: string[], out: string }}
 */
function parseArgs(argv) {
  const inputs = [];
  let out;

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];

    if (arg === "--input") {
      inputs.push(argv[i + 1]);
      i += 1;
    } else if (arg === "--out") {
      out = argv[i + 1];
      i += 1;
    }
  }

  if (inputs.length === 0 || typeof out !== "string") {
    throw new Error(
      "Usage: node scripts/pipeline/prepare-catalog-output.mjs --input <css> [--input <css> ...] --out <output.css>",
    );
  }

  return { inputs, out };
}

/**
 * Extracts `--set-*` declarations from a CSS file's text, returning the
 * default-context value for each name (first sighting wins).
 *
 * @param {string} cssText
 * @returns {Map<string, string>}
 */
function extractDeclarations(cssText) {
  const decls = new Map();
  // First-sighting wins: SD emits the default-context `:where(.set)` block
  // before any media-query / state overrides, so the first match for each
  // var name carries the default value.
  const declRegex =
    /^\s*(--set-[a-z0-9-]+)\s*:\s*([^;\n]+?);(?:\s*(\/\*\*[\s\S]*?\*\/))?\s*$/gm;

  for (const match of cssText.matchAll(declRegex)) {
    const [, name, value, comment] = match;

    if (decls.has(name)) continue;
    decls.set(
      name,
      comment ? `${value.trim()}; ${comment.trim()}` : `${value.trim()};`,
    );
  }

  return decls;
}

const HEADER = `/*!
 * Set token catalog. Lookup file for editor autocomplete and tooling
 * (e.g. stylelint validation). Place in your editor's CSS-data directory
 * (\`.vscode/\` for VS Code) for \`--set-*\` autocomplete in CSS files.
 *
 * Generated; do not edit.
 */
`;

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const outPath = path.resolve(cwd, args.out);

  const merged = new Map();

  for (const input of args.inputs) {
    const cssText = await fs.readFile(path.resolve(cwd, input), "utf8");
    const decls = extractDeclarations(cssText);

    for (const [name, body] of decls) {
      if (!merged.has(name)) merged.set(name, body);
    }
  }

  const sortedNames = Array.from(merged.keys()).sort();
  const lines = sortedNames.map((name) => `  ${name}: ${merged.get(name)}`);

  const output = `${HEADER}:root {\n${lines.join("\n")}\n}\n`;

  await fs.mkdir(path.dirname(outPath), { recursive: true });
  await fs.writeFile(outPath, output, "utf8");

  console.log(
    `Wrote token catalog: ${path.relative(cwd, outPath)} (${sortedNames.length} vars from ${args.inputs.length} source(s))`,
  );
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
