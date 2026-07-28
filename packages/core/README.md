# @monospaced/set-core

SSR-first component library for Set. Native HTML output via custom elements, with a co-located CSS contract.

## Current scope

- TypeScript-first SSR renderers that emit native HTML
- Co-located CSS contract via `styles.css` (tokens + root + component styles)
- Storybook stories for component development
- Vitest + Testing Library coverage
- Token CSS auto-import via `@monospaced/set-system`
- Browser baseline wired via `@monospaced/set-config/browserslist`

## Public API

- JS/TS: `@monospaced/set-core`
- CSS: `@monospaced/set-core/styles.css`

## Font loading

Load fonts before core styles:

```css
@import "@monospaced/set-assets/fonts.css";
@import "@monospaced/set-core/styles.css";
```

## Scripts

- `pnpm run build`
- `pnpm run build:types`
- `pnpm run lint`
- `pnpm run test`
- `pnpm run test:watch`
- `pnpm run typecheck`

Storybook runtime lives in `apps/storybook` (run via root scripts: `pnpm run storybook`, `pnpm run storybook:build`).
