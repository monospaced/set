import { specToArgTypes, specToComponentDescription } from "../../spec";
import {
  SET_RANGE_SPEC,
  type SetRangeProps,
  defineSetRange,
  renderSetRange,
} from "./range";

defineSetRange();

const baseArgTypes = specToArgTypes(SET_RANGE_SPEC);

const meta = {
  argTypes: baseArgTypes,
  parameters: {
    docs: {
      description: {
        component: specToComponentDescription(SET_RANGE_SPEC),
      },
    },
  },
  title: "Control/Range",
};

export default meta;

export const Default = {
  args: {
    description: "Description",
    disabled: false,
    id: "range-id",
    inlineSize: "fit",
    label: "Label",
    max: 100,
    min: 0,
    name: "",
    size: "md",
    step: 1,
    value: 50,
  } satisfies SetRangeProps,
  render: (args: SetRangeProps) =>
    renderSetRange({
      ...args,
      id: args.id?.trim() || "storybook-fallback-range-id",
    }),
};
