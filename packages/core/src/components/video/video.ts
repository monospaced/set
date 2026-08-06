import { serializeSetNode, type SetNode } from "../../helpers/node";
import { normalizeOptionalHtmlId } from "../../helpers/string";
import type { SetComponentSpec } from "../../spec";

export type SetVideoFit = "intrinsic" | "fluid";
export type SetVideoPreload = "auto" | "metadata" | "none";

export interface SetVideoProps {
  /** Emit `autoplay`. Browsers only honor it when `muted` is also set (and `playsInline` on iOS). @default false */
  autoPlay?: boolean;
  /** Emit `controls`, showing the browser's native playback UI. @default false */
  controls?: boolean;
  /** Layout mode. `intrinsic` renders at the video's own dimensions. `fluid` scales to the container's full inline size, preserving the video's aspect ratio. @default "intrinsic" */
  fit?: SetVideoFit;
  /** Height in pixels. Sets the intrinsic `<video>` height attribute; under `fluid` it serves as an aspect-ratio hint (rendered size follows the container). */
  height?: number;
  /** DOM id. */
  id?: string;
  /** Emit `loop`, restarting playback when the video ends. @default false */
  loop?: boolean;
  /** Emit `muted`, starting playback silent. Required for `autoPlay` to take effect in most browsers. @default false */
  muted?: boolean;
  /** Emit `playsinline`, playing inline instead of fullscreen on iOS. Required for `autoPlay` on iOS. @default false */
  playsInline?: boolean;
  /** Image URL shown before playback begins (HTML `video[poster]`). */
  poster?: string;
  /** Preload hint (HTML `video[preload]`). Omitted by default, deferring to the browser. */
  preload?: SetVideoPreload;
  /** Video source URL. */
  src: string;
  /** Width in pixels. Sets the intrinsic `<video>` width attribute; under `fluid` it serves as an aspect-ratio hint (rendered size follows the container). */
  width?: number;
}

/**
 * Builds the IR tree for the Set video component.
 *
 * @param props - Video component props.
 * @returns IR node for video markup.
 */
export function buildSetVideo({
  autoPlay,
  controls,
  fit = "intrinsic",
  height,
  id,
  loop,
  muted,
  playsInline,
  poster,
  preload,
  src,
  width,
}: SetVideoProps): SetNode {
  const normalizedId = normalizeOptionalHtmlId(id);
  const normalizedSrc = src.trim();
  const normalizedPoster = poster?.trim();

  if (!normalizedSrc) {
    throw new Error("src must be a non-empty string.");
  }

  const videoNode: SetNode = {
    kind: "element",
    tag: "video",
    attrs: {
      autoplay: Boolean(autoPlay),
      class: "video",
      controls: Boolean(controls),
      height: height ? String(height) : undefined,
      loop: Boolean(loop),
      muted: Boolean(muted),
      playsinline: Boolean(playsInline),
      poster: normalizedPoster || undefined,
      preload,
      src: normalizedSrc,
      width: width ? String(width) : undefined,
    },
    children: [],
  };

  return {
    kind: "element",
    tag: "div",
    attrs: {
      class: "set-video",
      "data-fluid": fit === "fluid",
      id: normalizedId,
    },
    children: [videoNode],
  };
}

/**
 * SSR renderer for the Set video component.
 *
 * @param props - Video component props.
 * @returns HTML string for video markup.
 */
export function renderSetVideo(props: SetVideoProps): string {
  return serializeSetNode(buildSetVideo(props));
}

/** Declarative video contract mirror for tooling, docs, and adapters. */
export const SET_VIDEO_SPEC: SetComponentSpec = {
  name: "video",
  description:
    "Use `video` to render a video with intrinsic or fluid fit and native playback behavior.",
  output: { element: "div", class: "set-video" },
  content: { kind: "none" },
  props: {
    autoPlay: {
      default: false,
      description:
        "Starts playback automatically. Browsers only honor this when `muted` is also set.",
      type: { kind: "boolean" },
    },
    controls: {
      default: false,
      description: "Shows the browser's native playback controls.",
      type: { kind: "boolean" },
    },
    fit: {
      default: "intrinsic",
      description:
        "Layout mode. `intrinsic` renders at the video's own dimensions, `fluid` scales to the container's full inline size at the video's aspect ratio.",
      type: { kind: "enum", values: ["intrinsic", "fluid"] },
    },
    height: {
      description: "Intrinsic height in pixels.",
      type: { kind: "number" },
    },
    id: {
      description: "DOM id.",
      type: { kind: "string" },
    },
    loop: {
      default: false,
      description: "Restarts playback when the video ends.",
      type: { kind: "boolean" },
    },
    muted: {
      default: false,
      description:
        "Starts playback silent. Required for `autoPlay` to take effect in most browsers.",
      type: { kind: "boolean" },
    },
    playsInline: {
      default: false,
      description:
        "Plays inline instead of fullscreen on iOS. Required for `autoPlay` on iOS.",
      type: { kind: "boolean" },
    },
    poster: {
      description: "Image URL shown before playback begins.",
      type: { kind: "string" },
    },
    preload: {
      description:
        "Preload hint. Omitted by default, deferring to the browser.",
      type: { kind: "enum", values: ["auto", "metadata", "none"] },
    },
    src: {
      description: "Video source URL.",
      required: true,
      type: { kind: "string" },
    },
    width: {
      description: "Intrinsic width in pixels.",
      type: { kind: "number" },
    },
  },
  events: {},
  rules: {
    attributes: [
      {
        target: { on: "host" },
        attribute: "data-fluid",
        condition: { kind: "when-equals", prop: "fit", to: "fluid" },
      },
      {
        target: { on: "host" },
        attribute: "id",
        condition: { kind: "when-non-empty", prop: "id" },
        value: { kind: "prop", prop: "id" },
      },
      {
        target: { on: "descendant", selector: "video" },
        attribute: "class",
        condition: { kind: "always" },
        value: { kind: "literal", text: "video" },
      },
      {
        target: { on: "descendant", selector: "video" },
        attribute: "src",
        condition: { kind: "always" },
        value: { kind: "template", pattern: "{src}" },
      },
      {
        target: { on: "descendant", selector: "video" },
        attribute: "autoplay",
        condition: { kind: "when-truthy", prop: "autoPlay" },
      },
      {
        target: { on: "descendant", selector: "video" },
        attribute: "controls",
        condition: { kind: "when-truthy", prop: "controls" },
      },
      {
        target: { on: "descendant", selector: "video" },
        attribute: "loop",
        condition: { kind: "when-truthy", prop: "loop" },
      },
      {
        target: { on: "descendant", selector: "video" },
        attribute: "muted",
        condition: { kind: "when-truthy", prop: "muted" },
      },
      {
        target: { on: "descendant", selector: "video" },
        attribute: "playsinline",
        condition: { kind: "when-truthy", prop: "playsInline" },
      },
      {
        target: { on: "descendant", selector: "video" },
        attribute: "poster",
        condition: { kind: "when-non-empty", prop: "poster" },
        value: { kind: "prop", prop: "poster" },
      },
      {
        target: { on: "descendant", selector: "video" },
        attribute: "preload",
        condition: { kind: "when-provided", prop: "preload" },
        value: { kind: "prop", prop: "preload" },
      },
    ],
  },
};
