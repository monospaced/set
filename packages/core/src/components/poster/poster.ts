import { serializeSetNode, type SetNode } from "../../helpers/node";
import { normalizeOptionalHtmlId } from "../../helpers/string";
import type { SetComponentSpec } from "../../spec";
import { renderSetImage, type SetImageGravity } from "../image/image";
import type { SetTheme } from "../root/root";
import type { SetSurfaceVariant } from "../surface/surface";

export type SetPosterSurface = Exclude<
  SetSurfaceVariant,
  "inverse" | "brand-inverse"
>;

declare const __posterMediaBrand: unique symbol;
/**
 * HTML string returned by `renderSetPosterImage`. The branded type forces
 * consumers through the helper, which locks the cover/priority defaults
 * Poster's layout needs.
 */
export type SetPosterMedia = string & {
  readonly [__posterMediaBrand]: true;
};

export interface SetPosterImageProps {
  /** Focal gravity for the cover crop. @default "C" */
  gravity?: SetImageGravity;
  /** HTML `sizes` attribute. */
  sizes?: string;
  /** Image source URL. */
  src: string;
  /** Candidate sources for the image (HTML `img[srcset]` format). */
  srcSet?: string;
}

/**
 * Renders the image media for a Poster. `cover` and `priority` are locked
 * to the values Poster's layout needs; `alt` is empty because Poster's
 * image is decorative (content-over-background).
 *
 * @param props - Poster image props.
 * @returns HTML string suitable for Poster's `media` prop.
 */
export function renderSetPosterImage(
  props: SetPosterImageProps,
): SetPosterMedia {
  return renderSetImage({
    ...props,
    alt: "",
    cover: true,
    priority: true,
  }) as SetPosterMedia;
}

export interface SetPosterProps {
  /** Foreground HTML content above the media. Caller sanitizes untrusted content. */
  children?: string;
  /** Absolute theme lock for foreground content over non-themeable media. */
  contentTheme?: SetTheme;
  /** DOM id. */
  id?: string;
  /** Background media; build with `renderSetPosterImage`. */
  media: SetPosterMedia;
  /** Surface context. Emits `data-set-surface` when provided. */
  surface?: SetPosterSurface;
}

/**
 * Builds the IR tree for the Set poster component.
 *
 * @param props - Poster component props.
 * @returns IR node for a poster container.
 */
export function buildSetPoster({
  children,
  contentTheme,
  id,
  media,
  surface,
}: SetPosterProps): SetNode {
  const normalizedId = normalizeOptionalHtmlId(id);
  const resolvedSurface = contentTheme ? (surface ?? "default") : surface;
  const posterChildren: SetNode[] = [
    {
      kind: "element",
      tag: "div",
      attrs: { class: "image-wrapper" },
      children: [{ kind: "raw", html: media }],
    },
  ];

  if (children) {
    posterChildren.push({
      kind: "element",
      tag: "div",
      attrs: { class: "content" },
      children: [{ kind: "raw", html: children }],
    });
  }

  return {
    kind: "element",
    tag: "div",
    attrs: {
      class: "set-poster",
      "data-set-content-theme": contentTheme,
      "data-set-surface": resolvedSurface,
      id: normalizedId,
    },
    children: posterChildren,
  };
}

/**
 * SSR renderer for the Set poster component.
 *
 * Emits a single `div.poster` root containing a media wrapper behind optional
 * trusted foreground content. `contentTheme`, when provided, is an absolute
 * local foreground theme override intended for poster-like content over
 * non-themeable media.
 *
 * @param props - Poster component props.
 * @returns HTML string for a poster container.
 */
export function renderSetPoster(props: SetPosterProps): string {
  return serializeSetNode(buildSetPoster(props));
}

/** Declarative poster contract mirror for tooling, docs, and adapters. */
export const SET_POSTER_SPEC: SetComponentSpec = {
  name: "poster",
  description: "Use `poster` to layer content over background media.",
  output: { element: "div", class: "set-poster" },
  content: {
    kind: "slots",
    slots: [
      { prop: "media", kind: "html" },
      { prop: "children", kind: "html" },
    ],
  },
  props: {
    children: {
      description: "Foreground content rendered over the media.",
      type: { kind: "html" },
    },
    contentTheme: {
      description:
        "Absolute theme lock for foreground content over non-themeable media.",
      type: { kind: "enum", values: ["light", "dark"] },
    },
    id: {
      description: "DOM id.",
      type: { kind: "string" },
    },
    media: {
      description:
        "Background media markup. Build with `renderSetPosterImage`.",
      required: true,
      type: { kind: "html" },
    },
    surface: {
      description: "Surface context.",
      type: { kind: "enum", values: ["default", "brand"] },
    },
  },
  events: {},
  rules: {
    attributes: [
      {
        target: { on: "host" },
        attribute: "data-set-content-theme",
        condition: { kind: "when-provided", prop: "contentTheme" },
        value: { kind: "prop", prop: "contentTheme" },
      },
      {
        target: { on: "host" },
        attribute: "data-set-surface",
        condition: {
          kind: "all",
          of: [
            { kind: "when-provided", prop: "contentTheme" },
            { kind: "not", of: { kind: "when-provided", prop: "surface" } },
          ],
        },
        value: { kind: "literal", text: "default" },
      },
      {
        target: { on: "host" },
        attribute: "data-set-surface",
        condition: { kind: "when-provided", prop: "surface" },
        value: { kind: "prop", prop: "surface" },
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
