import { createRequire } from "node:module";

import type { TypographyData } from "./_data/typography";
import typographyData from "./_data/typography";
import {
  escapeHtml,
  type FoundationsGroup,
  renderFoundationsPage,
  type TokenDocument,
  tokenNameToCssVariable,
} from "./_shared/foundations";

interface PageData {
  typography: TypographyData;
}

interface TextValue {
  fontSize?: string;
  fontWeight?: number;
}

interface TypographyToken {
  $description?: string;
  $value?: TextValue | unknown;
  // Responsive text tokens carry larger per-viewport values here; the base
  // $value is the minimum (narrow screens).
  bySize?: Record<string, { $value?: TextValue }>;
  layer?: string;
}

interface TypographyTokenRow {
  cssVariable: string;
  description: string;
  group: string;
  // Sort keys for the text sections (0 for non-text groups).
  maxPx: number;
  minPx: number;
  name: string;
  weight: number;
}

interface TypographyTokenGroup {
  label: string;
  tokens: TypographyTokenRow[];
}

const require = createRequire(import.meta.url);
const mnspTokens =
  require("@monospaced/set-tokens/mnsp") as TokenDocument<TypographyToken>;

// Split text into two sections — "text" (static) and "text-responsive" — so
// each section holds one kind. Sorting by size is then unambiguous within a
// section (static: min === max; responsive-only: no min/max crossovers).
const getTypographyGroup = (name: string): string => {
  const segment = name.split(".")[1] ?? "";
  if (segment === "text" && name.includes(".responsive.")) {
    return "text-responsive";
  }
  return segment;
};

const isTextGroup = (group: string): boolean =>
  group === "text" || group === "text-responsive";

const formatTypographyGroupLabel = (group: string): string => {
  if (group.length === 0) return group;
  return `${group[0].toUpperCase()}${group.slice(1).replaceAll("-", " ")}`;
};

const SAMPLE_TEXT = "Set";

interface PreviewConfig {
  // Render a vertical-spacing-style bar sized to the token (block-size),
  // instead of applying a CSS property to a text sample.
  bar?: boolean;
  // Render the preview on an inverse surface (measure only).
  inverse?: boolean;
  noSample?: boolean;
  property?: string;
}

// Groups absent from this map render value-only. type-step (a unitless
// ratio) and prose (a composite the components own) are a deliberate
// accept — neither earns a single-sample preview.
const previewByGroup: Record<string, PreviewConfig | undefined> = {
  "font-family": { property: "font-family" },
  "font-weight": { property: "font-weight" },
  leading: { bar: true },
  measure: { inverse: true, noSample: true, property: "max-inline-size" },
  paragraph: { bar: true },
  text: { property: "font" },
  "text-responsive": { property: "font" },
};

const getPreviewConfig = (group: string): PreviewConfig | undefined =>
  previewByGroup[group];

// Responsive tokens scale from a narrow min (base $value) to a wide max
// (bySize); static tokens have min === max.
const pxOf = (value: TextValue | undefined): number => {
  const px = Number.parseFloat(String(value?.fontSize));
  return Number.isFinite(px) ? px : 0;
};

const textValue = (
  token: TypographyToken,
): { maxPx: number; minPx: number; weight: number } => {
  const base =
    token.$value && typeof token.$value === "object"
      ? (token.$value as TextValue)
      : undefined;
  const minPx = pxOf(base);
  const bySizeValues = Object.values(token.bySize ?? {}).map((s) => s.$value);
  const maxPx = Math.max(minPx, ...bySizeValues.map((v) => pxOf(v)));

  return { maxPx, minPx, weight: Number(base?.fontWeight) || 0 };
};

const typographyTokens: TypographyTokenRow[] = Object.entries(mnspTokens.tokens)
  .filter(
    ([name, token]) =>
      name.startsWith("typography.") && token.layer === "semantic",
  )
  .map(([name, token]) => {
    const group = getTypographyGroup(name);

    if (!group) {
      throw new Error(`Unsupported typography token group: ${name}`);
    }

    const { maxPx, minPx, weight } = textValue(token);

    return {
      cssVariable: tokenNameToCssVariable(name),
      description: token.$description ?? "",
      group,
      maxPx,
      minPx,
      name,
      weight,
    };
  });

// Sort a text section by value: size asc (wide, then narrow), then weight
// asc (body before heading at equal size). Each section holds one kind, so
// this reads ascending at every viewport — splitting static and responsive
// is what avoids the cross-breakpoint ambiguity of a combined list.
const sortTextRows = (rows: TypographyTokenRow[]): TypographyTokenRow[] =>
  [...rows].sort(
    (a, b) => a.maxPx - b.maxPx || a.minPx - b.minPx || a.weight - b.weight,
  );

const typographyTokenGroups: TypographyTokenGroup[] = Array.from(
  typographyTokens.reduce<Map<string, TypographyTokenRow[]>>(
    (groups, token) => {
      const group = groups.get(token.group);

      if (group) group.push(token);
      else groups.set(token.group, [token]);

      return groups;
    },
    new Map(),
  ),
  ([group, tokens]) => ({
    label: formatTypographyGroupLabel(group),
    tokens: isTextGroup(group) ? sortTextRows(tokens) : tokens,
  }),
);

const renderPreview = (token: TypographyTokenRow): string => {
  const config = getPreviewConfig(token.group);
  if (!config) return "";

  if (config.bar) {
    return `<div class="preview">
      <span
        class="bar"
        style="block-size: var(${escapeHtml(token.cssVariable)})"
      ></span>
    </div>`;
  }

  if (!config.property) return "";

  const content = config.noSample ? "" : escapeHtml(SAMPLE_TEXT);
  const surface = config.inverse ? ' data-set-surface="inverse"' : "";

  return `<div
    class="preview"${surface}
    style="${escapeHtml(config.property)}: var(${escapeHtml(token.cssVariable)})"
  >${content}</div>`;
};

const groups: FoundationsGroup[] = typographyTokenGroups.map((group) => ({
  label: group.label,
  rows: group.tokens.map((token) => ({
    entries: [
      { cssVariable: token.cssVariable, description: token.description },
    ],
    preview: renderPreview(token),
  })),
}));

export default class Typography {
  data() {
    return {
      layout: "base.11ty.ts",
      permalink: "/typography/",
      description: typographyData.strapline,
      title: typographyData.title,
    };
  }

  render(data: PageData): string {
    return renderFoundationsPage({
      docsClass: "docs-typography",
      groups,
      strapline: data.typography.strapline,
      title: data.typography.title,
    });
  }
}
