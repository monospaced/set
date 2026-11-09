import { spawn } from "node:child_process";
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

/** Runs a command to completion, off the event loop so Ctrl-C still works. */
function run(command, args, cwd) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd,
      shell: process.platform === "win32",
      stdio: ["ignore", "pipe", "pipe"],
    });
    let output = "";
    child.stdout.on("data", (chunk) => (output += chunk));
    child.stderr.on("data", (chunk) => (output += chunk));
    child.on("error", reject);
    child.on("close", (status) => {
      if (status === 0) resolve(output);
      else {
        reject(
          new Error(
            `\`${command} ${args.join(" ")}\` failed:\n${output.trim()}`,
          ),
        );
      }
    });
  });
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
export async function execute({ dir, ...answers }, report) {
  const root = resolve(dir);
  const files = plan(answers);

  report.step("Initialising git");
  mkdirSync(root, { recursive: true });
  await git(["init", "--initial-branch=main"], root);

  report.step("Writing files");
  for (const [path, content] of Object.entries(files)) {
    const target = join(root, path);
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, content);
  }

  // Lifecycle scripts wait until everything `prepare` needs is installed.
  report.step("Installing Set");
  await pnpm(
    ["add", "--ignore-scripts", ...RUNTIME_DEPENDENCIES.map(setSpec)],
    root,
  );

  report.step("Installing tooling");
  await pnpm(
    ["add", "--ignore-scripts", "--save-dev", ...DEV_DEPENDENCIES.map(setSpec)],
    root,
  );
  await pnpm(
    ["add", "--ignore-scripts", "--save-dev", ...configPeerSpecs(root)],
    root,
  );

  // Explicit: `pnpm install` skips lifecycle scripts when nothing changed.
  report.step("Syncing Set artifacts and git hooks");
  await pnpm(["run", "prepare"], root);

  report.step("Formatting");
  await pnpm(["exec", "prettier", "--write", "."], root);

  report.step("Committing");
  await git(["add", "--all"], root);
  try {
    await git(
      ["commit", "--message", "chore: bootstrap with @monospaced/create-set"],
      root,
    );
  } catch (error) {
    report.warn(`Initial commit skipped. ${error.message}`);
  }

  return root;
}
