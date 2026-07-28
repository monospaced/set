import { createRequire } from "node:module";

import type { SpacingData } from "./_data/spacing";
import spacingData from "./_data/spacing";
import {
  escapeHtml,
  type FoundationsGroup,
  renderFoundationsPage,
  reportDroppedTokens,
  type TokenDocument,
  tokenNameToCssVariable,
} from "./_shared/foundations";

interface PageData {
  spacing: SpacingData;
}

type SpacingGroup = "horizontal" | "vertical" | "vertical-responsive";

interface SpacingTokenRow {
  // Axis drives the preview (vertical → block-size, horizontal → inline-size);
  // group drives sectioning (responsive vertical is its own section).
  axis: "horizontal" | "vertical";
  cssVariable: string;
  description: string;
  group: SpacingGroup;
  name: string;
  step: number;
}

// Spacing and layout tokens are brand-independent — they live in the `base`
// export, not the per-brand ones.
const require = createRequire(import.meta.url);
const baseTokens = require("@monospaced/set-tokens/base") as TokenDocument;

// Standard spacing lives under `spacing.{axis}.{step}`. The responsive
// vertical variants live under `layout.spacing.vertical.{step}` (a separate
// size context); they get their own section, same split as typography's
// text / text-responsive.
const parseSpacingTokenName = (
  name: string,
):
  | { axis: "horizontal" | "vertical"; isResponsive: boolean; step: number }
  | undefined => {
  const standard = /^spacing\.(vertical|horizontal)\.(\d+)$/.exec(name);
  if (standard) {
    return {
      axis: standard[1] as "horizontal" | "vertical",
      isResponsive: false,
      step: Number(standard[2]),
    };
  }
  const responsive = /^layout\.spacing\.vertical\.(\d+)$/.exec(name);
  if (responsive) {
    return {
      axis: "vertical",
      isResponsive: true,
      step: Number(responsive[1]),
    };
  }
  return undefined;
};

const spacingTokens: SpacingTokenRow[] = Object.entries(
  baseTokens.tokens,
).flatMap(([name, token]) => {
  if (token.layer !== "semantic") return [];
  const parsed = parseSpacingTokenName(name);
  if (!parsed) return [];

  return [
    {
      axis: parsed.axis,
      cssVariable: tokenNameToCssVariable(name),
      description: token.$description ?? "",
      group: parsed.isResponsive
        ? ("vertical-responsive" as const)
        : parsed.axis,
      name,
      step: parsed.step,
    },
  ];
});

// `parseSpacingTokenName` only recognises the known name shapes; a new
// spacing-scope token/group would be silently dropped without this.
reportDroppedTokens(
  "spacing",
  baseTokens,
  (name, token) =>
    (name.startsWith("spacing.") || name.startsWith("layout.spacing.")) &&
    token.layer === "semantic",
  new Set(spacingTokens.map((token) => token.name)),
);

// One section per group, in this order; each is single-kind so a plain
// step-ascending sort reads correctly at every viewport.
const groupOrder: { group: SpacingGroup; label: string }[] = [
  { group: "vertical", label: "Vertical" },
  { group: "vertical-responsive", label: "Vertical responsive" },
  { group: "horizontal", label: "Horizontal" },
];

const renderPreview = (token: SpacingTokenRow): string => {
  const property = token.axis === "vertical" ? "block-size" : "inline-size";

  return `<div class="preview" data-axis="${token.axis}">
    <span
      class="bar"
      style="${property}: var(${escapeHtml(token.cssVariable)})"
    ></span>
  </div>`;
};

const groups: FoundationsGroup[] = groupOrder
  .map(({ group, label }) => ({
    label,
    rows: spacingTokens
      .filter((token) => token.group === group)
      .sort((a, b) => a.step - b.step)
      .map((token) => ({
        entries: [
          { cssVariable: token.cssVariable, description: token.description },
        ],
        preview: renderPreview(token),
      })),
  }))
  .filter((group) => group.rows.length > 0);

export default class Spacing {
  data() {
    return {
      layout: "base.11ty.ts",
      permalink: "/spacing/",
      description: spacingData.strapline,
      title: spacingData.title,
    };
  }

  render(data: PageData): string {
    return renderFoundationsPage({
      docsClass: "docs-spacing",
      groups,
      strapline: data.spacing.strapline,
      title: data.spacing.title,
    });
  }
}
