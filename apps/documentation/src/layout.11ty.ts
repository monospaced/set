import { createRequire } from "node:module";

import type { LayoutPageData } from "./_data/layoutPage";
import layoutPageData from "./_data/layoutPage";
import {
  escapeHtml,
  type FoundationsGroup,
  renderFoundationsPage,
  type TokenDocument,
  tokenNameToCssVariable,
} from "./_shared/foundations";

interface PageData {
  layoutPage: LayoutPageData;
}

interface LayoutToken {
  $description?: string;
  $value?: unknown;
  layer?: string;
}

interface LayoutTokenRow {
  cssVariable: string;
  description: string;
  group: string;
  name: string;
  value: string;
}

interface LayoutTokenGroup {
  label: string;
  tokens: LayoutTokenRow[];
}

// Layout tokens are mostly brand-independent (base); the brand divider
// dimensions live in the per-brand export, so merge both.
const require = createRequire(import.meta.url);
const baseTokens =
  require("@measured/set-tokens/base") as TokenDocument<LayoutToken>;
const mnspTokens =
  require("@measured/set-tokens/mnsp") as TokenDocument<LayoutToken>;
const allTokens: TokenDocument<LayoutToken> = {
  tokens: { ...baseTokens.tokens, ...mnspTokens.tokens },
};

const getLayoutGroup = (name: string): string => name.split(".")[1] ?? "";

const formatLayoutGroupLabel = (group: string): string => {
  if (group.length === 0) return group;
  return `${group[0].toUpperCase()}${group.slice(1).replaceAll("-", " ")}`;
};

// `layout.spacing.*` is the responsive vertical-rhythm set — it's the
// Spacing page's "Vertical responsive" section, not a layout token here.
const isLayoutToken = (name: string): boolean =>
  name.startsWith("layout.") && !name.startsWith("layout.spacing.");

type PreviewKind =
  | "border-width"
  | "focus-ring-offset"
  | "focus-ring-outset"
  | "icon-size"
  | "inline-size"
  | "stacked-width"
  | "value-text";

// Groups with an obvious one-property preview. Divider is handled separately
// (one combined preview for its size + thickness pair). "inline-size" covers
// any horizontal length shown as a bar of that width (gutters, grid gaps).
// "value-text" shows the raw value for unitless tokens with no spatial
// representation (grid columns, icon viewBox ratios). Focus-ring width reuses
// the border-width bar; the offsets put a real focus ring on the preview box
// itself, the token driving `outline-offset` (inset's negative offset renders
// the ring inside); the outset is shown as a square sized by the token.
const previewKind = (name: string): PreviewKind | undefined => {
  if (/^layout\.icon\.size\./.test(name)) return "icon-size";
  if (/^layout\.border\.width\./.test(name)) return "border-width";
  if (/^layout\.focus-ring\.width$/.test(name)) return "border-width";
  if (/^layout\.focus-ring\.offset\./.test(name)) return "focus-ring-offset";
  if (/^layout\.focus-ring\.outset$/.test(name)) return "focus-ring-outset";
  if (/^layout\.container\.max-width\./.test(name)) return "stacked-width";
  if (/^layout\.grid\.item\.min-width$/.test(name)) return "stacked-width";
  if (/^layout\.container\.gutter\./.test(name)) return "inline-size";
  if (/^layout\.grid\.gap\./.test(name)) return "inline-size";
  if (/^layout\.grid\.columns$/.test(name)) return "value-text";
  if (/^layout\.icon\.viewbox\./.test(name)) return "value-text";
  return undefined;
};

const isDividerGroup = (tokens: LayoutTokenRow[]): boolean =>
  tokens[0]?.name.startsWith("layout.divider.") ?? false;

const layoutTokens: LayoutTokenRow[] = Object.entries(allTokens.tokens)
  .filter(([name, token]) => isLayoutToken(name) && token.layer === "semantic")
  .map(([name, token]) => ({
    cssVariable: tokenNameToCssVariable(name),
    description: token.$description ?? "",
    group: getLayoutGroup(name),
    name,
    value: token.$value === undefined ? "" : String(token.$value),
  }));

const layoutTokenGroups: LayoutTokenGroup[] = Array.from(
  layoutTokens.reduce<Map<string, LayoutTokenRow[]>>((groups, token) => {
    const group = groups.get(token.group);

    if (group) group.push(token);
    else groups.set(token.group, [token]);

    return groups;
  }, new Map()),
  ([group, tokens]) => ({
    label: formatLayoutGroupLabel(group),
    tokens,
  }),
);

const renderPreview = (token: LayoutTokenRow): string => {
  const kind = previewKind(token.name);
  if (!kind) return "";

  const value = `var(${escapeHtml(token.cssVariable)})`;

  if (kind === "icon-size") {
    return `<div class="preview">
      <span class="icon-box" style="block-size: ${value}"></span>
    </div>`;
  }

  if (kind === "border-width") {
    return `<div class="preview">
      <span class="border-bar" style="block-size: ${value}"></span>
    </div>`;
  }

  if (kind === "inline-size") {
    return `<div class="preview">
      <span class="inline-bar" style="inline-size: ${value}"></span>
    </div>`;
  }

  if (kind === "focus-ring-offset") {
    return `<div class="preview" style="--docs-focus-ring-offset: ${value}"></div>`;
  }

  if (kind === "focus-ring-outset") {
    return `<div class="preview">
      <span class="focus-ring-outset-box" style="block-size: ${value}"></span>
    </div>`;
  }

  if (kind === "value-text") {
    return `<div class="preview">
      <span class="value-text">${escapeHtml(token.value)}</span>
    </div>`;
  }

  // stacked-width (container max-width, grid item min-width) — cap the
  // preview at the token and stack it full-width, mirroring the typography
  // measure preview exactly: empty box, height from the preview's own
  // padding (the .docs-layout stacked override keys off max-inline-size).
  return `<div
    class="preview"
    data-set-surface="inverse"
    style="max-inline-size: ${value}"
  ></div>`;
};

const toEntry = (token: LayoutTokenRow) => ({
  cssVariable: token.cssVariable,
  description: token.description,
});

// Divider documents two tokens (brand size + thickness) but they describe one
// element, so render a single row: both tokens in the meta, one preview
// driven by both vars.
const dividerRow = (tokens: LayoutTokenRow[]) => {
  const size = tokens.find((t) => t.name.endsWith(".size"));
  const thickness = tokens.find((t) => t.name.endsWith(".thickness"));
  const entries = [size, thickness].filter((t): t is LayoutTokenRow =>
    Boolean(t),
  );
  const style = [
    size ? `inline-size: var(${escapeHtml(size.cssVariable)})` : "",
    thickness ? `block-size: var(${escapeHtml(thickness.cssVariable)})` : "",
  ]
    .filter(Boolean)
    .join("; ");

  return {
    entries: entries.map(toEntry),
    preview: `<div class="preview">
      <span class="divider-bar" style="${style}"></span>
    </div>`,
  };
};

const groups: FoundationsGroup[] = layoutTokenGroups.map((group) => ({
  label: group.label,
  rows: isDividerGroup(group.tokens)
    ? [dividerRow(group.tokens)]
    : group.tokens.map((token) => ({
        entries: [toEntry(token)],
        preview: renderPreview(token),
      })),
}));

export default class Layout {
  data() {
    return {
      layout: "base.11ty.ts",
      permalink: "/layout/",
      description: layoutPageData.strapline,
      title: layoutPageData.title,
    };
  }

  render(data: PageData): string {
    return renderFoundationsPage({
      docsClass: "docs-layout",
      groups,
      strapline: data.layoutPage.strapline,
      title: data.layoutPage.title,
    });
  }
}
