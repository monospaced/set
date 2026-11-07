import { parseArgs } from "node:util";

import * as p from "@clack/prompts";

import {
  toDescription,
  toPackageName,
  toTitle,
  validatePackageName,
} from "./answers.mjs";
import { execute, isEmptyDirectory } from "./execute.mjs";

const HELP = `Usage: pnpm create @monospaced/set [directory] [options]

Scaffolds a Set site or app into an empty directory.

Options:
  --name <name>               Package name (default: the directory name)
  --title <title>             Site title (default: from the package name)
  --description <text>        Site description
  -y, --yes                   Accept defaults for anything not given
  -h, --help                  Show this help
`;

const OPTIONS = {
  description: { type: "string" },
  help: { short: "h", type: "boolean" },
  name: { type: "string" },
  title: { type: "string" },
  yes: { short: "y", type: "boolean" },
};

/** Prompts, or returns `undefined` when the user cancels. */
async function prompt(promise) {
  const value = await promise;
  return p.isCancel(value) ? undefined : value;
}

/**
 * Resolves the answers from flags, defaults and prompts, in that order of
 * precedence. Returns `undefined` when cancelled or refused.
 */
async function ask(values, positional) {
  const dir =
    positional ??
    (values.yes
      ? "set-app"
      : await prompt(
          p.text({
            defaultValue: "set-app",
            message: "Where should the project be created?",
            placeholder: "set-app",
          }),
        ));
  if (dir === undefined) return;

  if (!isEmptyDirectory(dir)) {
    p.cancel(`${dir} is not empty. Choose an empty or new directory.`);
    return;
  }

  const name =
    values.name ??
    (values.yes
      ? toPackageName(dir)
      : await prompt(
          p.text({
            initialValue: toPackageName(dir),
            message: "Package name",
            validate: validatePackageName,
          }),
        ));
  if (name === undefined) return;

  const invalid = validatePackageName(name);
  if (invalid) {
    p.cancel(`${name} is not a valid package name. ${invalid}`);
    return;
  }

  const title =
    values.title ??
    (values.yes
      ? toTitle(name)
      : await prompt(
          p.text({ initialValue: toTitle(name), message: "Site title" }),
        ));
  if (title === undefined) return;

  const description =
    values.description ??
    (values.yes
      ? toDescription(title)
      : await prompt(
          p.text({
            initialValue: toDescription(title),
            message: "Site description",
          }),
        ));
  if (description === undefined) return;

  return { description, dir, name, title };
}

export async function run(argv) {
  const { positionals, values } = parseArgs({
    allowPositionals: true,
    args: argv,
    options: OPTIONS,
  });

  if (values.help) {
    console.log(HELP);
    return;
  }

  p.intro("create-set");

  const answers = await ask(values, positionals[0]);
  if (!answers) {
    p.cancel("Nothing created.");
    process.exitCode = 1;
    return;
  }

  const spinner = p.spinner();
  spinner.start("Creating project");

  try {
    const root = execute(answers, {
      step: (message) => spinner.message(message),
      warn: (message) => p.log.warn(message),
    });
    spinner.stop(`Created ${root}`);
  } catch (error) {
    spinner.stop("Failed", 1);
    p.log.error(error.message);
    process.exitCode = 1;
    return;
  }

  p.note(`cd ${answers.dir}\npnpm dev`, "Next steps");
  p.outro("Happy building.");
}
