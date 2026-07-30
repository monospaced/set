Set turns Monospaced's brand system into code: components, CSS, tokens, assets, and tooling for web projects. Set's public packages are split by responsibility.

- `@monospaced/set-assets`: fonts and favicons
- `@monospaced/set-config`: linting and editor tooling
- `@monospaced/set-core`: primary components and CSS
- `@monospaced/set-markdown`: Markdown rendering utility
- `@monospaced/set-react`: React components for web applications
- `@monospaced/set-skills`: agent and team guardrails
- `@monospaced/set-tokens`: structured data for agents and tooling

## Choose an integration route

Choose the route that matches how your project renders UI. Both routes use the same components, CSS, tokens, fonts, and tooling rules.

1. **HTML/SSR**. Use `@monospaced/set-core` directly if rendering HTML on the server, building an Eleventy or Astro-style site, or want framework-neutral output.
2. **React**. Use `@monospaced/set-react` when building a React app.

## Install for HTML/SSR

Install the core runtime, CSS, and recommended tooling packages:

```sh
pnpm add @monospaced/set-core @monospaced/set-assets
pnpm add -D eslint stylelint @monospaced/set-config @monospaced/set-skills @monospaced/set-tokens
```

## Install for React

Install the React adapter alongside the shared core and assets packages:

```sh
pnpm add react react-dom @monospaced/set-react @monospaced/set-core @monospaced/set-assets
pnpm add -D eslint stylelint @monospaced/set-config @monospaced/set-skills @monospaced/set-tokens
```

## Load fonts and CSS

Load fonts before Set core styles. This is the current setup for both HTML and React consumers:

```css
@import "@monospaced/set-assets/fonts.css";
@import "@monospaced/set-core/styles.css";
```

If your stack prefers JS entrypoints, keep the same order:

```ts
import "@monospaced/set-assets/fonts.css";
import "@monospaced/set-core/styles.css";
```

For app icons, copy the favicon assets from `@monospaced/set-assets` into your static public directory and reference them from root-relative URLs.

## Set the Set root

Wrap every Set UI in a Root component. Use `renderSetRoot` for HTML/SSR output, `<Root>` in React.

### HTML/SSR example

Render HTML with `@monospaced/set-core` component renderers:

```ts
import {
  defineSetComponents,
  renderSetBox,
  renderSetButton,
  renderSetHeading,
  renderSetRoot,
  renderSetStack,
  renderSetText,
} from "@monospaced/set-core";

const page = renderSetRoot({
  appRoot: true,
  children: renderSetBox({
    paddingBlock: "lg",
    paddingInline: "lg",
    responsive: true,
    children: renderSetStack({
      gap: "sm",
      children: [
        renderSetHeading({ level: 1, text: "Hello" }),
        renderSetText({ as: "p", children: "Set is wired up." }),
        renderSetButton({ label: "Continue" }),
      ].join(""),
    }),
  }),
});

// Register Set components once in the browser.
defineSetComponents();
```

### React example

```tsx
import {
  defineSetAll,
  Button,
  Heading,
  Root,
  Stack,
  Text,
} from "@monospaced/set-react";

// Register Set components once at app startup.
defineSetAll();

export function App() {
  return (
    <Root appRoot>
      <Stack gap="sm" responsive>
        <Heading level={1}>Hello</Heading>
        <Text as="p">Set is wired up.</Text>
        <Button label="Continue" />
      </Stack>
    </Root>
  );
}
```

### Root output

Both routes emit the markup that Set styles target:

```html
<div class="set" data-set-brand="mnsp">...</div>
```

## Theme and surface

Theme and surface are part of the component model. By default, Set follows the user's light or dark mode preference. Force a theme with the Root `theme` prop when needed, and use Surface or component-level `surface` props for local color context.

- Root `theme` accepts `light` or `dark`.
- Surface `variant` accepts `default` or `brand`.
- Surface `contentTheme` accepts `light` or `dark` when foreground content needs to be locked to a specific theme.

```ts
import { renderSetRoot, renderSetSurface } from "@monospaced/set-core";

const html = renderSetRoot({
  theme: "dark",
  children: renderSetSurface({
    variant: "brand",
    contentTheme: "light",
    children: "...",
  }),
});
```

```tsx
import { Root, Surface } from "@monospaced/set-react";

export function Example() {
  return (
    <Root theme="dark">
      <Surface variant="brand" contentTheme="light">
        ...
      </Surface>
    </Root>
  );
}
```

## Compose first

Build with Set components before authoring custom markup or CSS. Component props express layout, spacing, surface, typography, and interaction intent while keeping accessibility and brand defaults inside the system.

If a product need falls outside the component surface, keep the custom layer narrow: reuse Set components for the pieces that fit, scope project CSS under `.set`, and use `var(--set-*)` tokens for design values.

Agents working in your repo can load the matching guardrails from `@monospaced/set-skills/compose-first` and `@monospaced/set-skills/custom-with-tokens`.

## Configure linting

`@monospaced/set-config` is the shared tooling package. It expects `eslint` and `stylelint` to be installed in your project.

### ESLint

Layer the Set preset onto your own flat config after the relevant baselines:

```js
// eslint.config.mjs
import js from "@eslint/js";
import json from "@eslint/json";
import setEslint from "@monospaced/set-config/eslint";
import tseslint from "typescript-eslint";

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...json.configs.recommended,
  ...setEslint,
  // project overrides
];
```

Set's ESLint config is additive: use it alongside the recommended configs for the languages and file types in your project, not as a standalone baseline.

### Stylelint

Extend the shared config:

```js
// .stylelintrc.mjs
export default {
  extends: ["@monospaced/set-config/stylelint"],
};
```

This preset is intentionally opinionated. It enforces token discipline, logical CSS, and value restrictions that keep consumer CSS aligned with the design system.

If your project intentionally defines custom properties in one file and consumes them in another, opt into cross-file allowance:

```js
export default {
  extends: ["@monospaced/set-config/stylelint"],
  rules: {
    "set/set-known-tokens": [true, { allowCrossFile: true }],
  },
};
```

### Browserslist

Use Set's Browserslist query when configuring tools that accept query arrays:

```ts
import browserslist from "@monospaced/set-config/browserslist";
```

For `package.json`, use the equivalent query:

```json
{
  "browserslist": ["baseline widely available"]
}
```

For Vite or other esbuild-based tooling, use the esbuild target:

```ts
import target from "@monospaced/set-config/browserslist/esbuild";
```

## Configure CSS token variable autocomplete

`@monospaced/set-config/set.catalog.css` exposes the published `--set-*` CSS custom property catalog for editor autocomplete.

For VS Code, copy it into `.vscode/`:

```sh
cp node_modules/@monospaced/set-config/set.catalog.css .vscode/
```

## Configure skills

Install the Set skills package:

```sh
pnpm add -D @monospaced/set-skills
```

Copy or symlink the shipped skill folders into your agent's repo skills directory:

- Claude Code: `.claude/skills/`
- OpenAI Codex: `.agents/skills/`

Example:

```sh
cp -r node_modules/@monospaced/set-skills/src/* .agents/skills/
```

The skills package is an experimental approach for carrying Set's composition, token, and voice rules into agent-assisted implementation work.

## Use token data

Use `@monospaced/set-tokens` when agents, docs, or local tooling need token artifacts as data rather than CSS. The public token entrypoints are:

```ts
import base from "@monospaced/set-tokens/base";
import mnsp from "@monospaced/set-tokens/mnsp";
import schema from "@monospaced/set-tokens/schemas/v1";
```

That route is appropriate for agent context, docs, MCP tooling, design automation, schema validation, and downstream transforms.

## Optional: render markdown content

If your app renders markdown, pair `@monospaced/set-markdown` with the Prose component from core.

```ts
import { processMarkdown } from "@monospaced/set-markdown";
import { renderSetProse } from "@monospaced/set-core";

const html = renderSetProse({
  children: processMarkdown(markdown),
});
```

This keeps authored rich text aligned with the same typography and content styling as the rest of the system.
