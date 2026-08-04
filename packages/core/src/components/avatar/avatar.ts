import { serializeSetNode, type SetNode } from "../../helpers/node";
import {
  collapseWhitespace,
  normalizeOptionalHtmlId,
} from "../../helpers/string";
import type { SetComponentSpec } from "../../spec";
import { buildSetIcon, type SetIconName } from "../icon/icon";
import { getSetInitials } from "./get-initials";

export type SetAvatarColor =
  | "neutral"
  | "01"
  | "02"
  | "03"
  | "04"
  | "05"
  | "06"
  | "07"
  | "08"
  | "09";
export type SetAvatarEntity = "bot" | "organization" | "person" | "team";
export type SetAvatarSize = "xs" | "sm" | "md" | "lg" | "xl";

const ENTITY_ICON_MAP: Record<SetAvatarEntity, SetIconName> = {
  bot: "robot-1",
  organization: "city-6",
  person: "user-1",
  team: "member",
};

const COLOR_HASH = [
  "01",
  "02",
  "03",
  "04",
  "05",
  "06",
  "07",
  "08",
  "09",
] as const;

export interface SetAvatarProps {
  /** Optional explicit accessible label. Used before `name` fallback text. */
  alt?: string;
  /** Emits `aria-hidden="true"` on the wrapper when true. @default false */
  ariaHidden?: boolean;
  /** Icon fallback identity when `src`, `initials`, and `name` are absent.
   * @default "person" */
  entity?: SetAvatarEntity;
  /** Avatar background color token. If omitted and `name` exists, color is hash-derived (01..09). */
  color?: SetAvatarColor;
  /** DOM id. */
  id?: string;
  /** Explicit initials override. Trimmed and whitespace-collapsed; alphabetic only, 1-3 characters. */
  initials?: string;
  /** Full name used for accessible-label fallback and initials derivation. */
  name?: string;
  /** Avatar size. @default "md" */
  size?: SetAvatarSize;
  /** Image source URL. Empty/whitespace is treated as missing. */
  src?: string;
}

function hashString(value: string): number {
  // djb2 seed constant for stable non-cryptographic string hashing.
  let hash = 5381;

  for (const char of value) {
    // djb2 mixes each char code with a 33x multiplier.
    hash = (hash * 33) ^ char.charCodeAt(0);
  }

  return hash >>> 0;
}

function normalizeInitials(initials: string | undefined): string | undefined {
  if (initials == null) return undefined;

  const normalized = collapseWhitespace(initials);

  if (!normalized) {
    return undefined;
  }

  if (normalized.length > 3) {
    throw new Error("initials must normalize to 3 characters or fewer.");
  }

  if (!/^[A-Za-z]{1,3}$/.test(normalized)) {
    throw new Error("initials must contain only alphabetic characters.");
  }

  return normalized;
}

function resolveAccessibleLabel({
  alt,
  ariaHidden,
  name,
}: {
  alt?: string;
  ariaHidden?: boolean;
  name?: string;
}): string | undefined {
  if (ariaHidden) return undefined;

  return collapseWhitespace(alt) || collapseWhitespace(name) || "Avatar";
}

function resolveAvatarColor({
  color,
  name,
}: {
  color?: SetAvatarColor;
  name?: string;
}): SetAvatarColor {
  if (color) return color;

  if (name) {
    const index = hashString(name) % COLOR_HASH.length;
    return COLOR_HASH[index];
  }

  return "neutral";
}

/**
 * Builds the IR tree for the Set avatar component.
 *
 * @param props - Avatar component props.
 * @returns IR node for an avatar wrapper with image/initials/icon content.
 */
export function buildSetAvatar({
  alt,
  ariaHidden,
  color,
  entity = "person",
  id,
  initials,
  name,
  size = "md",
  src,
}: SetAvatarProps): SetNode {
  const normalizedId = normalizeOptionalHtmlId(id);
  const normalizedInitials = normalizeInitials(initials);
  const normalizedName = collapseWhitespace(name);
  const normalizedSrc = collapseWhitespace(src);
  const accessibleLabel = resolveAccessibleLabel({
    alt,
    ariaHidden,
    name: normalizedName,
  });
  const derivedInitials = normalizedInitials || getSetInitials(normalizedName);
  const renderAsImage = Boolean(normalizedSrc);
  const resolvedColor = resolveAvatarColor({
    color,
    name: normalizedName,
  });

  const avatarAttrs = {
    "aria-hidden": ariaHidden ? "true" : undefined,
    "aria-label": !ariaHidden && !renderAsImage ? accessibleLabel : undefined,
    class: "set-avatar",
    "data-color": resolvedColor === "neutral" ? undefined : resolvedColor,
    "data-entity": entity === "person" ? undefined : entity,
    "data-size": size,
    id: normalizedId,
    role: !ariaHidden && !renderAsImage ? "img" : undefined,
  };

  let child: SetNode;
  if (renderAsImage) {
    child = {
      kind: "element",
      tag: "img",
      attrs: {
        alt: ariaHidden ? "" : accessibleLabel || "",
        class: "img",
        src: normalizedSrc,
      },
      children: [],
    };
  } else if (derivedInitials) {
    child = {
      kind: "element",
      tag: "span",
      attrs: { class: "initials" },
      children: [{ kind: "text", value: derivedInitials }],
    };
  } else {
    child = {
      kind: "element",
      tag: "span",
      attrs: { class: "icon-wrapper" },
      children: [
        buildSetIcon({
          ariaHidden: true,
          name: ENTITY_ICON_MAP[entity],
          size: "fill",
        }),
      ],
    };
  }

  return {
    kind: "element",
    tag: "span",
    attrs: avatarAttrs,
    children: [child],
  };
}

/**
 * SSR renderer for the Set avatar component.
 *
 * @param props - Avatar component props.
 * @returns HTML string for an avatar wrapper with image/initials/icon content.
 */
export function renderSetAvatar(props: SetAvatarProps): string {
  return serializeSetNode(buildSetAvatar(props));
}

/** Declarative avatar contract mirror for tooling, docs, and adapters. */
export const SET_AVATAR_SPEC: SetComponentSpec = {
  name: "avatar",
  description: "Use `avatar` to visually represent a person, team, or entity.",
  output: { element: "span", class: "set-avatar" },
  content: { kind: "none" },
  props: {
    alt: {
      description: "Accessible label for the avatar, overrides name.",
      type: { kind: "string" },
    },
    ariaHidden: {
      default: false,
      description: "Hides the avatar from assistive technology.",
      type: { kind: "boolean" },
    },
    entity: {
      default: "person",
      description: "Type of subject the avatar represents.",
      type: {
        kind: "enum",
        values: ["bot", "organization", "person", "team"],
      },
    },
    color: {
      description: "Background color swatch. Derived from name when omitted.",
      type: {
        kind: "enum",
        values: [
          "neutral",
          "01",
          "02",
          "03",
          "04",
          "05",
          "06",
          "07",
          "08",
          "09",
        ],
      },
    },
    id: {
      description: "DOM id.",
      type: { kind: "string" },
    },
    initials: {
      description:
        "Initials to display. 1–3 alphabetic characters. Overrides name-derived initials.",
      type: { kind: "string" },
    },
    name: {
      description: "Full name. Used for the label and to derive initials.",
      type: { kind: "string" },
    },
    size: {
      default: "md",
      description: "Size variant.",
      type: { kind: "enum", values: ["xs", "sm", "md", "lg", "xl"] },
    },
    src: {
      description: "Image source URL.",
      type: { kind: "string" },
    },
  },
  events: {},
  rules: {
    attributes: [
      {
        target: { on: "host" },
        attribute: "data-size",
        condition: { kind: "always" },
        value: { kind: "prop", prop: "size" },
      },
      {
        target: { on: "host" },
        attribute: "data-entity",
        condition: {
          kind: "when-in",
          prop: "entity",
          values: ["bot", "organization", "team"],
        },
        value: { kind: "prop", prop: "entity" },
      },
      {
        target: { on: "host" },
        attribute: "data-color",
        condition: {
          kind: "when-in",
          prop: "color",
          values: ["01", "02", "03", "04", "05", "06", "07", "08", "09"],
        },
        value: { kind: "prop", prop: "color" },
      },
      {
        target: { on: "host" },
        attribute: "aria-hidden",
        condition: { kind: "when-truthy", prop: "ariaHidden" },
        value: { kind: "literal", text: "true" },
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

export { getSetInitials } from "./get-initials";
