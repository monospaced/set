#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";

/**
 * Pipeline entrypoint for building all resolver-discovered token targets.
 *
 * This script prepares context/manifest inputs, runs Style Dictionary for
 * public + private CSS outputs in a single invocation per resolver target.
 */

const cwd = process.cwd();

/**
 * Builds a normalized POSIX-style path for stable CLI/env handoff.
 *
 * @param {...string} parts
 * @returns {string}
 */
function normalizePath(...parts) {
  return path.join(...parts).replaceAll(path.sep, "/");
}

/**
 * Derives output artifact paths for a resolver using naming conventions.
 *
 * @param {string} resolverPath
 * @param {Record<string, unknown>} resolverDoc
 * @returns {{
 *  key: string,
 *  resolver: string,
 *  out: string,
 *  outPrivate: string,
 *  contexts: string,
 *  manifest: string
 * }}
 */
function buildTargetConfigFromResolver(resolverPath, resolverDoc) {
  const resolverBase = path.basename(resolverPath);
  const resolverName = resolverBase.replace(/\.resolver\.json$/, "");
  const buildDefs = resolverDoc?.$defs?.build ?? {};
  const namespace =
    typeof buildDefs.namespace === "string" && buildDefs.namespace.length > 0
      ? buildDefs.namespace
      : "set";
  const brand =
    typeof buildDefs.brand === "string" && buildDefs.brand.length > 0
      ? buildDefs.brand
      : null;
  const outputKey = brand ?? resolverName;
  const fileBase = `${namespace}.${outputKey}`;

  return {
    key: outputKey,
    resolver: normalizePath("resolver", resolverBase),
    out: normalizePath("dist", "css", `${fileBase}.tokens.css`),
    outPrivate: normalizePath(
      "dist",
      "private",
      "css",
      `${fileBase}.primitives.css`,
    ),
    contexts: normalizePath("build", "sd", `${fileBase}.contexts.json`),
    manifest: normalizePath("build", "sd", `${fileBase}.css-manifest.json`),
    // JSON is published by the sibling `@measured/set-tokens` package;
    // the pipeline writes the artifact directly into that package's `dist`
    // (one cross-package path constant kept here in lieu of duplicating the
    // emission logic). Schema source lives in tokens too, see
    // `prepare-json-output.mjs` for the `$schema` ref it embeds.
    json: normalizePath("..", "tokens", "dist", `${fileBase}.tokens.json`),
  };
}

/**
 * Discovers resolver files and returns ordered build target configs.
 *
 * @returns {Promise<Array<{
 *  key: string,
 *  resolver: string,
 *  out: string,
 *  outPrivate: string,
 *  contexts: string,
 *  manifest: string
 * }>>}
 */
async function discoverBuildTargets() {
  const resolverDir = path.join(cwd, "resolver");
  const entries = await fs.readdir(resolverDir, { withFileTypes: true });
  const resolvers = entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".resolver.json"))
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b));
  const targets = [];

  for (const resolverFile of resolvers) {
    const resolverPath = path.join(resolverDir, resolverFile);
    const resolverDoc = JSON.parse(await fs.readFile(resolverPath, "utf8"));
    targets.push(buildTargetConfigFromResolver(resolverPath, resolverDoc));
  }

  // Keep dependency-aware and deterministic build order: base first, then other targets alphabetically.
  targets.sort((a, b) => {
    if (a.key === "base") return -1;
    if (b.key === "base") return 1;
    return a.key.localeCompare(b.key);
  });

  return targets;
}

/**
 * Executes a command and throws with captured output on failure.
 *
 * @param {string} cmd
 * @param {string[]} args
 * @param {import("node:child_process").SpawnSyncOptions} [opts={}]
 * @returns {import("node:child_process").SpawnSyncReturns<string>}
 */
function run(cmd, args, opts = {}) {
  const res = spawnSync(cmd, args, {
    cwd,
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
 * Builds all discovered token targets and emits public/private CSS artifacts.
 *
 * @returns {Promise<void>}
 */
async function main() {
  const buildTargets = await discoverBuildTargets();
  const outputs = [];

  for (const cfg of buildTargets) {
    run("node", [
      "scripts/pipeline/prepare-sd-contexts.mjs",
      "--resolver",
      cfg.resolver,
      "--out-tokens",
      cfg.contexts,
      "--out-manifest",
      cfg.manifest,
    ]);

    run(
      "pnpm",
      [
        "exec",
        "style-dictionary",
        "build",
        "--config",
        "style-dictionary.config.mjs",
      ],
      {
        env: {
          ...process.env,
          TOKENS_CONTEXTS_FILE: path.resolve(cwd, cfg.contexts),
          TOKENS_MANIFEST_FILE: path.resolve(cwd, cfg.manifest),
          TOKENS_CSS_OUT: path.resolve(cwd, cfg.out),
          TOKENS_CSS_PRIVATE_OUT: path.resolve(cwd, cfg.outPrivate),
        },
      },
    );

    run("node", [
      "scripts/pipeline/prepare-json-output.mjs",
      "--resolver",
      cfg.resolver,
      "--out",
      cfg.json,
    ]);

    outputs.push(cfg);
  }

  // Token catalog CSS — derived from the per-target public CSS already
  // emitted above. Combines the cross-brand base surface with the canonical
  // brand (mnsp) so consumers get a single file to drop into their editor's
  // CSS-data directory (or to be consumed by tooling like the stylelint
  // plugin). Cross-writes into `@measured/set-config` (no build of its
  // own; mirrors the tokens-package pattern).
  const catalogSources = outputs.filter(
    (cfg) => cfg.key === "base" || cfg.key === "mnsp",
  );
  const catalogOut = normalizePath("..", "config", "set.catalog.css");

  if (catalogSources.length > 0) {
    const args = ["scripts/pipeline/prepare-catalog-output.mjs"];

    for (const cfg of catalogSources) {
      args.push("--input", cfg.out);
    }

    args.push("--out", catalogOut);
    run("node", args);
  }

  console.log(
    `Built token artifacts:\n${outputs
      .map(
        (cfg) =>
          `- CSS: ${cfg.out}\n  Private primitive CSS: ${cfg.outPrivate}\n  Consumer JSON: ${cfg.json}\n  Contexts JSON: ${cfg.contexts}\n  CSS manifest: ${cfg.manifest}`,
      )
      .join("\n")}\n- Token catalog: ${catalogOut}`,
  );
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
