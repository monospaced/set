import { createRequire } from "node:module";

import type { TypographyData } from "./_data/typography";
import typographyData from "./_data/typography";
import {
  escapeHtml,
  type FoundationsEntry,
  type FoundationsGroup,
  type FoundationsRow,
  renderFoundationsPage,
  renderInertPreview,
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

const SAMPLE_TEXT = "Berkeley Mono";

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
// ratio) is a deliberate accept — it doesn't earn a single-sample preview.
// The text, prose, metric, and font-variation-settings groups are handled
// separately (paired font + font-stretch examples, a combined live-link
// specimen, a single cell diagram, and a per-token default/italic preview).
const previewByGroup: Record<string, PreviewConfig | undefined> = {
  "font-family": { property: "font-family" },
  "font-stretch": { property: "font-stretch" },
  "font-weight": { property: "font-weight" },
  leading: { bar: true },
  measure: { inverse: true, noSample: true, property: "max-inline-size" },
  paragraph: { bar: true },
  "word-spacing": { property: "word-spacing" },
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

// One loaded token: its var, description, and the raw token (for sort keys).
interface TokenInfo {
  cssVariable: string;
  description: string;
  name: string;
  token: TypographyToken;
}

const tokensByGroup = Object.entries(mnspTokens.tokens)
  .filter(
    ([name, token]) =>
      name.startsWith("typography.") && token.layer === "semantic",
  )
  .reduce<Map<string, TokenInfo[]>>((groups, [name, token]) => {
    const group = getTypographyGroup(name);

    if (!group) {
      throw new Error(`Unsupported typography token group: ${name}`);
    }

    const info: TokenInfo = {
      cssVariable: tokenNameToCssVariable(name),
      description: token.$description ?? "",
      name,
      token,
    };
    const list = groups.get(group);

    if (list) list.push(info);
    else groups.set(group, [info]);

    return groups;
  }, new Map());

const toEntry = (info: TokenInfo): FoundationsEntry => ({
  cssVariable: info.cssVariable,
  description: info.description,
});

const renderPreview = (group: string, info: TokenInfo): string => {
  // font-variation-settings: mnsp's `default` value is inert (rendered "No
  // change"); the `italic` token carries the slant, shown as a live <em>.
  if (group === "font-variation-settings") {
    return info.name.endsWith(".italic")
      ? `<div class="preview"><em>${escapeHtml(SAMPLE_TEXT)}</em></div>`
      : renderInertPreview();
  }

  const config = getPreviewConfig(group);
  if (!config) return "";

  const cssVariable = info.cssVariable;

  if (config.bar) {
    return `<div class="preview">
      <span
        class="bar"
        style="block-size: var(${escapeHtml(cssVariable)})"
      ></span>
    </div>`;
  }

  if (!config.property) return "";

  const content = config.noSample ? "" : escapeHtml(SAMPLE_TEXT);
  const surface = config.inverse ? ' data-set-surface="inverse"' : "";

  return `<div
    class="preview"${surface}
    style="${escapeHtml(config.property)}: var(${escapeHtml(cssVariable)})"
  >${content}</div>`;
};

// Each text example is a font composite paired with its font-stretch token;
// both apply to one sample (mirrors effect Stroke's inset + outset row).
const exampleKeyOf = (name: string): string =>
  name.replace(/\.(font|font-stretch)$/, "");

const renderTextPreview = (fontVar: string, stretchVar: string): string =>
  `<div
    class="preview"
    style="font: var(${escapeHtml(fontVar)}); font-stretch: var(${escapeHtml(
      stretchVar,
    )})"
  >${escapeHtml(SAMPLE_TEXT)}</div>`;

// Pair each example's font + font-stretch into one row, sorted by size asc
// (wide then narrow), then weight asc (body before heading at equal size).
const textRows = (infos: TokenInfo[]): FoundationsRow[] => {
  const byExample = new Map<
    string,
    { font?: TokenInfo; stretch?: TokenInfo }
  >();

  for (const info of infos) {
    const key = exampleKeyOf(info.name);
    const pair = byExample.get(key) ?? {};

    if (info.name.endsWith(".font-stretch")) pair.stretch = info;
    else pair.font = info;

    byExample.set(key, pair);
  }

  return Array.from(byExample.values())
    .map((pair) => {
      if (!pair.font || !pair.stretch) {
        throw new Error(
          `Text example missing a font/font-stretch pair: ${
            pair.font?.name ?? pair.stretch?.name ?? "unknown"
          }`,
        );
      }

      return {
        font: pair.font,
        stretch: pair.stretch,
        ...textValue(pair.font.token),
      };
    })
    .sort(
      (a, b) => a.maxPx - b.maxPx || a.minPx - b.minPx || a.weight - b.weight,
    )
    .map(({ font, stretch }) => ({
      entries: [toEntry(font), toEntry(stretch)],
      preview: renderTextPreview(font.cssVariable, stretch.cssVariable),
    }));
};

// Prose is the link-decoration set — one combined row (like effect Stroke)
// whose preview is a live prose link. Rendering the real `.set-prose a`
// applies every prose.link token and keeps the specimen in sync; hovering /
// pressing it reveals the hover and active decoration tokens.
const proseRows = (infos: TokenInfo[]): FoundationsRow[] => [
  {
    entries: infos.map(toEntry),
    preview: `<div class="preview">
      <span class="set-prose"><a href="#0">${escapeHtml(SAMPLE_TEXT)}</a></span>
    </div>`,
  },
];

// Metric is one combined row: a single character-cell diagram. The outlined
// box is the cell (width × height); the shaded strips inside each edge are the
// per-side sidebearing (both together = the pair); the shaded strip below is
// the cap balance. Scaled up via font-size so the em-based tokens read.
const metricRows = (infos: TokenInfo[]): FoundationsRow[] => [
  {
    entries: infos.map(toEntry),
    preview: `<div class="preview">
      <div class="metric-cell">
        <div class="metric-cell-box">
          <span class="metric-side" data-edge="start"></span>
          <span class="metric-side" data-edge="end"></span>
        </div>
        <span class="metric-cap"></span>
      </div>
    </div>`,
  },
];

const rowsFor = (group: string, infos: TokenInfo[]): FoundationsRow[] => {
  if (isTextGroup(group)) return textRows(infos);
  if (group === "prose-link") return proseRows(infos);
  if (group === "metric") return metricRows(infos);

  return infos.map((info) => ({
    entries: [toEntry(info)],
    preview: renderPreview(group, info),
  }));
};

const groups: FoundationsGroup[] = Array.from(
  tokensByGroup,
  ([group, infos]) => ({
    label: formatTypographyGroupLabel(group),
    rows: rowsFor(group, infos),
  }),
);

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
