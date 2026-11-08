import { spawnSync } from "node:child_process";
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";

import { DEV_DEPENDENCIES, RUNTIME_DEPENDENCIES } from "./constants.mjs";
import { plan } from "./plan.mjs";

/** True when `dir` does not exist or holds nothing. */
export function isEmptyDirectory(dir) {
  try {
    return readdirSync(dir).length === 0;
  } catch (error) {
    if (error.code === "ENOENT") return true;
    throw error;
  }
}

function run(command, args, cwd) {
  const result = spawnSync(command, args, {
    cwd,
    encoding: "utf8",
    shell: process.platform === "win32",
    stdio: "pipe",
  });

  if (result.error) throw result.error;
  if (result.status !== 0) {
    const output = `${result.stdout}\n${result.stderr}`.trim();
    throw new Error(`\`${command} ${args.join(" ")}\` failed:\n${output}`);
  }

  return result.stdout;
}

const pnpm = (args, cwd) => run("pnpm", args, cwd);

/**
 * Dev harness: with CREATE_SET_PACK_DIR set, Set packages install from the
 * `pnpm pack` tarballs in that directory instead of the registry, so the CLI
 * can be exercised against unreleased packages. Users always get the registry.
 */
function setSpec(name) {
  const packDir = process.env.CREATE_SET_PACK_DIR;
  if (!packDir || !name.startsWith("@monospaced/")) return name;

  const stem = `${name.slice(1).replace("/", "-")}-`;
  const tarball = readdirSync(packDir).find(
    (file) => file.startsWith(stem) && file.endsWith(".tgz"),
  );

  return tarball ? resolve(packDir, tarball) : name;
}
const git = (args, cwd) => run("git", args, cwd);

/**
 * The tools the config package drives, as `name@range` specs. Its presets
 * declare them as peers, so they install at the range it supports rather
 * than at latest, and the preset and the tool always agree.
 */
function configPeerSpecs(root) {
  const manifest = JSON.parse(
    readFileSync(
      join(root, "node_modules/@monospaced/set-config/package.json"),
      "utf8",
    ),
  );

  return Object.entries(manifest.peerDependencies).map(
    ([name, range]) => `${name}@${range}`,
  );
}

/**
 * Writes the project, installs its dependencies live, syncs the Set
 * artifacts and makes the initial commit.
 *
 * @param {{ dir: string } & import("./plan.mjs").Answers} answers
 * @param {{ step(message: string): void, warn(message: string): void }} report
 */
export function execute({ dir, ...answers }, report) {
  const root = resolve(dir);
  const files = plan(answers);

  report.step("Initialising git");
  mkdirSync(root, { recursive: true });
  git(["init", "--initial-branch=main"], root);

  report.step("Writing files");
  for (const [path, content] of Object.entries(files)) {
    const target = join(root, path);
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, content);
  }

  // Lifecycle scripts wait until everything `prepare` needs is installed.
  report.step("Installing Set");
  pnpm(["add", "--ignore-scripts", ...RUNTIME_DEPENDENCIES.map(setSpec)], root);

  report.step("Installing tooling");
  pnpm(
    ["add", "--ignore-scripts", "--save-dev", ...DEV_DEPENDENCIES.map(setSpec)],
    root,
  );
  pnpm(
    ["add", "--ignore-scripts", "--save-dev", ...configPeerSpecs(root)],
    root,
  );

  // Explicit: `pnpm install` skips lifecycle scripts when nothing changed.
  report.step("Syncing Set artifacts and git hooks");
  pnpm(["run", "prepare"], root);

  report.step("Formatting");
  pnpm(["exec", "prettier", "--write", "."], root);

  report.step("Committing");
  git(["add", "--all"], root);
  try {
    git(
      ["commit", "--message", "chore: bootstrap with @monospaced/create-set"],
      root,
    );
  } catch (error) {
    report.warn(`Initial commit skipped. ${error.message}`);
  }

  return root;
}
