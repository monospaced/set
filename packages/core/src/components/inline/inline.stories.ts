import { specToArgTypes, specToComponentDescription } from "../../spec";
import {
  SET_INLINE_SPEC,
  type SetInlineProps,
  renderSetInline,
} from "./inline";

const baseArgTypes = specToArgTypes(SET_INLINE_SPEC);

const meta = {
  argTypes: baseArgTypes,
  parameters: {
    docs: {
      description: {
        component: specToComponentDescription(SET_INLINE_SPEC),
      },
    },
    padding: 0,
  },
  title: "Layout/Inline",
};

export default meta;

export const Default = {
  args: {
    as: "div",
    align: "center",
    children: "",
    gap: "md",
    id: "",
    justify: "start",
    nowrap: false,
  } satisfies SetInlineProps,
  render: (args: SetInlineProps) => {
    const itemTag = args.as === "ul" ? "li" : "div";
    return renderSetInline({
      ...args,
      children: `<${itemTag} class="example-content-item"></${itemTag}><${itemTag} class="example-content"></${itemTag}><${itemTag} class="example-content"></${itemTag}>`,
    });
  },
};
