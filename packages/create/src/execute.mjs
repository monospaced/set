import { spawn } from "node:child_process";
import {
  appendFileSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, resolve } from "node:path";

import {
  REACT_RUNTIME_DEPENDENCIES,
  RUNTIME_DEPENDENCIES,
  SET_DEV_DEPENDENCIES,
} from "./constants.mjs";
import { plan } from "./plan.mjs";
import { REACT, TOOLING } from "./toolchain.mjs";

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
const packDir = process.env.CREATE_SET_PACK_DIR;

/** Packed Set packages, by name, from the tarball filenames. */
function packed() {
  if (!packDir) return {};

  return Object.fromEntries(
    readdirSync(packDir)
      .filter((file) => file.endsWith(".tgz"))
      .map((file) => [
        `@${file.replace(/-\d+\.\d+\.\d+.*\.tgz$/, "").replace("-", "/")}`,
        resolve(packDir, file),
      ]),
  );
}

function setSpec(name) {
  return packed()[name] ?? name;
}

/**
 * The packed packages also as pnpm overrides, so a packed core resolves the
 * packed icons it depends on rather than a registry version that may not be
 * published yet. Appended to the generated workspace file in harness mode.
 */
function packOverrides() {
  const entries = Object.entries(packed());
  if (entries.length === 0) return "";

  return `
# Dev harness: Set packages from CREATE_SET_PACK_DIR, transitively too.
overrides:
${entries.map(([name, tarball]) => `  "${name}": "file:${tarball}"`).join("\n")}
`;
}
const git = (args, cwd) => run("git", args, cwd);

const specs = (dependencies) =>
  Object.entries(dependencies).map(([name, range]) => `${name}@${range}`);

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

  return specs(manifest.peerDependencies);
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
  const react = answers.variant === "react";

  report.step("Initialising git");
  mkdirSync(root, { recursive: true });
  await git(["init", "--initial-branch=main"], root);

  report.step("Writing files");
  for (const [path, content] of Object.entries(files)) {
    const target = join(root, path);
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, content);
  }
  appendFileSync(join(root, "pnpm-workspace.yaml"), packOverrides());

  // Lifecycle scripts wait until everything `prepare` needs is installed.
  report.step("Installing Set");
  await pnpm(
    [
      "add",
      "--ignore-scripts",
      ...RUNTIME_DEPENDENCIES.map(setSpec),
      ...(react ? REACT_RUNTIME_DEPENDENCIES.map(setSpec) : []),
      ...(react ? specs(REACT.dependencies) : []),
    ],
    root,
  );

  report.step("Installing tooling");
  await pnpm(
    [
      "add",
      "--ignore-scripts",
      "--save-dev",
      ...SET_DEV_DEPENDENCIES.map(setSpec),
      ...specs(TOOLING),
      ...(react ? specs(REACT.devDependencies) : []),
    ],
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
