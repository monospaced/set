# @measured/set-core

SSR-first component library for Set. Native HTML output via custom elements, with a co-located CSS contract.

## Current scope

- TypeScript-first SSR renderers that emit native HTML
- Co-located CSS contract via `styles.css` (tokens + root + component styles)
- Storybook stories for component development
- Vitest + Testing Library coverage
- Token CSS auto-import via `@measured/set-system`
- Browser baseline wired via `@measured/set-config/browserslist`

## Public API

- JS/TS: `@measured/set-core`
- CSS: `@measured/set-core/styles.css`

## Font loading

Load fonts before core styles:

```css
@import "@measured/set-assets/fonts.css";
@import "@measured/set-core/styles.css";
```

## Scripts

- `pnpm run build`
- `pnpm run build:types`
- `pnpm run lint`
- `pnpm run test`
- `pnpm run test:watch`
- `pnpm run typecheck`

Storybook runtime lives in `apps/storybook` (run via root scripts: `pnpm run storybook`, `pnpm run storybook:build`).
