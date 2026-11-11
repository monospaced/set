import { specToArgTypes, specToComponentDescription } from "../../spec";
import { renderSetBox } from "../box/box";
import { renderSetHeading } from "../heading/heading";
import { renderSetText } from "../text/text";
import {
  renderSetPattern,
  SET_PATTERN_SPEC,
  type SetPatternProps,
} from "./pattern";

const baseArgTypes = specToArgTypes(SET_PATTERN_SPEC);

// The component fills its parent unless `blockSize` or `aspectRatio` gives it
// a height, or content does. A story has no parent, so for the fill case alone
// the render gives it one, 72px tall, as a Box or Grid item would in a page.
const renderInParent = (args: SetPatternProps): string =>
  args.blockSize || args.aspectRatio || args.children
    ? renderSetPattern(args)
    : `<div style="block-size: 4.5rem;">${renderSetPattern(args)}</div>`;

const meta = {
  argTypes: baseArgTypes,
  parameters: {
    docs: {
      description: {
        component: specToComponentDescription(SET_PATTERN_SPEC),
      },
    },
    padding: 0,
  },
  title: "Graphic/Pattern",
};

export default meta;

export const Default = {
  args: {
    aspectRatio: undefined,
    blockSize: 0,
    inlineSize: 0,
    cell: "md",
    tone: "default",
    variant: "tile",
    id: "",
    children: "",
  } satisfies SetPatternProps,
  render: (args: SetPatternProps) => renderInParent(args),
};

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
    cell: "sm",
    children: content("transparent", "Text over a default-toned pattern."),
  } satisfies SetPatternProps,
  render: (args: SetPatternProps) => renderInParent(args),
};

export const ContentOnBrand = {
  args: {
    ...Default.args,
    blockSize: 0,
    cell: "xs",
    tone: "brand",
    children: content(
      "panel",
      "Text on a solid background, over a brand-toned pattern.",
    ),
  } satisfies SetPatternProps,
  render: (args: SetPatternProps) => renderInParent(args),
};
