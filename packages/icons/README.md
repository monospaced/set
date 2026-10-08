# @monospaced/set-icons

Set icons as data: a typed registry of icon geometry, generated from the [TDesign](https://tdesign.tencent.com/icons) catalogue and Set's first-party icons.

The registry is platform-neutral. `@monospaced/set-core` renders it as inline SVG markup; `@monospaced/set-react-native` draws it with `react-native-svg`. Consumers of those libraries don't depend on this package directly; it is the shared source both read.

## Usage

```ts
import { ICON_NAMES, ICON_NODES, type IconName } from "@monospaced/set-icons";

ICON_NODES["check-circle"]; // [{ tag: "g", attrs: {}, children: [{ tag: "path", attrs: { d: "…" } }] }]
```

Each icon is an array of nodes (`tag`, `attrs`, optional `children`) in a 24×24 viewBox. Stroke colour and width are not in the data: every icon is drawn with `stroke: currentColor` and a root stroke width the renderer supplies, so the same geometry takes its colour from context on each platform.

## Authoring

Two lists define the shipped set:

- `src/icons-tdesign.ts` — the TDesign names to pull from the catalogue.
- `src/icons-custom.ts` — first-party icons, authored as node trees to the catalogue's conventions (24×24, square linecaps, no per-path stroke width). A custom of the same name as a TDesign icon wins.

After changing either, run `pnpm icons:generate` to rewrite `src/icons.generated.ts`, which is checked in. `icons:verify` regenerates and fails on drift.

## Scripts

- `pnpm run build`
- `pnpm run generate`
- `pnpm run typecheck`
- `pnpm run verify`
