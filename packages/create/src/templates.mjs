import { OG_IMAGE } from "./constants.mjs";
import { escapeHtml, renderHelloPage, themeBootstrap } from "./page.mjs";

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
      "*.{js,jsx,mjs,ts,tsx}": "eslint --fix",
    },
  });
};

export const indexHtml = ({ description, title, variant }) => `<!doctype html>
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
${
  variant === "react"
    ? `    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>`
    : `    ${renderHelloPage({ editHint: "index.html", title })}
    <script type="module" src="/src/main.ts"></script>`
}
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

export const viteConfig = ({ variant }) => {
  const prerender = variant === "prerender";
  const react = variant === "react";

  return `import { globSync } from "node:fs";

import target from "@monospaced/set-config/browserslist/esbuild";
import targets from "@monospaced/set-config/browserslist/lightningcss";
${react ? 'import react from "@vitejs/plugin-react";\n' : ""}import { defineConfig${prerender ? ", type Plugin" : ""} } from "${react ? "vitest/config" : "vite"}";
${
  prerender
    ? `
import { renderDocument } from "./src/document.ts";
import { pages } from "./src/pages.ts";
`
    : ""
}
// Every index.html is a page; its folder is its route.
const input = globSync("**/index.html", {
  exclude: ["dist/**", "node_modules/**"],
});
${
  prerender
    ? `
// Renders each route's document from src/pages at dev and build time, so the
// render functions never ship to the browser. The page modules are imported
// above, so the dev server restarts when one changes.
const prerender: Plugin = {
  name: "set-prerender",
  transformIndexHtml: {
    order: "pre",
    handler: (_html, { path }) => {
      const route = path.replace(/index\\.html$/, "");
      const page = pages[route];
      if (!page) throw new Error(\`No page for \${route}. Add it to src/pages.ts.\`);
      return renderDocument(page, route);
    },
  },
};
`
    : ""
}
export default defineConfig({
  build: { cssMinify: "lightningcss", rollupOptions: { input }, target },
  css: { lightningcss: { targets }, transformer: "lightningcss" },${
    prerender ? "\n  plugins: [prerender]," : ""
  }${react ? '\n  plugins: [react()],\n  test: { environment: "jsdom" },' : ""}
});
`;
};

export const mainTsx = () => `import "@monospaced/set-assets/fonts.css";
import "@monospaced/set-core/styles.css";
import "./styles.css";

import { SET_LIGHTSWITCH_STORAGE_KEY } from "@monospaced/set-core";
import { defineSetAll } from "@monospaced/set-react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { App } from "./App.tsx";

defineSetAll();

// A stored lightswitch override paints from the first render; Lightswitch
// keeps it in sync after mount.
function storedTheme(): "light" | "dark" | undefined {
  try {
    const theme = localStorage.getItem(SET_LIGHTSWITCH_STORAGE_KEY);
    return theme === "light" || theme === "dark" ? theme : undefined;
  } catch {
    return undefined;
  }
}

const container = document.getElementById("root");
if (!container) throw new Error("#root not found");

createRoot(container).render(
  <StrictMode>
    <App theme={storedTheme()} />
  </StrictMode>,
);
`;

export const appTsx = ({ title }) => `import {
  Box,
  Container,
  Heading,
  Inline,
  Lightswitch,
  Page,
  Root,
  Stack,
  Text,
} from "@monospaced/set-react";

export function App({ theme }: { theme?: "light" | "dark" }) {
  return (
    <Root appOverscrollBehavior="none" appRoot theme={theme}>
      <Page
        footer={null}
        header={
          <Container maxInlineSize="none">
            <Box background="transparent" paddingBlock="2xs" paddingInline="none">
              <Inline gap="sm" justify="between">
                <Heading size="md">${escapeHtml(title)}</Heading>
                <Lightswitch size="sm" />
              </Inline>
            </Box>
          </Container>
        }
        headerBorder="always"
        headerSize="sm"
      >
        <Container>
          <Box paddingBlock="lg" paddingInline="none" responsive>
            <Stack gap="md">
              <Heading level={1} responsive size="xl">
                Hello, world
              </Heading>
              <Text as="p" responsive size="sm">
                Edit <code>src/App.tsx</code> to begin.
              </Text>
            </Stack>
          </Box>
        </Container>
      </Page>
    </Root>
  );
}
`;

export const routeStub = () => `<!doctype html>
<!-- Route marker. This page is rendered from src/pages.ts by the plugin in vite.config.ts. -->
`;

export const siteTs = ({ description, title }) => `export const site = {
  name: ${JSON.stringify(title)},
  description: ${JSON.stringify(description)},
  // Set once the site has a domain; canonical and og:url derive from it.
  url: "https://example.com",
  ogImage: ${JSON.stringify(OG_IMAGE)},
};
`;

export const documentTs = () => `import {
  renderSetBox,
  renderSetContainer,
  renderSetHeading,
  renderSetInline,
  renderSetLightswitch,
  renderSetPage,
  renderSetRoot,
} from "@monospaced/set-core";

import { site } from "./site.ts";

export interface Page {
  /** Page title. The site name alone when omitted. */
  title?: string;
  /** Meta description. The site description when omitted. */
  description?: string;
  /** The main region, from Set's render functions. */
  render: () => string | Promise<string>;
}

const escapeHtml = (value: string): string =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

/*
 * Stamps a stored lightswitch override onto the root before its content
 * parses, so an overridden theme paints correctly on first load. Must be the
 * root's first child: earlier and the root doesn't exist yet, later and
 * content above it may already have painted in the wrong theme.
 */
const themeBootstrap = ${JSON.stringify(themeBootstrap)};

const header = (): string =>
  renderSetContainer({
    maxInlineSize: "none",
    children: renderSetBox({
      background: "transparent",
      paddingBlock: "2xs",
      paddingInline: "none",
      children: renderSetInline({
        gap: "sm",
        justify: "between",
        children:
          renderSetHeading({ children: escapeHtml(site.name), size: "md" }) +
          renderSetLightswitch({ size: "sm" }),
      }),
    }),
  });

/** The full HTML document for \`page\` at \`route\`. */
export async function renderDocument(page: Page, route: string): Promise<string> {
  const title = page.title ? \`\${page.title} | \${site.name}\` : site.name;
  const description = page.description ?? site.description;
  const url = \`\${site.url}\${route}\`;

  // Page always renders its footer region; the starter leaves it empty.
  const body = renderSetRoot({
    appOverscrollBehavior: "none",
    appRoot: true,
    children:
      themeBootstrap +
      renderSetPage({
        children: await page.render(),
        footer: "",
        header: header(),
        headerBorder: "always",
        headerSize: "sm",
      }),
  });

  return \`<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="color-scheme" content="light dark" />
    <meta name="theme-color" content="#f8fbfb" media="(prefers-color-scheme: light)" />
    <meta name="theme-color" content="#0e0f0f" media="(prefers-color-scheme: dark)" />
    <title>\${escapeHtml(title)}</title>
    <meta name="description" content="\${escapeHtml(description)}" />
    <link rel="canonical" href="\${escapeHtml(url)}" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="\${escapeHtml(site.name)}" />
    <meta property="og:title" content="\${escapeHtml(title)}" />
    <meta property="og:description" content="\${escapeHtml(description)}" />
    <meta property="og:url" content="\${escapeHtml(url)}" />
    <meta property="og:image" content="\${site.ogImage}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="\${escapeHtml(title)}" />
    <meta name="twitter:description" content="\${escapeHtml(description)}" />
    <meta name="twitter:image" content="\${site.ogImage}" />
    <link rel="icon" href="/favicons/favicon.ico" sizes="32x32" />
    <link rel="icon" href="/favicons/favicon.svg" type="image/svg+xml" />
    <link rel="apple-touch-icon" href="/favicons/apple-touch-icon.png" />
    <link rel="manifest" href="/manifest.webmanifest" />
  </head>
  <body>
    \${body}
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
\`;
}
`;

export const pagesTs = () => `import type { Page } from "./document.ts";
import index from "./pages/index.ts";

/** Routes to pages. A route is a folder holding an index.html; add both. */
export const pages: Record<string, Page> = {
  "/": index,
};
`;

export const indexPageTs = () => `import {
  renderSetBox,
  renderSetContainer,
  renderSetHeading,
  renderSetStack,
  renderSetText,
} from "@monospaced/set-core";

import type { Page } from "../document.ts";

const page: Page = {
  render: () =>
    renderSetContainer({
      children: renderSetBox({
        paddingBlock: "lg",
        paddingInline: "none",
        responsive: true,
        children: renderSetStack({
          gap: "md",
          children:
            renderSetHeading({
              children: "Hello, world",
              level: 1,
              responsive: true,
              size: "xl",
            }) +
            renderSetText({
              as: "p",
              children: "Edit <code>src/pages/index.ts</code> to begin.",
              responsive: true,
              size: "sm",
            }),
        }),
      }),
    }),
};

export default page;
`;

export const tsconfig = ({ variant }) =>
  json({
    compilerOptions: {
      allowImportingTsExtensions: true,
      ...(variant === "react" ? { jsx: "react-jsx" } : {}),
      lib: ["ES2022", "DOM", "DOM.Iterable"],
      module: "ESNext",
      moduleResolution: "Bundler",
      noEmit: true,
      skipLibCheck: true,
      strict: true,
      target: "ES2022",
      types: ["node", "vite/client"],
    },
    include: ["src", "*.config.ts"],
  });

export const eslintConfig = ({
  variant,
}) => `import setEslint from "@monospaced/set-config/eslint${variant === "react" ? "/react" : ""}";

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
# Set's own packages install as soon as they are released.
minimumReleaseAgeExclude:
  - "@monospaced/*"
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

export const ciYml = () => `name: ci

on:
  pull_request:
  push:
    branches:
      - main

permissions:
  contents: read

jobs:
  check:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v6

      - name: Setup pnpm
        uses: pnpm/action-setup@v6

      - name: Setup Node
        uses: actions/setup-node@v6
        with:
          node-version-file: .node-version
          cache: pnpm

      - name: Install
        run: pnpm install --frozen-lockfile

      - name: Lint
        run: pnpm run lint

      - name: Stylelint
        run: pnpm run stylelint

      - name: Format check
        run: pnpm run format:check

      - name: Typecheck
        run: pnpm run typecheck

      - name: Test
        run: pnpm run test

      - name: Build
        run: pnpm run build
`;

export const dependabotYml = () => `version: 2
updates:
  - package-ecosystem: npm
    directory: /
    schedule:
      interval: weekly
    # Mirrors minimumReleaseAge in pnpm-workspace.yaml, so proposals stay
    # installable under it.
    cooldown:
      default-days: 3
    groups:
      minor-and-patch:
        update-types:
          - minor
          - patch

  - package-ecosystem: github-actions
    directory: /
    schedule:
      interval: weekly
`;

export const readme = ({ description, title, variant }) => {
  const pages =
    variant === "react"
      ? `## Pages

This variant is an app: one \`index.html\`, rendered on the client by React from \`src/main.tsx\`. \`src/App.tsx\` composes the page from \`@monospaced/set-react\` components, and \`Root\` takes its initial \`theme\` from the stored lightswitch choice so an overridden theme paints from the first render. Routes live in React, not in folders; for a site with pages as files, the \`prerender\` variant of \`@monospaced/create-set\` renders them from code.

Component tests run in jsdom (\`test.environment\` in \`vite.config.ts\`).
`
      : variant === "prerender"
        ? `## Pages

A page is a folder with an \`index.html\` route marker and a module in \`src/pages\` that exports its title, description and a \`render()\` built from Set's render functions. \`src/pages.ts\` maps routes to modules, and \`src/document.ts\` wraps each page in the shared head and shell at build time. To add \`/about/\`:

1. Copy \`index.html\` to \`about/index.html\`.
2. Add \`src/pages/about.ts\` (or \`src/pages/about/index.ts\`, to keep content beside it).
3. Register it in \`src/pages.ts\`.

\`renderDocument\` in \`src/document.ts\` owns the shell around every page and receives the route, so a nav in its header can mark the current link (\`current: "page"\` on \`renderSetLink\`) by comparing hrefs to it.

Page modules are imported by \`vite.config.ts\`, so the dev server restarts when one changes rather than hot-replacing. Keep them to render functions and data: no CSS imports and no DOM at the top level, so \`main.ts\` can import one to re-render on the client.

For Markdown content, read the file beside the page and render it in \`Prose\` with \`@monospaced/set-markdown\` (\`pnpm add @monospaced/set-markdown\`):

\`\`\`ts
import { readFileSync } from "node:fs";

import { renderSetProse } from "@monospaced/set-core";
import { processMarkdown } from "@monospaced/set-markdown";

const content = readFileSync(new URL("./content.md", import.meta.url), "utf8");

export default {
  title: "About",
  render: () => renderSetProse({ children: processMarkdown(content) }),
};
\`\`\`
`
        : `## Pages

A page is a folder with an \`index.html\`; its path is its URL (\`about/index.html\` is \`/about/\`). Vite discovers them, so adding a page is adding the folder. Each page carries its own head and its own \`<script type="module" src="/src/main.ts">\`; copy \`index.html\` to start one. When keeping the heads in step by hand becomes a chore, the \`prerender\` variant of \`@monospaced/create-set\` renders pages from code with one shared head.
`;

  return `# ${title}

${description}

Built with [Set](https://set.monospaced.com), scaffolded by \`@monospaced/create-set\`.

## Scripts

- \`pnpm dev\` / \`pnpm build\` / \`pnpm preview\`
- \`pnpm lint\` / \`pnpm lint:fix\`
- \`pnpm stylelint\` / \`pnpm stylelint:fix\`
- \`pnpm format\` / \`pnpm format:check\`
- \`pnpm typecheck\`
- \`pnpm test\`

Prettier, Stylelint and ESLint fixes run on staged files before every commit via Husky and lint-staged. CI runs the same checks plus typecheck, test and build on every pull request (\`.github/workflows/ci.yml\`), and Dependabot proposes grouped updates weekly.

${pages}
## After bootstrapping

- ${
    variant === "prerender"
      ? "Set `url` in `src/site.ts` once the site has a domain; canonical URLs derive from it."
      : "Set the canonical URL and `og:url` in `index.html` once the site has a domain."
  }
- \`.vscode/set.catalog.css\`, \`.claude/skills/\`, \`.agents/skills/\` and \`public/favicons/\` are copied from Set on every install by \`scripts/sync-set.mjs\`. Upgrade Set to refresh them rather than editing them by hand.
${
  variant === "prerender"
    ? ""
    : "- Markdown content? `pnpm add @monospaced/set-markdown` renders GFM to safe HTML that pairs with core's `prose` component.\n"
}`;
};
