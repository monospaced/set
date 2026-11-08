import { OG_IMAGE } from "./constants.mjs";
import { escapeHtml, renderHelloPage } from "./page.mjs";

const json = (value) => `${JSON.stringify(value, null, 2)}\n`;

export const packageJson = ({ description, name, nodeMajor, pnpmVersion }) => {
  const pnpmMajor = Number(pnpmVersion.split(".")[0]);

  return json({
    name,
    version: "0.0.0",
    description,
    private: true,
    type: "module",
    engines: {
      node: `>=${nodeMajor} <${nodeMajor + 1}`,
      pnpm: `>=${pnpmMajor} <${pnpmMajor + 1}`,
    },
    packageManager: `pnpm@${pnpmVersion}`,
    scripts: {
      build: "vite build",
      dev: "vite",
      format: "prettier --write .",
      "format:check": "prettier --check .",
      lint: "eslint .",
      "lint:fix": "eslint . --fix",
      prepare: "node scripts/sync-set.mjs",
      preview: "vite preview",
      stylelint: 'stylelint "**/*.css" --allow-empty-input',
      "stylelint:fix": 'stylelint "**/*.css" --allow-empty-input --fix',
      test: "vitest run --passWithNoTests",
      typecheck: "tsc --noEmit",
    },
    "lint-staged": {
      "*": "prettier --ignore-unknown --write",
      "*.css": "stylelint --fix",
      "*.{js,mjs,ts}": "eslint --fix",
    },
  });
};

export const indexHtml = ({ description, title }) => `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="color-scheme" content="light dark" />
    <meta name="theme-color" content="#f8fbfb" media="(prefers-color-scheme: light)" />
    <meta name="theme-color" content="#0e0f0f" media="(prefers-color-scheme: dark)" />
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(description)}" />
    <!-- Set the canonical URL and og:url once the site has a domain. -->
    <link rel="canonical" href="https://example.com/" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="${escapeHtml(title)}" />
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:url" content="https://example.com/" />
    <meta property="og:image" content="${OG_IMAGE}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(title)}" />
    <meta name="twitter:description" content="${escapeHtml(description)}" />
    <meta name="twitter:image" content="${OG_IMAGE}" />
    <link rel="icon" href="/favicons/favicon.ico" sizes="32x32" />
    <link rel="icon" href="/favicons/favicon.svg" type="image/svg+xml" />
    <link rel="apple-touch-icon" href="/favicons/apple-touch-icon.png" />
    <link rel="manifest" href="/manifest.webmanifest" />
  </head>
  <body>
    ${renderHelloPage({ title })}
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
`;

export const manifest = ({ description, title }) =>
  json({
    name: title,
    short_name: title,
    description,
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#f8fbfb",
    theme_color: "#f8fbfb",
    icons: [192, 512].flatMap((size) =>
      ["any", "maskable"].map((purpose) => ({
        purpose,
        sizes: `${size}x${size}`,
        src: `/favicons/maskable-icon-${size}.png`,
        type: "image/png",
      })),
    ),
  });

export const mainTs = () => `import "@monospaced/set-assets/fonts.css";
import "@monospaced/set-core/styles.css";
import "./styles.css";

import { defineSetComponents } from "@monospaced/set-core";

defineSetComponents();
`;

export const stylesCss =
  () => `/* Project styles. Compose with Set components first; when something needs
   its own CSS, write it here with Set tokens. */
`;

export const viteConfig =
  () => `import target from "@monospaced/set-config/browserslist/esbuild";
import targets from "@monospaced/set-config/browserslist/lightningcss";
import { defineConfig } from "vite";

export default defineConfig({
  build: { cssMinify: "lightningcss", target },
  css: { lightningcss: { targets }, transformer: "lightningcss" },
});
`;

export const tsconfig = () =>
  json({
    compilerOptions: {
      lib: ["ES2022", "DOM", "DOM.Iterable"],
      module: "ESNext",
      moduleResolution: "Bundler",
      noEmit: true,
      skipLibCheck: true,
      strict: true,
      target: "ES2022",
      types: ["vite/client"],
    },
    include: ["src", "*.config.ts"],
  });

export const eslintConfig =
  () => `import setEslint from "@monospaced/set-config/eslint";

export default [...setEslint];
`;

export const stylelintrc = () => `export default {
  extends: ["@monospaced/set-config/stylelint"],
  ignoreFiles: [".vscode/set.catalog.css", "dist/**"],
};
`;

export const prettierignore = () => `.vscode/set.catalog.css
dist
pnpm-lock.yaml
`;

export const editorconfig = () => `root = true

[*]
charset = utf-8
end_of_line = lf
indent_size = 2
indent_style = space
insert_final_newline = true
trim_trailing_whitespace = true
`;

export const gitignore = () => `node_modules/
dist/
.vscode/set.catalog.css
.claude/skills/
.agents/skills/
.claude/settings.local.json
.claude/.cc-writes/
.DS_Store
.env
.env.*
!.env.example
*.local
`;

export const vscodeSettings = () =>
  json({
    "css.validate": false,
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.formatOnSave": true,
    "stylelint.validate": ["css"],
  });

export const vscodeExtensions = () =>
  json({
    recommendations: [
      "dbaeumer.vscode-eslint",
      "esbenp.prettier-vscode",
      "stylelint.vscode-stylelint",
    ],
  });

export const pnpmWorkspace =
  () => `# Minimum age of a release before it installs, in minutes (3 days).
minimumReleaseAge: 4320
`;

export const syncSet = () => `/*
 * Copies the Set artifacts this project keeps outside node_modules, so a
 * fresh clone or a Set upgrade refreshes them. Runs from \`prepare\`.
 */
import { cpSync, existsSync, rmSync } from "node:fs";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const from = (path) => new URL(\`../node_modules/\${path}\`, import.meta.url);
const to = (path) => new URL(\`../\${path}\`, import.meta.url);

const copy = (source, target) => {
  rmSync(target, { force: true, recursive: true });
  cpSync(source, target, { recursive: true });
};

// Token catalog for editor autocomplete and Stylelint validation.
copy(from("@monospaced/set-config/set.catalog.css"), to(".vscode/set.catalog.css"));

// Guardrails for coding agents, wherever they look for skills.
for (const dir of [".claude/skills", ".agents/skills"]) {
  copy(from("@monospaced/set-skills/src"), to(dir));
}

// Favicons are static files, so they live in public/ rather than being imported.
copy(from("@monospaced/set-assets/src/favicons"), to("public/favicons"));

// Git hooks, where there is a repository to hook into.
if (existsSync(new URL(".git", \`file://\${root}\`))) {
  const { default: husky } = await import("husky");
  const message = husky();
  if (message) console.log(message);
}
`;

export const readme = ({ description, title }) => `# ${title}

${description}

Built with [Set](https://set.monospaced.com), scaffolded by \`@monospaced/create-set\`.

## Scripts

- \`pnpm dev\` / \`pnpm build\` / \`pnpm preview\`
- \`pnpm lint\` / \`pnpm lint:fix\`
- \`pnpm stylelint\` / \`pnpm stylelint:fix\`
- \`pnpm format\` / \`pnpm format:check\`
- \`pnpm typecheck\`
- \`pnpm test\`

Prettier, Stylelint and ESLint fixes run on staged files before every commit via Husky and lint-staged.

## After bootstrapping

- Set the canonical URL and \`og:url\` in \`index.html\` once the site has a domain.
- \`.vscode/set.catalog.css\`, \`.claude/skills/\`, \`.agents/skills/\` and \`public/favicons/\` are copied from Set on every install by \`scripts/sync-set.mjs\`. Upgrade Set to refresh them rather than editing them by hand.
- Markdown content? \`pnpm add @monospaced/set-markdown\` renders GFM to safe HTML that pairs with core's \`prose\` component.
`;
