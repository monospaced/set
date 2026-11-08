import * as templates from "./templates.mjs";
import { NODE_MAJOR, PNPM_VERSION } from "./toolchain.mjs";

/**
 * @typedef {object} Answers
 * @property {string} name Package name.
 * @property {string} title Site title.
 * @property {string} description Site description.
 */

/**
 * Every file the CLI writes, keyed by path relative to the project root.
 * Pure: the same answers always give the same files. Dependencies are not
 * here; they are installed live by `execute`.
 *
 * @param {Answers} answers
 * @returns {Record<string, string>}
 */
export function plan(answers) {
  const context = {
    ...answers,
    nodeMajor: NODE_MAJOR,
    pnpmVersion: PNPM_VERSION,
  };

  return {
    ".editorconfig": templates.editorconfig(),
    ".gitignore": templates.gitignore(),
    ".husky/pre-commit": "pnpm exec lint-staged\n",
    ".node-version": `${NODE_MAJOR}\n`,
    ".prettierignore": templates.prettierignore(),
    ".stylelintrc.mjs": templates.stylelintrc(),
    ".vscode/extensions.json": templates.vscodeExtensions(),
    ".vscode/settings.json": templates.vscodeSettings(),
    "README.md": templates.readme(context),
    "eslint.config.mjs": templates.eslintConfig(),
    "index.html": templates.indexHtml(context),
    "package.json": templates.packageJson(context),
    "pnpm-workspace.yaml": templates.pnpmWorkspace(),
    "public/manifest.webmanifest": templates.manifest(context),
    "scripts/sync-set.mjs": templates.syncSet(),
    "src/main.ts": templates.mainTs(),
    "src/styles.css": templates.stylesCss(),
    "tsconfig.json": templates.tsconfig(),
    "vite.config.ts": templates.viteConfig(),
  };
}
