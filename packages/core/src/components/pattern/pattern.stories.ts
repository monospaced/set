import { specToArgTypes, specToComponentDescription } from "../../spec";
import {
  renderSetPattern,
  SET_PATTERN_SPEC,
  type SetPatternProps,
} from "./pattern";

const baseArgTypes = specToArgTypes(SET_PATTERN_SPEC);

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
    children: `<div style="block-size: 6rem;"></div>`,
    id: "",
    size: "md",
    tone: "default",
    variant: "tile",
  } satisfies SetPatternProps,
  render: (args: SetPatternProps) => renderSetPattern(args),
};

export const Dither = {
  args: {
    ...Default.args,
    cell: "dot",
    density: 50,
    size: "sm",
    tone: "brand",
    variant: "dither",
  } satisfies SetPatternProps,
  render: (args: SetPatternProps) => renderSetPattern(args),
};

export const DitherRamp = {
  args: {
    ...Default.args,
    cell: "dot",
    direction: "inline-end",
    size: "sm",
    tone: "brand",
    variant: "ditherRamp",
  } satisfies SetPatternProps,
  render: (args: SetPatternProps) => renderSetPattern(args),
};
