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

## Schema

The JSON Schema (draft-2020-12) describes the envelope, per-token shape, and overlay maps. Validate consumer JSON with any draft-2020-12-aware validator (e.g. ajv).
