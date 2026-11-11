import { createRequire } from "node:module";

import {
  renderSetButton,
  renderSetHeading,
  renderSetProse,
} from "@monospaced/set-core";
import { processMarkdown } from "@monospaced/set-markdown";

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
  require("@monospaced/set-tokens/mnsp") as TokenDocument<MotionToken>;

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

// Frame periods preview on the same track, crossing over the 3000ms duration
// in steps(n) where n is that duration divided by the period: 36, 24, 18 or 9
// visible steps. The trigger script computes n from the resolved tokens.
const framePreview = (token: MotionTokenRow): string => {
  const frame = `var(${escapeHtml(token.cssVariable)})`;
  return `<div class="preview" style="--docs-motion-duration: var(--set-motion-duration-3000); --docs-motion-frame: ${frame}">
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

const renderPreview = (token: MotionTokenRow): string => {
  if (token.group === "duration") return durationPreview(token);
  if (token.group === "easing") return easingPreview(token);
  if (token.group === "frame") return framePreview(token);
  return "";
};

const STEPPED_GRAPHICS = `
Generative and bitmap graphics redraw in discrete frames at a low rate, which suits a raster aesthetic and keeps CPU use down. The frame tokens are periods on a 24fps clock, drawn on twos, threes, fours and eights, so every piece on a page shares one cadence. A period of 0 means the brand has no motion: draw the composed still and stop. Under \`prefers-reduced-motion: reduce\`, show that still instead of animating.

In CSS, pick a duration that is a whole number of frames and step it. The 3000ms duration is 24 frames at the default period:

\`\`\`css
.dissolve {
  animation: dissolve var(--set-motion-duration-3000) steps(24);
}
\`\`\`

In a canvas loop, throttle redraws to the period instead of drawing on every \`requestAnimationFrame\`:

\`\`\`js
const period = parseFloat(
  getComputedStyle(canvas).getPropertyValue("--set-motion-frame-default"),
) * 1000;
let last = 0;
function loop(now) {
  if (period === 0) return draw(1);
  if (now - last >= period) {
    last = now;
    draw(now);
  }
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);
\`\`\`
`;

const steppedGraphics = `<div class="section">
  ${renderSetHeading({
    id: "stepped-graphics",
    level: 2,
    responsive: true,
    size: "lg",
    children: "Stepped graphics",
  })}
  ${renderSetProse({ children: processMarkdown(STEPPED_GRAPHICS) })}
</div>`;

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
  const style = getComputedStyle(track);
  const toMs = (name) => {
    const value = style.getPropertyValue(name).trim();
    return (parseFloat(value) || 0) * (value.endsWith("ms") ? 1 : 1000);
  };
  const hold = toMs("--set-motion-duration-600");
  // Frame previews step the crossing: n = run duration / frame period.
  const frame = toMs("--docs-motion-frame");
  if (frame > 0) {
    const steps = Math.max(1, Math.round(toMs("--docs-motion-duration") / frame));
    track.style.setProperty("--docs-motion-steps", String(steps));
  }
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
        after: steppedGraphics,
        docsClass: "docs-motion",
        groups,
        strapline: data.motion.strapline,
        title: data.motion.title,
      }) + TRIGGER_SCRIPT
    );
  }
}
