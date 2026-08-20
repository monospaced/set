import { serializeSetNode, type SetNode } from "../../helpers/node";
import { normalizeOptionalHtmlId } from "../../helpers/string";
import type { SetComponentSpec } from "../../spec";

export type SetImageAspectRatio = "1:1" | "4:5" | "3:2" | "16:9" | "21:9";
export type SetImageFit = "intrinsic" | "fluid" | "cover";
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
export type SetImageScheme = "light" | "dark";
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
  /** Show the light or dark variant to match the surrounding scheme. @default false */
  adaptive?: boolean;
  /** Alternative text. Empty string is valid and used by default. @default "" */
  alt?: string;
  /** Aspect ratio applied to the wrapper. */
  aspectRatio?: SetImageAspectRatio;
  /** Layout mode. @default "intrinsic" */
  fit?: SetImageFit;
  /** Enables default image shadow treatment. @default false */
  shadow?: boolean;
  /** Height in pixels. */
  height?: number;
  /** DOM id. */
  id?: string;
  /** Emit `loading="lazy"` on the image. @default false */
  lazy?: boolean;
  /** Emit `fetchpriority="high"` and suppress `loading="lazy"`. @default false */
  priority?: boolean;
  /** Focal gravity for the cover crop. @default "C" */
  gravity?: SetImageGravity;
  /** Applies the default corner radius. @default false */
  radius?: boolean;
  /** HTML `sizes` attribute. */
  sizes?: string;
  /** Responsive source-set definitions for `<picture>`. */
  sources?: SetImageSource[];
  /** Candidate sources for the fallback `<img>` (HTML `img[srcset]` format). */
  srcSet?: string;
  /** Image source URL. */
  src: string;
  /** Width in pixels. */
  width?: number;
}

/**
 * Builds the IR tree for the Set image component.
 *
 * @param props - Image component props.
 * @returns IR node for image/picture markup.
 */
export function buildSetImage({
  adaptive,
  alt = "",
  aspectRatio,
  fit = "intrinsic",
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
  const cover = fit === "cover";
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

  if (
    adaptive &&
    [
      normalizedSrc,
      normalizedSrcSet,
      ...normalizedSources.map((source) => source.srcSet),
    ].some((url) => url?.includes("#"))
  ) {
    throw new Error("adaptive sources must not contain URL fragments.");
  }

  // Split like the browser: comma + whitespace, so embedded URL commas
  // survive. Anything beyond URL + one descriptor is ambiguous — throw.
  const withScheme = (srcSet: string, scheme: SetImageScheme): string =>
    srcSet
      .split(/,\s+/)
      .map((candidate) => {
        const [url, ...descriptor] = candidate.trim().split(/\s+/);
        if (!url || descriptor.length > 1) {
          throw new Error(
            "adaptive srcSet candidates must be a URL plus at most one descriptor, separated by a comma and whitespace.",
          );
        }
        return [`${url}#${scheme}`, ...descriptor].join(" ");
      })
      .join(", ");

  const buildMediaNode = (scheme?: SetImageScheme): SetNode => {
    const imgNode: SetNode = {
      kind: "element",
      tag: "img",
      attrs: {
        alt,
        class: "img",
        "data-scheme":
          scheme && normalizedSources.length === 0 ? scheme : undefined,
        fetchpriority: priority ? "high" : undefined,
        height: cover ? undefined : height ? String(height) : undefined,
        loading: lazy && !priority ? "lazy" : undefined,
        sizes:
          normalizedSources.length > 0
            ? undefined
            : normalizedSizes || undefined,
        src: scheme ? `${normalizedSrc}#${scheme}` : normalizedSrc,
        srcset:
          normalizedSrcSet && scheme
            ? withScheme(normalizedSrcSet, scheme)
            : normalizedSrcSet || undefined,
        width: cover ? undefined : width ? String(width) : undefined,
      },
      children: [],
    };

    if (normalizedSources.length === 0) {
      return imgNode;
    }

    const sourceNodes: SetNode[] = normalizedSources.map((source) => ({
      kind: "element",
      tag: "source",
      attrs: {
        height: source.height ? String(source.height) : undefined,
        media: source.media,
        sizes: source.sizes,
        srcset: scheme ? withScheme(source.srcSet, scheme) : source.srcSet,
        type: source.type,
        width: source.width ? String(source.width) : undefined,
      },
      children: [],
    }));
    return {
      kind: "element",
      tag: "picture",
      attrs: { "data-scheme": scheme },
      children: [...sourceNodes, imgNode],
    };
  };

  const mediaNodes: SetNode[] = adaptive
    ? [buildMediaNode("light"), buildMediaNode("dark")]
    : [buildMediaNode()];

  const styleChunks: string[] = [];
  if (height) styleChunks.push(`--set-image-block-size: ${height / 16}rem`);
  if (width) styleChunks.push(`--set-image-inline-size: ${width / 16}rem`);

  return {
    kind: "element",
    tag: "div",
    attrs: {
      class: "set-image",
      "data-adaptive": Boolean(adaptive),
      "data-aspect-ratio": cover && !height ? aspectRatio : undefined,
      "data-fluid": fit === "fluid",
      "data-gravity": cover && gravity !== "C" ? gravity : undefined,
      "data-shadow": Boolean(shadow),
      "data-object-fit": cover ? "cover" : undefined,
      "data-radius": Boolean(radius),
      id: normalizedId,
      style: styleChunks.length > 0 ? styleChunks.join("; ") : undefined,
    },
    children: mediaNodes,
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
    "Use `image` to render a responsive image with intrinsic, fluid, or cover fit, and optional art-directed `sources`.",
  output: { element: "div", class: "set-image" },
  content: { kind: "none" },
  props: {
    adaptive: {
      default: false,
      description:
        "Shows the image's light or dark variant to match the surrounding color scheme. Use with adaptive assets exported from Screen, which carry both variants in one file; the component selects one by adding `#light`/`#dark` to the URL.",
      type: { kind: "boolean" },
    },
    alt: {
      default: "",
      description: "Alternative text. Leave empty for decorative images.",
      type: { kind: "string" },
    },
    gravity: {
      default: "C",
      description: "Focal point used when cropping.",
      ignoredWhen: '`fit` is not `"cover"`',
      type: {
        kind: "enum",
        values: ["N", "NE", "E", "SE", "S", "SW", "W", "NW", "C"],
      },
    },
    radius: {
      default: false,
      description: "Applies the default corner radius.",
      type: { kind: "boolean" },
    },
    aspectRatio: {
      description: "Aspect ratio applied to the wrapper.",
      ignoredWhen: '`fit` is not `"cover"`, or `height` is set',
      type: {
        kind: "enum",
        values: ["1:1", "4:5", "3:2", "16:9", "21:9"],
      },
    },
    fit: {
      default: "intrinsic",
      description:
        "Layout mode. `intrinsic` renders at the image's own dimensions, `fluid` scales to the container's full inline size at the active source's aspect ratio, `cover` renders a cropped fill (`object-fit: cover`) sized by the wrapper. For `fluid`, provide candidates sized for large viewports via `srcSet`/`sources` so upscaled rendering stays sharp.",
      type: { kind: "enum", values: ["intrinsic", "fluid", "cover"] },
    },
    shadow: {
      default: false,
      description: "Applies a drop shadow to the image.",
      type: { kind: "boolean" },
    },
    height: {
      description:
        "Height in pixels. Under `intrinsic` and `fluid`, an aspect-ratio hint — with `width`, reserves the correctly shaped box before load; rendered height follows the aspect ratio. Under `cover`, the wrapper's block size, overriding `aspectRatio`.",
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
      ignoredWhen: "`sources` are provided",
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
        "Width in pixels. Under `intrinsic`, the rendered width, capped at the container; under `fluid`, an aspect-ratio hint; under `cover`, the wrapper's inline size (`aspectRatio` still derives the block size while `height` is unset).",
      type: { kind: "number" },
    },
  },
  events: {},
  rules: {
    attributes: [
      {
        target: { on: "host" },
        attribute: "data-adaptive",
        condition: { kind: "when-truthy", prop: "adaptive" },
      },
      {
        target: { on: "host" },
        attribute: "data-object-fit",
        condition: { kind: "when-equals", prop: "fit", to: "cover" },
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
        condition: { kind: "when-truthy", prop: "radius" },
      },
      {
        target: { on: "host" },
        attribute: "data-fluid",
        condition: { kind: "when-equals", prop: "fit", to: "fluid" },
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
