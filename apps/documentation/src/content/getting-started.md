Set turns Measured’s brand system into code: components, CSS, tokens, assets, and tooling for web projects. Set’s public packages are split by responsibility.

- `@measured/set-assets`: fonts and favicons
- `@measured/set-config`: linting and editor tooling
- `@measured/set-core`: primary components and CSS
- `@measured/set-markdown`: Markdown rendering utility
- `@measured/set-react`: React components for web applications
- `@measured/set-skills`: agent and team guardrails
- `@measured/set-tokens`: structured data for agents and tooling

## Choose an integration route

Choose the route that matches how your project renders UI. Both routes use the same components, CSS, tokens, fonts, and tooling rules.

1. **HTML / SSR**. Use `@measured/set-core` directly if rendering HTML on the server, building an Eleventy or Astro-style site, or want framework-neutral output.
2. **React**. Use `@measured/set-react` when building a React app.

## Install for HTML / SSR

Install the core runtime, CSS, and recommended tooling packages:

```sh
pnpm add @measured/set-core @measured/set-assets
pnpm add -D eslint stylelint @measured/set-config @measured/set-skills @measured/set-tokens
```

## Install for React

Install the React adapter alongside the shared core and assets packages:

```sh
pnpm add react react-dom @measured/set-react @measured/set-core @measured/set-assets
pnpm add -D eslint stylelint @measured/set-config @measured/set-skills @measured/set-tokens
```

## Load fonts and CSS

Load fonts before Set core styles. This is the current setup for both HTML and React consumers:

```css
@import "@measured/set-assets/fonts.css";
@import "@measured/set-core/styles.css";
```

If your stack prefers JS entrypoints, keep the same order:

```ts
import "@measured/set-assets/fonts.css";
import "@measured/set-core/styles.css";
```

For app icons, copy the favicon assets from `@measured/set-assets` into your static public directory and reference them from root-relative URLs.

## Set the Set root

Wrap every Set UI in a Root component. Use `renderSetRoot` for HTML / SSR output, `<Root>` in React.

### HTML / SSR example

Render HTML with `@measured/set-core` component renderers:

```ts
import {
  defineSetComponents,
  renderSetBox,
  renderSetButton,
  renderSetHeading,
  renderSetRoot,
  renderSetStack,
  renderSetText,
} from "@measured/set-core";

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
} from "@measured/set-react";

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

Theme and surface are part of the component model. By default, Set follows the user’s light or dark mode preference. Force a theme with the Root `theme` prop when needed, and use Surface or component-level `surface` props for local color context.

- Root `theme` accepts `light` or `dark`.
- Surface `variant` accepts `default` or `brand`.
- Surface `contentTheme` accepts `light` or `dark` when foreground content needs to be locked to a specific theme.

```ts
import { renderSetRoot, renderSetSurface } from "@measured/set-core";

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
import { Root, Surface } from "@measured/set-react";

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

Agents working in your repo can load the matching guardrails from `@measured/set-skills/compose-first` and `@measured/set-skills/custom-with-tokens`.

## Configure linting

`@measured/set-config` is the shared tooling package. It expects `eslint` and `stylelint` to be installed in your project.

### ESLint

Layer the Set preset onto your own flat config after the relevant baselines:

```js
// eslint.config.mjs
import js from "@eslint/js";
import json from "@eslint/json";
import setEslint from "@measured/set-config/eslint";
import tseslint from "typescript-eslint";

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...json.configs.recommended,
  ...setEslint,
  // project overrides
];
```

Set’s ESLint config is additive: use it alongside the recommended configs for the languages and file types in your project, not as a standalone baseline.

### Stylelint

Extend the shared config:

```js
// .stylelintrc.mjs
export default {
  extends: ["@measured/set-config/stylelint"],
};
```

This preset is intentionally opinionated. It enforces token discipline, logical CSS, and value restrictions that keep consumer CSS aligned with the design system.

If your project intentionally defines custom properties in one file and consumes them in another, opt into cross-file allowance:

```js
export default {
  extends: ["@measured/set-config/stylelint"],
  rules: {
    "set/set-known-tokens": [true, { allowCrossFile: true }],
  },
};
```

### Browserslist

Use Set’s Browserslist query when configuring tools that accept query arrays:

```ts
import browserslist from "@measured/set-config/browserslist";
```

For `package.json`, use the equivalent query:

```json
{
  "browserslist": ["baseline widely available"]
}
```

For Vite or other esbuild-based tooling, use the esbuild target:

```ts
import target from "@measured/set-config/browserslist/esbuild";
```

## Configure CSS token variable autocomplete

`@measured/set-config/set.catalog.css` exposes the published `--set-*` CSS custom property catalog for editor autocomplete.

For VS Code, copy it into `.vscode/`:

```sh
cp node_modules/@measured/set-config/set.catalog.css .vscode/
```

## Configure skills

Install the Set skills package:

```sh
pnpm add -D @measured/set-skills
```

Copy or symlink the shipped skill folders into your agent’s repo skills directory:

- Claude Code: `.claude/skills/`
- OpenAI Codex: `.agents/skills/`

Example:

```sh
cp -r node_modules/@measured/set-skills/src/* .agents/skills/
```

The skills package is an experimental approach for carrying Set’s composition, token, and voice rules into agent-assisted implementation work.

## Use token data

Use `@measured/set-tokens` when agents, docs, or local tooling need token artifacts as data rather than CSS. The public token entrypoints are:

```ts
import base from "@measured/set-tokens/base";
import mnsp from "@measured/set-tokens/mnsp";
import schema from "@measured/set-tokens/schemas/v1";
```

That route is appropriate for agent context, docs, MCP tooling, design automation, schema validation, and downstream transforms.

## Optional: render markdown content

If your app renders markdown, pair `@measured/set-markdown` with the Prose component from core.

```ts
import { processMarkdown } from "@measured/set-markdown";
import { renderSetProse } from "@measured/set-core";

const html = renderSetProse({
  children: processMarkdown(markdown),
});
```

This keeps authored rich text aligned with the same typography and content styling as the rest of the system.
