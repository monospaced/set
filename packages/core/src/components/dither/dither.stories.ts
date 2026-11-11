import { specToArgTypes, specToComponentDescription } from "../../spec";
import {
  renderSetDither,
  SET_DITHER_SPEC,
  type SetDitherProps,
} from "./dither";

const baseArgTypes = specToArgTypes(SET_DITHER_SPEC);

const meta = {
  argTypes: baseArgTypes,
  parameters: {
    docs: {
      description: {
        component: specToComponentDescription(SET_DITHER_SPEC),
      },
    },
  },
  title: "Graphic/Dither",
};

export default meta;

export const Default = {
  args: {
    children: `<div style="block-size: 6rem;"></div>`,
    density: 50,
    id: "",
    ramp: undefined,
    size: "md",
    tone: "default",
  } satisfies SetDitherProps,
  render: (args: SetDitherProps) => renderSetDither(args),
};

export const Ramp = {
  args: {
    ...Default.args,
    ramp: "inline-end",
    tone: "brand",
  } satisfies SetDitherProps,
  render: (args: SetDitherProps) => renderSetDither(args),
};
