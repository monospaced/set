import { specToArgTypes, specToComponentDescription } from "../../spec";
import {
  SET_SURFACE_SPEC,
  type SetSurfaceProps,
  renderSetSurface,
} from "./surface";

const baseArgTypes = specToArgTypes(SET_SURFACE_SPEC);

const meta = {
  argTypes: baseArgTypes,
  parameters: {
    docs: {
      description: {
        component: `${specToComponentDescription(SET_SURFACE_SPEC)}\n\nToolbar surface is ignored on this page; use variant control instead.`,
      },
    },
    withSurface: false,
  },
  title: "Environment/Surface",
};

export default meta;

const exampleContent = `<div style="padding: 1.75rem 1.25rem">Example content</div>`;

export const Default = {
  args: {
    children: exampleContent,
    contentTheme: undefined,
    id: "",
    variant: "default",
  } satisfies SetSurfaceProps,
  render: (args: SetSurfaceProps) => renderSetSurface(args),
};
