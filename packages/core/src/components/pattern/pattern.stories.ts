import { specToArgTypes, specToComponentDescription } from "../../spec";
import {
  SET_PATTERN_SPEC,
  type SetPatternProps,
  renderSetPattern,
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
    variant: "corner",
  } satisfies SetPatternProps,
  render: (args: SetPatternProps) => renderSetPattern(args),
};
