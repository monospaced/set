import { createRequire } from "node:module";

import { renderSetButton } from "@measured/set-core";

import type { MotionData } from "./_data/motion";
import motionData from "./_data/motion";
import {
  escapeHtml,
  type FoundationsGroup,
  type FoundationsRow,
  renderFoundationsPage,
  type TokenDocument,
  tokenNameToCssVariable,
} from "./_shared/foundations";

interface PageData {
  motion: MotionData;
}

interface MotionToken {
  $description?: string;
  $value?: unknown;
  layer?: string;
}

interface MotionTokenRow {
  cssVariable: string;
  description: string;
  group: string;
  name: string;
  value: unknown;
}

const require = createRequire(import.meta.url);
const mnspTokens =
  require("@measured/set-tokens/mnsp") as TokenDocument<MotionToken>;

const getMotionGroup = (name: string): string => name.split(".")[1] ?? "";

const formatMotionGroupLabel = (group: string): string =>
  group.length === 0 ? group : `${group[0].toUpperCase()}${group.slice(1)}`;

const motionTokens: MotionTokenRow[] = Object.entries(mnspTokens.tokens)
  .filter(
    ([name, token]) => name.startsWith("motion.") && token.layer === "semantic",
  )
  .map(([name, token]) => ({
    cssVariable: tokenNameToCssVariable(name),
    description: token.$description ?? "",
    group: getMotionGroup(name),
    name,
    value: token.$value,
  }));

// A constant loop is hostile, so duration is user-triggered and
// replay-forward. The brief hold before the run keeps the reset perceptible
// even when the run is instant (0ms, or any step under prefers-reduced-
// motion), so a repeat press always reads.
const durationPreview = (token: MotionTokenRow): string => {
  const duration = `var(${escapeHtml(token.cssVariable)})`;
  return `<div class="preview" style="--docs-motion-duration: ${duration}">
    ${renderSetButton({
      appearance: "text",
      icon: "play",
      label: "Run",
      labelVisibility: "hidden",
      size: "sm",
      tone: "neutral",
      type: "button",
    })}
    <span class="motion-track" data-motion-at="start">
      <span class="motion-dot"></span>
    </span>
  </div>`;
};

// Easing values are cubic-bezier control points [x1, y1, x2, y2], plotted as
// a progress curve in a 0–100 box: time x, progress y, y flipped for SVG's
// top-left origin (hence at(1 - y)). Static by design — a graph reads better
// than a one-shot animation, and never moves.
const bezierPath = (value: unknown): string | undefined => {
  if (
    !Array.isArray(value) ||
    value.length !== 4 ||
    value.some((n) => typeof n !== "number")
  ) {
    return undefined;
  }

  const [x1, y1, x2, y2] = value as number[];
  const at = (n: number): number => Number((n * 100).toFixed(2));
  return `M0 100 C${at(x1)} ${at(1 - y1)} ${at(x2)} ${at(1 - y2)} 100 0`;
};

const easingPreview = (token: MotionTokenRow): string => {
  const path = bezierPath(token.value);
  if (!path) return "";

  return `<div class="preview">
    <svg class="easing-curve" viewBox="0 0 100 100" aria-hidden="true">
      <line
        class="easing-linear"
        x1="0"
        y1="100"
        x2="100"
        y2="0"
        stroke-width="2"
        stroke-dasharray="4 6"
      />
      <path class="easing-path" d="${path}" fill="none" stroke-width="3" />
    </svg>
  </div>`;
};

const renderPreview = (token: MotionTokenRow): string => {
  if (token.group === "duration") return durationPreview(token);
  if (token.group === "easing") return easingPreview(token);
  return "";
};

const motionGroups = motionTokens.reduce<Map<string, FoundationsRow[]>>(
  (groups, token) => {
    const row: FoundationsRow = {
      entries: [
        { cssVariable: token.cssVariable, description: token.description },
      ],
      preview: renderPreview(token),
    };

    const rows = groups.get(token.group);
    if (rows) rows.push(row);
    else groups.set(token.group, [row]);

    return groups;
  },
  new Map(),
);

const groups: FoundationsGroup[] = Array.from(
  motionGroups,
  ([group, rows]) => ({ label: formatMotionGroupLabel(group), rows }),
);

// Delegated, upgrade-independent (acts on the SSR .set-button class), and
// scoped to .docs-motion so it no-ops everywhere else. Shipped with the page
// rather than the shared base template to keep that template generic.
const TRIGGER_SCRIPT = `<script type="module">
document.addEventListener("click", (event) => {
  const button = event.target.closest?.(".docs-motion .preview .set-button");
  if (!button) return;
  const track = button.closest(".preview")?.querySelector(".motion-track");
  if (!track) return;
  clearTimeout(track._setMotionTimer);
  track.dataset.motionAt = "start";
  void track.offsetWidth; // reflow so the reset registers before the run
  const hold =
    parseFloat(
      getComputedStyle(track).getPropertyValue("--set-motion-duration-600"),
    ) || 0;
  track._setMotionTimer = setTimeout(() => {
    track.dataset.motionAt = "end";
  }, hold);
});
</script>`;

export default class Motion {
  data() {
    return {
      layout: "base.11ty.ts",
      permalink: "/motion/",
      description: motionData.strapline,
      title: motionData.title,
    };
  }

  render(data: PageData): string {
    return (
      renderFoundationsPage({
        docsClass: "docs-motion",
        groups,
        strapline: data.motion.strapline,
        title: data.motion.title,
      }) + TRIGGER_SCRIPT
    );
  }
}
