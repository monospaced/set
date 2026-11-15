import { specToArgTypes, specToComponentDescription } from "../../spec";
import { renderSetStack, SET_STACK_SPEC, type SetStackProps } from "./stack";

const baseArgTypes = specToArgTypes(SET_STACK_SPEC);

const meta = {
  argTypes: baseArgTypes,
  parameters: {
    docs: {
      description: {
        component: specToComponentDescription(SET_STACK_SPEC),
      },
    },
    padding: 0,
  },
  title: "Layout/Stack",
};

export default meta;

export const Default = {
  args: {
    align: "stretch",
    as: "div",
    children: "",
    gap: "md",
    id: "",
    responsive: false,
  } satisfies SetStackProps,
  render: (args: SetStackProps) => {
    const itemTag = args.as === "ul" ? "li" : "div";
    const children = Array.from({ length: 3 })
      .map(() => `<${itemTag} class="example-content"></${itemTag}>`)
      .join("");
    return renderSetStack({ ...args, children });
  },
};
