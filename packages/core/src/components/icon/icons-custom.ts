// Additional custom icons to complement the TDesign catalog. The generate script
// (`scripts/generate-icons.mjs`) merges these into `icons.generated.ts`;
// a custom entry wins over a same-named TDesign icon.
//
// Author each icon to match the catalog's conventions so it sits alongside
// the TDesign icons without looking out of place:
//   - 24×24 viewBox, coordinates in that space
//   - `stroke-linecap: "square"` and sharp (mitred) corners — no `rx`
//   - no per-path `stroke-width` (inherits the root stroke hoisted in icon.ts)

interface IconNode {
  tag: string;
  attrs: Record<string, string>;
  children?: IconNode[];
}

export const SET_ICON_CUSTOM = {
  "panel-left": [
    {
      tag: "path",
      attrs: { d: "M3 3H21V21H3V3Z", "stroke-linecap": "square" },
    },
    { tag: "path", attrs: { d: "M9 3V21", "stroke-linecap": "square" } },
  ],
} satisfies Record<string, IconNode[]>;
