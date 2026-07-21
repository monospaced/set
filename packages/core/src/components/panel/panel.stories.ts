import { specToArgTypes, specToComponentDescription } from "../../spec";
import { SET_PANEL_SPEC, type SetPanelProps, renderSetPanel } from "./panel";

const baseArgTypes = specToArgTypes(SET_PANEL_SPEC);

const meta = {
  argTypes: baseArgTypes,
  parameters: {
    docs: {
      description: {
        component: specToComponentDescription(SET_PANEL_SPEC),
      },
    },
  },
  title: "Structure/Panel",
};

export default meta;

export const Default = {
  args: {
    children: '<div class="example-content"></div>',
    id: "",
    padding: "md",
    surface: undefined,
  } satisfies SetPanelProps,
  render: (args: SetPanelProps) => renderSetPanel(args),
};
