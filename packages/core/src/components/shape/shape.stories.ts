import { specToArgTypes, specToComponentDescription } from "../../spec";
import { renderSetInline } from "../inline/inline";
import { SET_SHAPE_SPEC, type SetShapeProps, renderSetShape } from "./shape";

const meta = {
  argTypes: specToArgTypes(SET_SHAPE_SPEC),
  parameters: {
    docs: {
      description: {
        component: specToComponentDescription(SET_SHAPE_SPEC),
      },
    },
  },
  title: "Graphic/Shape",
};

export default meta;

export const Default = {
  args: {
    id: "",
    size: "md",
    tone: "brand",
    variant: "corner",
  } satisfies SetShapeProps,
  render: (args: SetShapeProps) => renderSetShape(args),
};

export const Variant = {
  parameters: { controls: { disable: true } },
  render: () =>
    renderSetInline({
      children: [
        renderSetShape({ tone: "brand", variant: "corner" }),
        renderSetShape({ tone: "brand", variant: "tile-slice-lg" }),
        renderSetShape({ tone: "brand", variant: "tile-slice-sm" }),
        renderSetShape({ tone: "brand", variant: "tile-sm" }),
        renderSetShape({ tone: "brand", variant: "tile-lg" }),
        renderSetShape({ tone: "brand", variant: "circle-lg" }),
        renderSetShape({ tone: "brand", variant: "circle-sm" }),
      ].join(""),
    }),
};
