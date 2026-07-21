import { type SetNode, serializeSetNode } from "../../helpers/node";
import { normalizeOptionalHtmlId } from "../../helpers/string";
import type { SetComponentSpec } from "../../spec";

export type SetImageAspectRatio = "1:1" | "4:5" | "3:2" | "16:9" | "21:9";
export type SetImageGravity =
  | "N"
  | "NE"
  | "E"
  | "SE"
  | "S"
  | "SW"
  | "W"
  | "NW"
  | "C";
export type SetImageRadius = "xs" | "ratio";

export interface SetImageSource {
  /**
   * The intrinsic height of the source, in pixels.
   */
  height?: number;
  /**
   * Media condition that is evaluated for the source.
   * Same format as the HTML `source[media]` attribute.
   */
  media?: string;
  /**
   * The HTML `sizes` attribute for the source.
   */
  sizes?: string;
  /**
   * A comma-separated list of candidate image sources.
   * Same format as the HTML `source[srcset]` attribute.
   */
  srcSet: string;
  /**
   * MIME type for the `srcSet` resources.
   */
  type?: string;
  /**
   * The intrinsic width of the source, in pixels.
   */
  width?: number;
}

export interface SetImageProps {
  /** Alternative text. Empty string is valid and used by default. @default "" */
  alt?: string;
  /** Aspect ratio applied to the wrapper. Only used when `cover` is true; ignored when both `width` and `height` are set. */
  aspectRatio?: SetImageAspectRatio;
  /** Renders the image as a cropped fill (`object-fit: cover`). Switches `width`/`height` from intrinsic `<img>` dimensions to wrapper sizing. @default false */
  cover?: boolean;
  /** Enables default image shadow treatment. @default false */
  shadow?: boolean;
  /** Height in pixels. When `cover` is false, sets the intrinsic `<img>` height attribute. When `cover` is true, sizes the wrapper; if only one of `width`/`height` is set, the wrapper still follows `aspectRatio`, but setting both takes precedence over `aspectRatio`. */
  height?: number;
  /** DOM id. */
  id?: string;
  /** Emit `loading="lazy"` on the image. @default false */
  lazy?: boolean;
  /** Emit `fetchpriority="high"` and suppress `loading="lazy"`. @default false */
  priority?: boolean;
  /** Focal gravity for cover fit. @default "C" */
  gravity?: SetImageGravity;
  /** Radius strategy. `ratio` scales with the image's shortest side — requires `width`/`height` (or `cover` with `aspectRatio`) to determine it, otherwise falls back to `xs`. Omitted by default. */
  radius?: SetImageRadius;
  /** HTML `sizes` attribute. Ignored on `<img>` when `sources` are provided. */
  sizes?: string;
  /** Responsive source-set definitions for `<picture>`. */
  sources?: SetImageSource[];
  /** Candidate sources for the fallback `<img>` (HTML `img[srcset]` format). */
  srcSet?: string;
  /** Image source URL. */
  src: string;
  /** Width in pixels. When `cover` is false, sets the intrinsic `<img>` width attribute. When `cover` is true, sizes the wrapper; if only one of `width`/`height` is set, the wrapper still follows `aspectRatio`, but setting both takes precedence over `aspectRatio`. */
  width?: number;
}

/**
 * Builds the IR tree for the Set image component.
 *
 * @param props - Image component props.
 * @returns IR node for image/picture markup.
 */
export function buildSetImage({
  alt = "",
  aspectRatio,
  cover,
  gravity = "C",
  height,
  id,
  lazy,
  priority,
  radius,
  shadow,
  sizes,
  sources,
  src,
  srcSet,
  width,
}: SetImageProps): SetNode {
  const normalizedId = normalizeOptionalHtmlId(id);
  const normalizedSrc = src.trim();
  const normalizedSrcSet = srcSet?.trim();
  const normalizedSizes = sizes?.trim();
  const normalizedSources =
    sources?.map((source, index) => {
      const normalizedSrcSet = source.srcSet.trim();
      const normalizedMedia = source.media?.trim();
      const normalizedType = source.type?.trim();
      const normalizedSourceSizes = source.sizes?.trim();

      if (!normalizedSrcSet) {
        throw new Error(`sources[${index}].srcSet must be non-empty.`);
      }

      return {
        height: source.height,
        media: normalizedMedia || undefined,
        sizes: normalizedSourceSizes || undefined,
        srcSet: normalizedSrcSet,
        type: normalizedType || undefined,
        width: source.width,
      };
    }) || [];

  if (!normalizedSrc) {
    throw new Error("src must be a non-empty string.");
  }

  const imgNode: SetNode = {
    kind: "element",
    tag: "img",
    attrs: {
      alt,
      class: "img",
      fetchpriority: priority ? "high" : undefined,
      height: cover ? undefined : height ? String(height) : undefined,
      loading: lazy && !priority ? "lazy" : undefined,
      sizes:
        normalizedSources.length > 0 ? undefined : normalizedSizes || undefined,
      src: normalizedSrc,
      srcset: normalizedSrcSet || undefined,
      width: cover ? undefined : width ? String(width) : undefined,
    },
    children: [],
  };

  let imageNode: SetNode;
  if (normalizedSources.length > 0) {
    const sourceNodes: SetNode[] = normalizedSources.map((source) => ({
      kind: "element",
      tag: "source",
      attrs: {
        height: source.height ? String(source.height) : undefined,
        media: source.media,
        sizes: source.sizes,
        srcset: source.srcSet,
        type: source.type,
        width: source.width ? String(source.width) : undefined,
      },
      children: [],
    }));
    imageNode = {
      kind: "element",
      tag: "picture",
      attrs: {},
      children: [...sourceNodes, imgNode],
    };
  } else {
    imageNode = imgNode;
  }

  const styleChunks: string[] = [];
  if (height) styleChunks.push(`--set-image-block-size: ${height / 16}rem`);
  if (width) styleChunks.push(`--set-image-inline-size: ${width / 16}rem`);

  return {
    kind: "element",
    tag: "div",
    attrs: {
      class: "set-image",
      "data-aspect-ratio":
        cover && !(height && width) ? aspectRatio : undefined,
      "data-gravity": cover && gravity !== "C" ? gravity : undefined,
      "data-shadow": Boolean(shadow),
      "data-object-fit": cover ? "cover" : undefined,
      "data-radius": radius,
      id: normalizedId,
      style: styleChunks.length > 0 ? styleChunks.join("; ") : undefined,
    },
    children: [imageNode],
  };
}

/**
 * SSR renderer for the Set image component.
 *
 * @param props - Image component props.
 * @returns HTML string for image/picture markup.
 */
export function renderSetImage(props: SetImageProps): string {
  return serializeSetNode(buildSetImage(props));
}

/** Declarative image contract mirror for tooling, docs, and adapters. */
export const SET_IMAGE_SPEC: SetComponentSpec = {
  name: "image",
  description:
    "Use `image` to render a responsive image with optional cover fit.",
  output: { element: "div", class: "set-image" },
  content: { kind: "none" },
  props: {
    alt: {
      default: "",
      description: "Alternative text. Leave empty for decorative images.",
      type: { kind: "string" },
    },
    gravity: {
      default: "C",
      description: "Focal point used when cropping.",
      ignoredWhen: "`cover` is false",
      type: {
        kind: "enum",
        values: ["N", "NE", "E", "SE", "S", "SW", "W", "NW", "C"],
      },
    },
    radius: {
      description:
        "Corner radius treatment. `ratio` scales with the image's shortest side — requires `width`/`height` (or `cover` with `aspectRatio`) to determine this, otherwise falls back to `xs`.",
      type: { kind: "enum", values: ["xs", "ratio"] },
    },
    aspectRatio: {
      description: "Aspect ratio applied to the wrapper.",
      ignoredWhen: "`cover` is false, or both `width` and `height` are set",
      type: {
        kind: "enum",
        values: ["1:1", "4:5", "3:2", "16:9", "21:9"],
      },
    },
    cover: {
      default: false,
      description:
        "Renders the image as a cropped fill (`object-fit: cover`). Switches `width`/`height` from intrinsic `<img>` dimensions to wrapper sizing.",
      type: { kind: "boolean" },
    },
    shadow: {
      default: false,
      description: "Applies a drop shadow to the image.",
      type: { kind: "boolean" },
    },
    height: {
      description:
        "Height in pixels. When `cover` is false, sets the intrinsic `<img>` height. When `cover` is true, sizes the wrapper — alone it defers to `aspectRatio`, together with `width` it overrides `aspectRatio`.",
      type: { kind: "number" },
    },
    id: {
      description: "DOM id.",
      type: { kind: "string" },
    },
    lazy: {
      default: false,
      description: "Defers loading until the image is near the viewport.",
      type: { kind: "boolean" },
    },
    priority: {
      default: false,
      description: "Marks the image as high priority for fetch.",
      type: { kind: "boolean" },
    },
    sizes: {
      description: "`sizes` attribute used with `srcSet`.",
      type: { kind: "string" },
    },
    sources: {
      description: "Responsive sources rendered inside a `<picture>`.",
      type: {
        kind: "array",
        itemShape: {
          height: {
            description: "Intrinsic height in pixels.",
            type: { kind: "number" },
          },
          media: {
            description: "`media` condition evaluated for the source.",
            type: { kind: "string" },
          },
          sizes: {
            description: "`sizes` attribute for the source.",
            type: { kind: "string" },
          },
          srcSet: {
            description: "Candidate sources for this media entry.",
            required: true,
            type: { kind: "string" },
          },
          type: {
            description: "MIME type for the source resources.",
            type: { kind: "string" },
          },
          width: {
            description: "Intrinsic width in pixels.",
            type: { kind: "number" },
          },
        },
      },
    },
    srcSet: {
      description: "Candidate sources for the fallback image.",
      type: { kind: "string" },
    },
    src: {
      description: "Image source URL.",
      required: true,
      type: { kind: "string" },
    },
    width: {
      description:
        "Width in pixels. When `cover` is false, sets the intrinsic `<img>` width. When `cover` is true, sizes the wrapper — alone it defers to `aspectRatio`, together with `height` it overrides `aspectRatio`.",
      type: { kind: "number" },
    },
  },
  events: {},
  rules: {
    attributes: [
      {
        target: { on: "host" },
        attribute: "data-object-fit",
        condition: { kind: "when-truthy", prop: "cover" },
        value: { kind: "literal", text: "cover" },
      },
      {
        target: { on: "host" },
        attribute: "data-shadow",
        condition: { kind: "when-truthy", prop: "shadow" },
      },
      {
        target: { on: "host" },
        attribute: "data-radius",
        condition: { kind: "when-provided", prop: "radius" },
        value: { kind: "prop", prop: "radius" },
      },
      {
        target: { on: "descendant", selector: "img" },
        attribute: "class",
        condition: { kind: "always" },
        value: { kind: "literal", text: "img" },
      },
      {
        target: { on: "descendant", selector: "img" },
        attribute: "alt",
        condition: { kind: "always" },
        value: { kind: "prop", prop: "alt" },
      },
      {
        target: { on: "descendant", selector: "img" },
        attribute: "src",
        condition: { kind: "always" },
        value: { kind: "template", pattern: "{src}" },
      },
      {
        target: { on: "descendant", selector: "img" },
        attribute: "srcset",
        condition: { kind: "when-non-empty", prop: "srcSet" },
        value: { kind: "prop", prop: "srcSet" },
      },
      {
        target: { on: "descendant", selector: "img" },
        attribute: "fetchpriority",
        condition: { kind: "when-truthy", prop: "priority" },
        value: { kind: "literal", text: "high" },
      },
      {
        target: { on: "descendant", selector: "img" },
        attribute: "loading",
        condition: {
          kind: "all",
          of: [
            { kind: "when-truthy", prop: "lazy" },
            { kind: "not", of: { kind: "when-truthy", prop: "priority" } },
          ],
        },
        value: { kind: "literal", text: "lazy" },
      },
      {
        target: { on: "host" },
        attribute: "id",
        condition: { kind: "when-non-empty", prop: "id" },
        value: { kind: "prop", prop: "id" },
      },
    ],
  },
};
