/**
 * Shared scaffolding for the foundations token pages (color, typography,
 * spacing, layout, …). Each page owns its token loading, grouping, and
 * preview rendering; everything else — the page shell, sections, rows,
 * titles, and descriptions — lives here.
 */
import {
  renderSetBox,
  renderSetContainer,
  renderSetDivider,
  renderSetGrid,
  renderSetGridItem,
  renderSetHeading,
  renderSetStack,
  renderSetText,
} from "@monospaced/set-core";
import { processMarkdownInline } from "@monospaced/set-markdown";

export const escapeHtml = (value: string): string =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

export const tokenNameToCssVariable = (name: string): string =>
  `--set-${name.replaceAll(".", "-")}`;

export interface TokenEntry {
  $description?: string;
  $value?: unknown;
  layer?: string;
}

export interface TokenDocument<T = TokenEntry> {
  tokens: Record<string, T>;
}

/**
 * Build-time guard against silent drops: logs an error for tokens that
 * belong to a page's namespace (`belongs`) but didn't make it into the
 * rendered set (`kept`). Catches a new token/group vanishing because a
 * filter or name parser doesn't recognise it yet. Logs, doesn't throw —
 * loud in CI/PR build output without breaking the docs build.
 */
export const reportDroppedTokens = <T extends TokenEntry>(
  page: string,
  doc: TokenDocument<T>,
  belongs: (name: string, token: T) => boolean,
  kept: ReadonlySet<string>,
): void => {
  const dropped = Object.entries(doc.tokens)
    .filter(([name, token]) => belongs(name, token) && !kept.has(name))
    .map(([name]) => name);

  if (dropped.length > 0) {
    console.error(
      `[foundations:${page}] ${dropped.length} token(s) in scope but not rendered — add handling or they will be missing from the page: ${dropped.join(", ")}`,
    );
  }
};

/** One token's title + description; a row has one (or, e.g. divider, more). */
export interface FoundationsEntry {
  cssVariable: string;
  description: string;
}

export interface FoundationsRow {
  entries: FoundationsEntry[];
  /** Pre-rendered preview HTML (page-specific); "" for no preview cell. */
  preview: string;
}

export interface FoundationsGroup {
  /** Section heading. Omit for a single-section page where it would just
   * repeat the page title. */
  label?: string;
  rows: FoundationsRow[];
}

export interface FoundationsPageOptions {
  /** Wrapper class alongside `docs-foundations`, e.g. "docs-color". */
  docsClass: string;
  groups: FoundationsGroup[];
  strapline: string;
  title: string;
}

/** Preview for a token that is applied but inert on the mnsp theme the docs
 * render — its value is a no-op here (e.g. font-variation-settings default,
 * effect filter) though it does real work on wrfr. Marked, not demoed. */
export const renderInertPreview = (): string =>
  `<div class="preview">
    <span class="value-text-inert">No change</span>
  </div>`;

const renderEntry = (entry: FoundationsEntry): string =>
  `<h3 class="title">var(${escapeHtml(entry.cssVariable)})</h3>
    ${renderSetText({
      as: "p",
      children: processMarkdownInline(entry.description),
      size: "sm",
      tone: "muted",
    })}`;

const renderRow = (row: FoundationsRow): string =>
  `<div class="row">
    <div class="meta">${row.entries.map(renderEntry).join("")}</div>
    ${row.preview}
  </div>`;

const renderGroup = (group: FoundationsGroup): string =>
  `<div class="section">
    ${
      group.label
        ? renderSetHeading({
            id: group.label.toLowerCase().replaceAll(" ", "-"),
            level: 2,
            responsive: true,
            size: "lg",
            text: group.label,
          })
        : ""
    }
    ${group.rows.map(renderRow).join("")}
  </div>`;

export interface FoundationsShellOptions {
  /** Pre-rendered page content below the divider. */
  children: string;
  /** Supports inline markdown (links, code, emphasis). */
  strapline: string;
  title: string;
}

/** Renders the foundations page shell: title, strapline, divider, content. */
export const renderFoundationsShell = ({
  children,
  strapline,
  title,
}: FoundationsShellOptions): string =>
  renderSetContainer({
    maxInlineSize: "none",
    children: renderSetBox({
      paddingBlock: "lg",
      paddingInline: "none",
      responsive: true,
      children: renderSetGrid({
        children: renderSetGridItem({
          colStart: 2,
          colSpan: 10,
          children: renderSetStack({
            gap: "md",
            children: [
              renderSetHeading({
                level: 1,
                responsive: true,
                size: "2xl",
                text: title,
              }),
              renderSetText({
                as: "p",
                children: processMarkdownInline(strapline),
                responsive: true,
                size: "lg",
              }),
              renderSetDivider({ tone: "brand" }),
              children,
            ].join(""),
          }),
        }),
      }),
    }),
  });

/** Renders the full foundations page body (shell + sections + rows). */
export const renderFoundationsPage = ({
  docsClass,
  groups,
  strapline,
  title,
}: FoundationsPageOptions): string =>
  renderFoundationsShell({
    children: `<div class="docs-foundations ${docsClass}">
        ${groups.map(renderGroup).join("")}
      </div>`,
    strapline,
    title,
  });
