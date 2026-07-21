import { createRequire } from "node:module";

import type { ColorData } from "./_data/color";
import colorData from "./_data/color";
import {
  escapeHtml,
  type FoundationsGroup,
  renderFoundationsPage,
  reportDroppedTokens,
  type TokenDocument,
  tokenNameToCssVariable,
} from "./_shared/foundations";

interface PageData {
  color: ColorData;
}

interface ColorToken {
  $description?: string;
  $value?: { hex?: string };
  layer?: string;
}

interface ColorTokenRow {
  cssVariable: string;
  description: string;
  group: string;
  name: string;
}

// Surfaces only — swatches inherit the OS colour scheme (no pinned
// content-theme), so a token is shown once per surface, not per theme.
type ColorSurface = "brand" | "default";

const require = createRequire(import.meta.url);
const mnspTokens =
  require("@measured/set-tokens/mnsp") as TokenDocument<ColorToken>;

const colorSurfaces: ColorSurface[] = ["default", "brand"];

const getColorGroup = (name: string): string => name.split(".")[1] ?? "";

const formatColorGroupLabel = (group: string): string =>
  group.length === 0 ? group : `${group[0].toUpperCase()}${group.slice(1)}`;

const colorTokens: ColorTokenRow[] = Object.entries(mnspTokens.tokens)
  .filter(
    ([name, token]) =>
      name.startsWith("color.") &&
      token.layer === "semantic" &&
      token.$value?.hex,
  )
  .map(([name, token]) => {
    const group = getColorGroup(name);

    if (!group) {
      throw new Error(`Unsupported color token group: ${name}`);
    }

    return {
      cssVariable: tokenNameToCssVariable(name),
      description: token.$description ?? "",
      group,
      name,
    };
  });

// Semantic color tokens are dropped if they have no renderable `$value.hex`
// (e.g. a new non-hex color group) — surface that instead of vanishing.
reportDroppedTokens(
  "color",
  mnspTokens,
  (name, token) => name.startsWith("color.") && token.layer === "semantic",
  new Set(colorTokens.map((token) => token.name)),
);

const colorTokenGroups = Array.from(
  colorTokens.reduce<Map<string, ColorTokenRow[]>>((groups, token) => {
    const group = groups.get(token.group);

    if (group) group.push(token);
    else groups.set(token.group, [token]);

    return groups;
  }, new Map()),
  ([group, tokens]) => ({ label: formatColorGroupLabel(group), tokens }),
);

const renderSwatch = (token: ColorTokenRow, surface: ColorSurface): string =>
  `<div class="swatch" data-set-surface="${escapeHtml(surface)}">
    <span
      class="swatch-color"
      style="background-color: var(${escapeHtml(token.cssVariable)})"
    ></span>
  </div>`;

const renderPreview = (token: ColorTokenRow): string =>
  `<div class="preview">
      ${colorSurfaces.map((surface) => renderSwatch(token, surface)).join("")}
    </div>`;

const groups: FoundationsGroup[] = colorTokenGroups.map((group) => ({
  label: group.label,
  rows: group.tokens.map((token) => ({
    entries: [
      { cssVariable: token.cssVariable, description: token.description },
    ],
    preview: renderPreview(token),
  })),
}));

export default class Color {
  data() {
    return {
      layout: "base.11ty.ts",
      permalink: "/color/",
      description: colorData.strapline,
      title: colorData.title,
    };
  }

  render(data: PageData): string {
    return renderFoundationsPage({
      docsClass: "docs-color",
      groups,
      strapline: data.color.strapline,
      title: data.color.title,
    });
  }
}
