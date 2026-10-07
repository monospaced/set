import type { ReactNode } from "react";
import {
  Image,
  Text,
  type TextStyle,
  View,
  type ViewStyle,
} from "react-native";

import { useSetTokens } from "../../provider";
import type { SetTokens } from "../../tokens";
import { IconGlyph, type IconName } from "../icon/icon";
import { getInitials } from "./get-initials";

export type AvatarColor =
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
export type AvatarEntity = "bot" | "organization" | "person" | "team";
export type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";

export interface AvatarProps {
  /** Hides the avatar from assistive technology. @default false */
  readonly "aria-hidden"?: boolean;
  /** Accessible label. Falls back to `name`, then "Avatar". */
  readonly alt?: string;
  /**
   * Background colour slot. If omitted and `name` exists, the slot is
   * hash-derived from the name so the same person always gets the same colour.
   */
  readonly color?: AvatarColor;
  /**
   * What the avatar represents. People are round; other entities are
   * rounded squares. @default "person"
   */
  readonly entity?: AvatarEntity;
  /** Explicit initials, 1–3 letters. Overrides derivation from `name`. */
  readonly initials?: string;
  /** Full name, for the accessible label and initials derivation. */
  readonly name?: string;
  /** Size variant. @default "md" */
  readonly size?: AvatarSize;
  /** Image source URL. Empty or whitespace is treated as absent. */
  readonly src?: string;
  readonly testID?: string;
}

/** Entity icon shown when there is no image and no initials, as in core. */
const ENTITY_ICON: Record<AvatarEntity, IconName> = {
  bot: "robot-1",
  organization: "city-6",
  person: "user-1",
  team: "member",
};

const COLOR_SLOTS = [
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

/** djb2, as in core: stable, non-cryptographic. */
function hash(value: string): number {
  let h = 5381;

  for (const char of value) h = (h * 33) ^ char.charCodeAt(0);

  return h >>> 0;
}

function resolveColor(
  color: AvatarColor | undefined,
  name: string | undefined,
): AvatarColor {
  if (color) return color;
  if (name) return COLOR_SLOTS[hash(name) % COLOR_SLOTS.length] ?? "neutral";

  return "neutral";
}

function normalizeInitials(initials: string | undefined): string | undefined {
  if (initials == null) return undefined;

  const normalized = initials.trim().replace(/\s+/g, "");

  if (!normalized) return undefined;
  if (!/^[A-Za-z]{1,3}$/.test(normalized)) {
    throw new Error("initials must be 1–3 alphabetic characters.");
  }

  return normalized;
}

/**
 * Icon box per size, after core's `avatar.css` (70% of the block size,
 * rounded to whole points).
 */
const ICON_BOX: Record<AvatarSize, number> = {
  lg: 34,
  md: 26,
  sm: 20,
  xl: 68,
  xs: 16,
};

/** Block size per variant, after core's `avatar.css`. */
function blockSize(tokens: SetTokens, size: AvatarSize): number {
  const { vertical } = tokens.spacing;

  switch (size) {
    case "xs":
      return vertical[700];
    case "sm":
      return vertical[775];
    case "lg":
      return vertical[900];
    case "xl":
      return vertical[1200];
    default:
      return vertical[800];
  }
}

/**
 * Use `Avatar` to represent a person, team, organisation or bot.
 *
 * Shows an image when `src` is given, otherwise initials from `initials`
 * or `name`, otherwise an icon for the entity.
 */
export function Avatar({
  "aria-hidden": ariaHidden = false,
  alt,
  color,
  entity = "person",
  initials,
  name,
  size = "md",
  src,
  testID,
}: AvatarProps): ReactNode {
  const tokens = useSetTokens();
  const dimension = blockSize(tokens, size);
  const slot = resolveColor(color, name);
  const background =
    slot === "neutral"
      ? tokens.color.avatar.default
      : tokens.color.avatar[slot];
  const ratio =
    entity === "person" ? tokens.radius.ratio.lg : tokens.radius.ratio.default;
  const source = src?.trim() || undefined;
  const text =
    normalizeInitials(initials) ?? (source ? undefined : getInitials(name));
  const label = alt?.trim() || name?.trim() || "Avatar";

  const container: ViewStyle = {
    alignItems: "center",
    backgroundColor: background,
    borderRadius: dimension * ratio,
    height: dimension,
    justifyContent: "center",
    // An outline, as in core, so the ring paints outside the box and the
    // image or initials keep the full dimension.
    outlineColor: tokens.color.border.subtle,
    outlineStyle: "solid",
    outlineWidth: tokens.layout.border.width.default,
    overflow: "hidden",
    width: dimension,
  };
  const initialsStyle: TextStyle = {
    color: tokens.color.foreground.contrast,
    fontFamily: tokens.typography.fontFamily.default,
    fontSize: dimension * 0.5,
    fontWeight: tokens.typography.fontWeight.bold,
    lineHeight: dimension * 0.5,
    textAlign: "center",
  };

  return (
    <View
      aria-hidden={ariaHidden}
      aria-label={ariaHidden ? undefined : label}
      role={ariaHidden ? undefined : "img"}
      style={container}
      testID={testID}
    >
      {source ? (
        <Image
          accessibilityIgnoresInvertColors
          resizeMode="cover"
          source={{ uri: source }}
          style={{
            backgroundColor: tokens.color.background.subtle,
            height: "100%",
            width: "100%",
          }}
        />
      ) : text ? (
        <Text style={initialsStyle}>{text}</Text>
      ) : (
        <View style={{ height: ICON_BOX[size], width: ICON_BOX[size] }}>
          <IconGlyph
            color={tokens.color.foreground.contrast}
            name={ENTITY_ICON[entity]}
            size="fill"
          />
        </View>
      )}
    </View>
  );
}
