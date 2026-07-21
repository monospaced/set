import { specToArgTypes, specToComponentDescription } from "../../spec";
import { SET_ROOT_SPEC, SetRootProps, renderSetRoot } from "./root";

const baseArgTypes = specToArgTypes(SET_ROOT_SPEC);

const meta = {
  argTypes: baseArgTypes,
  parameters: {
    docs: {
      description: {
        component: `${specToComponentDescription(SET_ROOT_SPEC)}\n\nToolbar globals are ignored on this page; use controls instead.`,
      },
    },
    withRoot: false,
  },
  title: "Environment/Root",
};

export default meta;

export const Default = {
  args: {
    appOverscrollBehavior: undefined,
    appRoot: false,
    brand: "mnsp",
    children: `<div style="padding: 1.75rem 1.25rem">Example content</div>`,
    dir: undefined,
    id: "",
    lang: "",
    theme: undefined,
  },
  render: (args: SetRootProps) => renderSetRoot({ ...args }),
};
