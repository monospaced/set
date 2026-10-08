import type { ReactNode } from "react";
import {
  Pressable,
  type PressableProps,
  Text,
  type TextStyle,
  View,
  type ViewStyle,
} from "react-native";

import { useSetTokenContext, useSetTokens } from "../../provider";
import type { SetTokens } from "../../tokens";
import {
  IconGlyph,
  type IconMirrorMode,
  type IconName,
  type IconSize,
} from "../icon/icon";

export type ButtonAppearance = "outline" | "solid" | "text";
export type ButtonLabelVisibility = "visible" | "hidden" | "hiddenBelowTablet";
export type ButtonPlacement = "start" | "end";
export type ButtonSize = "sm" | "md" | "lg";
export type ButtonTone = "default" | "neutral";

export interface ButtonProps {
  /** Visual appearance. @default "outline" */
  readonly appearance?: ButtonAppearance;
  /** Overrides the accessible name; defaults to `label`. */
  readonly "aria-label"?: string;
  /** Prevents interaction. @default false */
  readonly disabled?: boolean;
  /** Icon shown alongside the label. Required when `labelVisibility` is not visible. */
  readonly icon?: IconName;
  /** Mirrors the icon horizontally. Ignored when `icon` is omitted. */
  readonly iconMirrored?: IconMirrorMode;
  /** Where the icon sits relative to the label. Ignored when `icon` is omitted. @default "start" */
  readonly iconPlacement?: ButtonPlacement;
  /** Visible label and default accessible name. */
  readonly label: string;
  /**
   * How the label is shown. Hidden values require an icon;
   * `hiddenBelowTablet` hides it in the baseline size context only.
   * @default "visible"
   */
  readonly labelVisibility?: ButtonLabelVisibility;
  readonly onPress?: PressableProps["onPress"];
  /** Size variant. @default "md" */
  readonly size?: ButtonSize;
  readonly testID?: string;
  /** Semantic tone. @default "default" */
  readonly tone?: ButtonTone;
}

interface Metrics {
  blockSize: number;
  border: number;
  fontSize: number;
  gap: number;
  iconMargin: number;
  iconSize: IconSize;
  iconBox: number;
  lineHeight: number;
  paddingBlock: number;
  paddingInline: number;
}

/**
 * Per-size metrics, after core's `button.css`. Block size is the control
 * height the radius derives from; type steps follow the sizes core uses
 * (150 for sm, 200 for md and lg). With the label hidden the button becomes
 * a square around a larger icon.
 */
function metrics(
  tokens: SetTokens,
  size: ButtonSize,
  appearance: ButtonAppearance,
  labelHidden: boolean,
): Metrics {
  const { layout, spacing, typography } = tokens;
  const border = layout.border.width.default;
  const step =
    size === "sm" ? typography.typeStep[150] : typography.typeStep[200];
  const fontSize = step.fontSize;
  const lineHeight = Math.round(fontSize * step.lineHeight);
  // Inline padding is set in character cells less side bearing, so the
  // label's optical margin matches its glyph advance; the icon gap likewise.
  const { cell, sideBearing } = typography.metric.default;
  const inlineUnit = (cell.width - sideBearing.pair) * fontSize;
  const gap = (cell.width - sideBearing.single) * fontSize;
  const icon = layout.icon.size;
  const outset = layout.icon.viewbox.outsetRatio;

  if (appearance === "text") {
    if (labelHidden) {
      const iconSize: IconSize =
        size === "sm" ? "sm" : size === "lg" ? "lg" : "md";
      const padding =
        size === "sm"
          ? spacing.vertical[200]
          : size === "lg"
            ? spacing.vertical[300]
            : spacing.vertical[250];

      return {
        blockSize:
          size === "sm"
            ? spacing.vertical[700]
            : size === "lg"
              ? spacing.vertical[800]
              : spacing.vertical[775],
        border: 0,
        fontSize,
        gap,
        iconBox: icon[iconSize],
        iconMargin: icon[iconSize] * outset,
        iconSize,
        lineHeight,
        paddingBlock: padding,
        paddingInline: padding,
      };
    }

    return {
      blockSize: spacing.vertical[700],
      border: 0,
      fontSize,
      gap,
      iconBox: icon.xs,
      iconMargin: icon.xs * outset,
      iconSize: "xs",
      lineHeight,
      paddingBlock: 0,
      paddingInline: 0,
    };
  }

  if (labelHidden) {
    if (size === "sm") {
      return {
        blockSize: spacing.vertical[775],
        border,
        fontSize,
        gap,
        iconBox: icon.sm,
        iconMargin: 0,
        iconSize: "sm",
        lineHeight,
        paddingBlock: spacing.vertical[300],
        paddingInline: spacing.horizontal[300],
      };
    }

    return {
      blockSize: spacing.vertical[800],
      border,
      fontSize,
      gap,
      iconBox: icon.md,
      iconMargin: 0,
      iconSize: "md",
      lineHeight,
      paddingBlock: spacing.vertical[400] - border,
      paddingInline: spacing.vertical[400] - border,
    };
  }

  const iconSize: IconSize = size === "sm" ? "2xs" : "xs";
  const shared = {
    border,
    fontSize,
    gap,
    iconBox: icon[iconSize],
    iconMargin: icon[iconSize] * outset,
    iconSize,
    lineHeight,
  };

  switch (size) {
    case "sm":
      return {
        ...shared,
        blockSize: spacing.vertical[775],
        paddingBlock: spacing.vertical[250] - border,
        paddingInline: inlineUnit * 2 - border,
      };
    case "lg":
      return {
        ...shared,
        blockSize: spacing.vertical[900],
        paddingBlock: spacing.vertical[500] - border,
        paddingInline: inlineUnit * 3 - border,
      };
    default:
      return {
        ...shared,
        blockSize: spacing.vertical[800],
        paddingBlock: spacing.vertical[400] - border,
        paddingInline: inlineUnit * 2 - border,
      };
  }
}

interface Palette {
  background: string;
  border: string;
  foreground: string;
  shadow: boolean;
}

/**
 * Colour per appearance × tone × state, after core's `button.css`. The
 * pressed state stands in for CSS `:active`; there is no hover on touch.
 */
function palette(
  tokens: SetTokens,
  appearance: ButtonAppearance,
  tone: ButtonTone,
  state: { disabled: boolean; pressed: boolean },
): Palette {
  const { color } = tokens;
  const accent =
    tone === "neutral" ? color.interactive.neutral : color.interactive;
  const active = state.pressed ? accent.active : accent.default;

  if (state.disabled) {
    return {
      background:
        appearance === "solid" ? color.background.subtle : "transparent",
      border: appearance === "text" ? "transparent" : color.border.subtle,
      foreground: color.foreground.muted.text,
      shadow: false,
    };
  }

  switch (appearance) {
    case "solid":
      return {
        background: active,
        border: active,
        foreground: color.foreground.contrast,
        shadow: false,
      };
    case "text":
      return {
        background: "transparent",
        border: "transparent",
        foreground: active,
        shadow: false,
      };
    default:
      return {
        background: color.background.panel,
        border:
          tone === "neutral" ? color.border.default : color.interactive.default,
        foreground: state.pressed
          ? color.interactive.neutral.active
          : color.interactive.neutral.default,
        shadow: tone !== "neutral" && !state.pressed,
      };
  }
}

/**
 * Use `Button` to let users trigger actions.
 *
 * A pressable with the same appearance, size, tone and icon vocabulary as
 * core's `button`, built from Set's tokens for React Native. Form
 * attributes, disclosure state and the activity indicator from the web
 * component are not carried over.
 */
export function Button({
  appearance = "outline",
  "aria-label": ariaLabel,
  disabled = false,
  icon,
  iconMirrored,
  iconPlacement = "start",
  label,
  labelVisibility = "visible",
  onPress,
  size = "md",
  testID,
  tone = "default",
}: ButtonProps): ReactNode {
  const tokens = useSetTokens();
  const { size: sizeContext } = useSetTokenContext();

  if (labelVisibility !== "visible" && !icon) {
    throw new Error("labelVisibility requires icon when label is not visible.");
  }

  const labelHidden =
    labelVisibility === "hidden" ||
    (labelVisibility === "hiddenBelowTablet" && sizeContext === "baseline");
  const m = metrics(tokens, size, appearance, labelHidden);
  const radius = m.blockSize * tokens.radius.ratio.default;
  const font = tokens.typography;

  return (
    <Pressable
      aria-disabled={disabled}
      aria-label={ariaLabel ?? label}
      disabled={disabled}
      onPress={onPress}
      role="button"
      style={({ pressed }) => {
        const p = palette(tokens, appearance, tone, { disabled, pressed });
        const container: ViewStyle = {
          alignItems: "center",
          alignSelf: "flex-start",
          backgroundColor: p.background,
          borderColor: p.border,
          borderRadius: radius,
          borderWidth: m.border,
          flexDirection: iconPlacement === "end" ? "row-reverse" : "row",
          gap: labelHidden ? 0 : m.gap,
          justifyContent: "center",
          minHeight: m.blockSize,
          paddingHorizontal: m.paddingInline,
          paddingVertical: m.paddingBlock,
          ...(p.shadow ? tokens.effect.shadow.default : {}),
        };

        return container;
      }}
      testID={testID}
    >
      {({ pressed }) => {
        const p = palette(tokens, appearance, tone, { disabled, pressed });
        const text: TextStyle = {
          color: p.foreground,
          fontFamily: font.fontFamily.default,
          fontSize: m.fontSize,
          fontWeight: font.fontWeight.regularPlus,
          lineHeight: m.lineHeight,
        };

        return (
          <>
            {icon ? (
              <View
                style={{
                  height: m.iconBox,
                  marginHorizontal: m.iconMargin,
                  width: m.iconBox,
                }}
              >
                <IconGlyph
                  color={p.foreground}
                  mirrored={iconMirrored}
                  name={icon}
                  size="fill"
                />
              </View>
            ) : null}
            {labelHidden ? null : <Text style={text}>{label}</Text>}
          </>
        );
      }}
    </Pressable>
  );
}
