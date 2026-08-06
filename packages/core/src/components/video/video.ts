import { serializeSetNode, type SetNode } from "../../helpers/node";
import { normalizeOptionalHtmlId } from "../../helpers/string";
import type { SetComponentSpec } from "../../spec";

export const SET_VIDEO_TAG_NAME = "set-video";

export type SetVideoFit = "intrinsic" | "fluid";
export type SetVideoPreload = "auto" | "metadata" | "none";

export interface SetVideoProps {
  /** Starts playback automatically. @default false */
  autoPlay?: boolean;
  /** Shows native playback controls. @default false */
  controls?: boolean;
  /** Layout mode. @default "intrinsic" */
  fit?: SetVideoFit;
  /** Intrinsic height in pixels. */
  height?: number;
  /** DOM id. */
  id?: string;
  /** Restarts playback when the video ends. @default false */
  loop?: boolean;
  /** Starts playback silent. @default false */
  muted?: boolean;
  /** Plays inline instead of fullscreen on iOS. @default false */
  playsInline?: boolean;
  /** Image URL shown before playback begins. */
  poster?: string;
  /** Preload hint (HTML `video[preload]`). */
  preload?: SetVideoPreload;
  /** Video source URL. */
  src: string;
  /** Intrinsic width in pixels. */
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
    tag: SET_VIDEO_TAG_NAME,
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
 * Emits meaningful light-DOM HTML inside a `set-video` host. When `autoPlay`
 * is set, runtime hydration pauses playback while the user prefers reduced
 * motion and resumes it if the preference relaxes.
 *
 * @param props - Video component props.
 * @returns HTML string for video markup.
 */
export function renderSetVideo(props: SetVideoProps): string {
  return serializeSetNode(buildSetVideo(props));
}

const reducedMotionMedia = "(prefers-reduced-motion: reduce)";

/**
 * Defines the `set-video` custom element runtime.
 *
 * Safe to call multiple times. Existing SSR-rendered `set-video` hosts will
 * upgrade in place. Hosts whose video declares `autoplay` are paused while
 * `(prefers-reduced-motion: reduce)` matches — the `autoplay` attribute is
 * withdrawn so pending playback cannot start — and resume when it stops
 * matching.
 */
export function defineSetVideo(): void {
  if (customElements.get(SET_VIDEO_TAG_NAME)) return;

  class SetVideoElement extends HTMLElement {
    #autoPlayIntent = false;
    #mediaQuery: MediaQueryList | undefined;
    #onMediaChange: (() => void) | undefined;

    connectedCallback(): void {
      const video = this.querySelector("video");
      if (!video) return;

      this.#autoPlayIntent ||= video.hasAttribute("autoplay");
      if (!this.#autoPlayIntent) return;

      const windowRef = this.ownerDocument.defaultView;
      if (!windowRef || typeof windowRef.matchMedia !== "function") return;

      this.#mediaQuery = windowRef.matchMedia(reducedMotionMedia);
      this.#onMediaChange = () => {
        this.#syncPlayback();
      };
      this.#mediaQuery.addEventListener("change", this.#onMediaChange);
      this.#syncPlayback();
    }

    disconnectedCallback(): void {
      if (this.#mediaQuery && this.#onMediaChange) {
        this.#mediaQuery.removeEventListener("change", this.#onMediaChange);
      }
      this.#mediaQuery = undefined;
      this.#onMediaChange = undefined;
    }

    #syncPlayback(): void {
      const video = this.querySelector("video");
      if (!video || !this.#mediaQuery) return;

      if (this.#mediaQuery.matches) {
        video.removeAttribute("autoplay");
        video.pause();
      } else {
        video.setAttribute("autoplay", "");
        if (video.paused) {
          void video.play()?.catch?.(() => {});
        }
      }
    }
  }

  customElements.define(SET_VIDEO_TAG_NAME, SetVideoElement);
}

/** Declarative video contract mirror for tooling, docs, and adapters. */
export const SET_VIDEO_SPEC: SetComponentSpec = {
  name: "video",
  description:
    "Use `video` to render a video with intrinsic or fluid fit and native playback behavior.",
  output: { element: SET_VIDEO_TAG_NAME, class: "set-video" },
  content: { kind: "none" },
  props: {
    autoPlay: {
      default: false,
      description:
        "Starts playback automatically. Browsers only honor this when `muted` is also set. Suspended when the user prefers reduced motion.",
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
      description:
        "Intrinsic height in pixels. With `width`, reserves the correctly shaped box before the media loads; rendered height always follows the aspect ratio.",
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
      description:
        "Intrinsic width in pixels. Sets the rendered width, capped at the container; under `fluid`, an aspect-ratio hint only.",
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
