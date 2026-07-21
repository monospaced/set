import { createRequire } from "node:module";

import type { BreakpointData } from "./_data/breakpoint";
import breakpointData from "./_data/breakpoint";
import {
  escapeHtml,
  type FoundationsGroup,
  renderFoundationsPage,
  type TokenDocument,
  tokenNameToCssVariable,
} from "./_shared/foundations";

interface PageData {
  breakpoint: BreakpointData;
}

interface BreakpointToken {
  $description?: string;
  $value?: string;
  layer?: string;
}

// Breakpoints are brand-independent — they live in the `base` export.
const require = createRequire(import.meta.url);
const baseTokens =
  require("@monospaced/set-tokens/base") as TokenDocument<BreakpointToken>;

const breakpointTokens = Object.entries(baseTokens.tokens)
  .filter(
    ([name, token]) =>
      name.startsWith("breakpoint.") && token.layer === "semantic",
  )
  .map(([name, token]) => ({
    cssVariable: tokenNameToCssVariable(name),
    description: token.$description ?? "",
    px: Number.parseFloat(String(token.$value)) || 0,
  }))
  .sort((a, b) => a.px - b.px);

// Single unlabelled section (the heading would just repeat the page
// title); preview spans the row capped at the breakpoint — same stacked
// treatment as the layout container max-width preview.
const groups: FoundationsGroup[] = [
  {
    rows: breakpointTokens.map((token) => ({
      entries: [
        { cssVariable: token.cssVariable, description: token.description },
      ],
      preview: `<div
        class="preview"
        data-set-surface="inverse"
        style="max-inline-size: var(${escapeHtml(token.cssVariable)})"
      ></div>`,
    })),
  },
];

export default class Breakpoint {
  data() {
    return {
      layout: "base.11ty.ts",
      permalink: "/breakpoint/",
      description: breakpointData.strapline,
      title: breakpointData.title,
    };
  }

  render(data: PageData): string {
    return renderFoundationsPage({
      docsClass: "docs-breakpoint",
      groups,
      strapline: data.breakpoint.strapline,
      title: data.breakpoint.title,
    });
  }
}
