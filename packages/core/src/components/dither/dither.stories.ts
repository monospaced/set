import { specToArgTypes, specToComponentDescription } from "../../spec";
import { renderSetBox } from "../box/box";
import { renderSetHeading } from "../heading/heading";
import { renderSetText } from "../text/text";
import {
  renderSetDither,
  SET_DITHER_SPEC,
  type SetDitherProps,
} from "./dither";

const baseArgTypes = specToArgTypes(SET_DITHER_SPEC);

// The component fills its parent unless `blockSize` or `aspectRatio` gives it
// a height, or content does. A story has no parent, so for the fill case alone
// the render gives it one, 72px tall, as a Box or Grid item would in a page.
const renderInParent = (args: SetDitherProps): string =>
  args.blockSize || args.aspectRatio || args.children
    ? renderSetDither(args)
    : `<div style="block-size: 4.5rem;">${renderSetDither(args)}</div>`;

const meta = {
  argTypes: baseArgTypes,
  parameters: {
    docs: {
      description: {
        component: specToComponentDescription(SET_DITHER_SPEC),
      },
    },
    padding: 0,
  },
  title: "Graphic/Dither",
};

export default meta;

export const Default = {
  args: {
    aspectRatio: undefined,
    blockSize: 0,
    inlineSize: 0,
    ramp: undefined,
    cell: "md",
    density: 50,
    tone: "brand",
    id: "",
    children: "",
  } satisfies SetDitherProps,
  render: (args: SetDitherProps) => renderInParent(args),
};

// Children over the default tone need no background of their own.
const content = (background: "panel" | "transparent", text: string): string =>
  renderSetBox({
    background: "transparent",
    paddingBlock: "lg",
    paddingInline: "lg",
    children: renderSetBox({
      background,
      paddingBlock: "md",
      paddingInline: "md",
      children: [
        renderSetHeading({ level: 2, size: "lg", children: "Heading" }),
        renderSetText({ as: "p", children: text }),
      ].join(""),
    }),
  });

export const Content = {
  args: {
    ...Default.args,
    blockSize: 0,
    cell: "lg",
    density: 33,
    tone: "default",
    children: content("transparent", "Text over a default-toned dither."),
  } satisfies SetDitherProps,
  render: (args: SetDitherProps) => renderInParent(args),
};

export const ContentOnBrand = {
  args: {
    ...Default.args,
    blockSize: 0,
    density: 33,
    children: content(
      "panel",
      "Text on a solid background, over a brand-toned dither.",
    ),
  } satisfies SetDitherProps,
  render: (args: SetDitherProps) => renderInParent(args),
};
