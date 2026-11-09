import { createRequire } from "node:module";
import { parseArgs } from "node:util";

import * as p from "@clack/prompts";

import {
  toDescription,
  toPackageName,
  toTitle,
  validatePackageName,
} from "./answers.mjs";
import { VARIANTS } from "./constants.mjs";
import { execute, isEmptyDirectory } from "./execute.mjs";

const { version } = createRequire(import.meta.url)("../package.json");

const USAGE = `Usage: pnpm create @monospaced/set [directory] [options]

Scaffolds a Set site or app into an empty directory. Prompts for anything
not given as a flag; Enter accepts a prompt's default.

Options:
  --name <name>         Package name (default: the directory name)
  --title <title>       Site title (default: from the package name)
  --description <text>  Site description (default: "<title>, built with Set.")
  --variant <variant>   html: pages are HTML you write (default)
                        prerender: pages are render functions, built to HTML
  --defaults            Take every default without prompting
  -h, --help            Show this help
  -v, --version         Show the version
`;

const OPTIONS = {
  defaults: { type: "boolean" },
  description: { type: "string" },
  help: { short: "h", type: "boolean" },
  name: { type: "string" },
  title: { type: "string" },
  variant: { type: "string" },
  version: { short: "v", type: "boolean" },
};

const VARIANT_OPTIONS = [
  { hint: "pages are HTML you write", label: "HTML", value: "html" },
  {
    hint: "pages are render functions, built to HTML",
    label: "Prerender",
    value: "prerender",
  },
];

/** Prompts, or returns `undefined` when the user cancels. */
async function prompt(promise) {
  const value = await promise;
  return p.isCancel(value) ? undefined : value;
}

/**
 * Answers a question from its flag, its default (with `--defaults`), or a
 * prompt: a text field whose hint is the default, or a select when `options`
 * are given.
 */
async function answer(values, key, fallback, { missing, options, ...rest }) {
  if (values[key] !== undefined) return values[key];
  if (values.defaults) return fallback;
  if (!process.stdin.isTTY) {
    throw new Error(
      `No terminal to prompt for the ${key}. ${missing ?? `Pass --${key}`}, or pass --defaults.`,
    );
  }

  return prompt(
    options
      ? p.select({ initialValue: fallback, options, ...rest })
      : p.text({ defaultValue: fallback, placeholder: fallback, ...rest }),
  );
}

/** Resolves the answers, or returns `undefined` when cancelled or refused. */
async function ask(values, positional) {
  const dir =
    positional ??
    (await answer(values, "directory", "set-app", {
      message: "Where should the project be created?",
      missing: "Pass it as the first argument",
    }));
  if (dir === undefined) return;

  if (!isEmptyDirectory(dir)) {
    p.cancel(`${dir} is not empty. Choose an empty or new directory.`);
    return;
  }

  const name = await answer(values, "name", toPackageName(dir), {
    message: "Package name",
    validate: validatePackageName,
  });
  if (name === undefined) return;

  const invalid = validatePackageName(name);
  if (invalid) {
    p.cancel(`${name} is not a valid package name. ${invalid}`);
    return;
  }

  const title = await answer(values, "title", toTitle(name), {
    message: "Site title",
  });
  if (title === undefined) return;

  const description = await answer(
    values,
    "description",
    toDescription(title),
    { message: "Site description" },
  );
  if (description === undefined) return;

  const variant = await answer(values, "variant", VARIANTS[0], {
    message: "How are pages authored?",
    options: VARIANT_OPTIONS,
  });
  if (variant === undefined) return;

  if (!VARIANTS.includes(variant)) {
    p.cancel(`${variant} is not a variant. Use ${VARIANTS.join(" or ")}.`);
    return;
  }

  return { description, dir, name, title, variant };
}

export async function run(argv) {
  let parsed;
  try {
    parsed = parseArgs({
      allowPositionals: true,
      args: argv,
      options: OPTIONS,
    });
  } catch (error) {
    console.error(`${error.message}\n\n${USAGE}`);
    process.exitCode = 1;
    return;
  }

  const { positionals, values } = parsed;

  if (values.help) {
    console.log(USAGE);
    return;
  }

  if (values.version) {
    console.log(version);
    return;
  }

  p.intro(`create-set ${version}`);

  let answers;
  try {
    answers = await ask(values, positionals[0]);
  } catch (error) {
    p.cancel(error.message);
    process.exitCode = 1;
    return;
  }

  if (!answers) {
    p.cancel("Nothing created.");
    process.exitCode = 1;
    return;
  }

  const spinner = p.spinner();
  spinner.start("Creating project");

  try {
    const root = await execute(answers, {
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
