import type { ReactNode } from "react";
import { I18nManager } from "react-native";
import Svg, { Circle, G, Path } from "react-native-svg";

import { useSetTokens } from "../../provider";
import {
  ICON_NAMES,
  ICON_NODES,
  type IconName,
  type IconNode,
} from "./icons.generated";

export { ICON_NAMES, type IconName };
export type IconMirrorMode = "always" | "rtl";
export type IconSize = "2xs" | "xs" | "sm" | "md" | "lg" | "fill";

export interface IconProps {
  /**
   * Hides the icon from assistive technology. Decorative by default; set to
   * false for a labelled icon (then `title` is required). @default true
   */
  readonly "aria-hidden"?: boolean;
  /** Mirrors the icon horizontally. */
  readonly mirrored?: IconMirrorMode;
  /** Set icon name. */
  readonly name: IconName;
  /** Size variant. @default "md" */
  readonly size?: IconSize;
  readonly testID?: string;
  /** Accessible title announced by assistive technology. Required when `aria-hidden` is false. */
  readonly title?: string;
}

/** Stroke width core hoists to the root `<svg>`; paths inherit it. */
const STROKE_WIDTH = 1.75;

/** SVG attribute → react-native-svg prop. Only what the registry uses. */
const ATTR_PROPS: Record<string, string> = {
  "clip-rule": "clipRule",
  cx: "cx",
  cy: "cy",
  d: "d",
  fill: "fill",
  "fill-rule": "fillRule",
  r: "r",
  "stroke-linecap": "strokeLinecap",
};

const TAGS = { circle: Circle, g: G, path: Path } as const;

function propsFor(attrs: Record<string, string>): Record<string, string> {
  const out: Record<string, string> = {};

  for (const [attr, value] of Object.entries(attrs)) {
    const prop = ATTR_PROPS[attr];

    if (!prop) {
      throw new Error(`Icon: unsupported SVG attribute "${attr}".`);
    }

    out[prop] = value;
  }

  return out;
}

function renderNode(node: IconNode, key: number): ReactNode {
  const Tag = TAGS[node.tag as keyof typeof TAGS];

  if (!Tag) throw new Error(`Icon: unsupported SVG element <${node.tag}>.`);

  return (
    <Tag key={key} {...propsFor(node.attrs)}>
      {node.children?.map(renderNode)}
    </Tag>
  );
}

/**
 * Internal: the icon with its stroke colour supplied. On the web an icon
 * inherits `currentColor`; React Native has no such inheritance, so
 * components that place an icon in coloured text (Button, Avatar) pass the
 * colour they computed. Not exported from the package: the public `Icon`
 * always draws in the foreground token, as core's does by default.
 */
export function IconGlyph({
  "aria-hidden": ariaHidden = true,
  color,
  mirrored,
  name,
  size = "md",
  testID,
  title,
}: IconProps & { readonly color: string }): ReactNode {
  const tokens = useSetTokens();
  const nodes = ICON_NODES[name] as IconNode[] | undefined;

  if (!nodes) throw new Error(`Unknown icon name: ${name}`);

  const normalizedTitle = title?.trim();

  if (!ariaHidden && !normalizedTitle) {
    throw new Error("title must be non-empty when aria-hidden is false.");
  }

  const dimension = size === "fill" ? "100%" : tokens.layout.icon.size[size];
  const stroke = color;
  const mirror =
    mirrored === "always" || (mirrored === "rtl" && I18nManager.isRTL);

  return (
    <Svg
      aria-hidden={ariaHidden}
      aria-label={ariaHidden ? undefined : normalizedTitle}
      color={stroke}
      fill="none"
      height={dimension}
      role={ariaHidden ? undefined : "img"}
      style={mirror ? { transform: [{ scaleX: -1 }] } : undefined}
      testID={testID}
      viewBox="0 0 24 24"
      width={dimension}
    >
      <G stroke={stroke} strokeWidth={STROKE_WIDTH}>
        {nodes.map(renderNode)}
      </G>
    </Svg>
  );
}

/**
 * Use `Icon` to render a Set icon.
 *
 * The same geometry as core's icons, drawn with `react-native-svg`. Sizes
 * follow the icon size tokens; `fill` takes the parent's box. Draws in the
 * foreground colour.
 */
export function Icon(props: IconProps): ReactNode {
  const tokens = useSetTokens();

  return <IconGlyph {...props} color={tokens.color.foreground.default} />;
}
