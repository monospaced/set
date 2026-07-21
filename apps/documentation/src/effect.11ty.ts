import { createRequire } from "node:module";

import type { EffectData } from "./_data/effect";
import effectData from "./_data/effect";
import {
  escapeHtml,
  type FoundationsGroup,
  type FoundationsRow,
  renderFoundationsPage,
  type TokenDocument,
  tokenNameToCssVariable,
} from "./_shared/foundations";

interface PageData {
  effect: EffectData;
}

interface EffectToken {
  $description?: string;
  layer?: string;
}

const require = createRequire(import.meta.url);
const mnspTokens =
  require("@measured/set-tokens/mnsp") as TokenDocument<EffectToken>;

const getEffectGroup = (name: string): string => name.split(".")[1] ?? "";

const formatEffectGroupLabel = (group: string): string =>
  group.length === 0 ? group : `${group[0].toUpperCase()}${group.slice(1)}`;

interface EffectEntry {
  cssVariable: string;
  description: string;
  name: string;
}

const entriesByGroup = Object.entries(mnspTokens.tokens)
  .filter(
    ([name, token]) => name.startsWith("effect.") && token.layer === "semantic",
  )
  .reduce<Map<string, EffectEntry[]>>((groups, [name, token]) => {
    const group = getEffectGroup(name);
    const entry: EffectEntry = {
      cssVariable: tokenNameToCssVariable(name),
      description: token.$description ?? "",
      name,
    };

    const entries = groups.get(group);
    if (entries) entries.push(entry);
    else groups.set(group, [entry]);

    return groups;
  }, new Map());

const toMeta = (entry: EffectEntry) => ({
  cssVariable: entry.cssVariable,
  description: entry.description,
});

const previewFor = (group: string, cssVariable: string): string => {
  if (group === "shadow") {
    return `<div
      class="preview"
      style="box-shadow: var(${escapeHtml(cssVariable)})"
    ></div>`;
  }
  if (group === "opacity") {
    return `<div class="preview">
      <span
        class="opacity-box"
        style="opacity: var(${escapeHtml(cssVariable)})"
      ></span>
    </div>`;
  }
  return "";
};

// Stroke is one combined row (inset + outset describe a single decorative
// stroke, like the layout divider). The values pass through custom props
// set inline so the CSS ::after — which can't take inline styles — can read
// them. Shadow applies to the standard box; opacity dims a 72×72 box.
// Filter is consciously value-only — a single static box can't convey a
// filter meaningfully, so the meta stands alone (a deliberate accept).
const rowsFor = (group: string, entries: EffectEntry[]): FoundationsRow[] => {
  if (group === "stroke") {
    const inset = entries.find((e) => e.name.endsWith(".inset"));
    const outset = entries.find((e) => e.name.endsWith(".outset"));
    const style = [
      inset ? `--docs-effect-stroke-inset: var(${inset.cssVariable})` : "",
      outset ? `--docs-effect-stroke-outset: var(${outset.cssVariable})` : "",
    ]
      .filter(Boolean)
      .join("; ");

    return [
      {
        entries: entries.map(toMeta),
        preview: `<div class="preview" style="${escapeHtml(style)}"></div>`,
      },
    ];
  }

  return entries.map((entry) => ({
    entries: [toMeta(entry)],
    preview: previewFor(group, entry.cssVariable),
  }));
};

const groups: FoundationsGroup[] = Array.from(
  entriesByGroup,
  ([group, entries]) => ({
    label: formatEffectGroupLabel(group),
    rows: rowsFor(group, entries),
  }),
);

export default class Effect {
  data() {
    return {
      layout: "base.11ty.ts",
      permalink: "/effect/",
      description: effectData.strapline,
      title: effectData.title,
    };
  }

  render(data: PageData): string {
    return renderFoundationsPage({
      docsClass: "docs-effect",
      groups,
      strapline: data.effect.strapline,
      title: data.effect.title,
    });
  }
}
