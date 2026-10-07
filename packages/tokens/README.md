# @monospaced/set-tokens

Set tokens as data: DTCG-shaped JSON artifacts and JSON Schema. For docs sites, MCP, agents, and downstream tooling.

## Usage

```js
import mnsp from "@monospaced/set-tokens/mnsp";
import wrfr from "@monospaced/set-tokens/wrfr";
import base from "@monospaced/set-tokens/base";
import schema from "@monospaced/set-tokens/schemas/v1";
```

## Output shape

Each artifact is token-centric with overlay-only context variation:

- **Constant tokens**: `$value` only.
- **Single-axis variation**: `$value` + `varyingModifiers: [axis]` + `by<Axis>: { <axisValue>: { $value, ... } }`.
- **Multi-axis variation**: `$value` + `varyingModifiers: [a, b]` + `byContext: { "a=v1,b=v2": { $value } }` — keys list only the varying axes.

DTCG-defined fields keep the `$` prefix (`$value`, `$type`, `$description`, `$extensions`); Set-defined fields are bare-named (`layer`, `varyingModifiers`, `byTheme`, `byContext`, …).

## React Native

```js
import tokens from "@monospaced/set-tokens/react-native/mnsp";

tokens.theme.dark.default.color.background.default; // "#0e0f0f"
tokens.size.tablet.layout.container.gutter.narrow; // 24
tokens.static.spacing.vertical[700]; // 24
tokens.static.typography.text.body.sm.font; // { fontFamily, fontSize, fontWeight, letterSpacing, lineHeight }
tokens.theme.light.default.effect.shadow.default; // { shadowColor, shadowOffset, shadowOpacity, shadowRadius, elevation }
```

One module per brand (base tokens are merged underneath), values only, with a
`.d.ts` beside it that carries every token's `$description` as JSDoc.

### Shape

The module is a context matrix. Each token lives in exactly one partition,
according to which axis its value actually varies on:

- `static` — does not vary. Spacing, radius, motion, typography steps,
  breakpoints, and any color that is the same in every theme.
- `size.<baseline|tablet|notebook|laptop>` — varies with viewport size.
  Each context is fully resolved. Pick the context from `useWindowDimensions().width` against `static.breakpoint.*`.
- `theme.<light|dark>.<default|brand>` — varies with color scheme and
  surface. Pick from `useColorScheme()` and the surface a region sits on.
  A region that must stay dark regardless of scheme reads `theme.dark`.

To resolve tokens for a context, deep-merge `static`, the matching `size`
context and the matching `theme` surface. Each token appears in exactly one
of the three, so the merge never overwrites a value.

### Values

Values are ready to pass to React Native styles.

| DTCG `$type`  | Value                                                                                                                                  |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `dimension`   | number, in density-independent points                                                                                                  |
| `duration`    | number, in milliseconds                                                                                                                |
| `number`      | number                                                                                                                                 |
| `color`       | `#rrggbb`, or `rgba(r, g, b, a)` when translucent                                                                                      |
| `fontFamily`  | font family name; the app loads the font                                                                                               |
| `fontWeight`  | number                                                                                                                                 |
| `cubicBezier` | `[x1, y1, x2, y2]`, for `Easing.bezier`                                                                                                |
| `shadow`      | `{ shadowColor, shadowOffset: { width, height }, shadowOpacity, shadowRadius, elevation }`: `shadow*` for iOS, `elevation` for Android |
| `typography`  | text style: `{ fontFamily, fontSize, fontWeight, letterSpacing, lineHeight }`                                                          |

The modules include only DTCG-typed tokens; untyped tokens in the JSON
artifacts have no React Native value.

## Schema

The JSON Schema (draft-2020-12) describes the envelope, per-token shape, and overlay maps. Validate consumer JSON with any draft-2020-12-aware validator (e.g. ajv).
