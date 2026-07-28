import { specToArgTypes, specToComponentDescription } from "../../spec";
import { renderSetImage, SET_IMAGE_SPEC, type SetImageProps } from "./image";

const baseArgTypes = specToArgTypes(SET_IMAGE_SPEC);

const meta = {
  argTypes: {
    ...baseArgTypes,
    sources: { ...baseArgTypes.sources, control: false },
  },
  parameters: {
    docs: {
      description: {
        component: specToComponentDescription(SET_IMAGE_SPEC),
      },
    },
  },
  title: "Graphic/Image",
};

export default meta;

export const Default = {
  args: {
    cover: false,
    gravity: "C",
    aspectRatio: undefined,
    width: 0,
    height: 0,
    id: "",
    radius: undefined,
    shadow: false,
    alt: "",
    lazy: false,
    priority: false,
    src: "https://res.cloudinary.com/crvq1oh0/image/upload/f_auto,q_auto,w_640,h_360,c_fill/v1784929204/bg-brand_rprgky.png",
    srcSet: [
      "https://res.cloudinary.com/crvq1oh0/image/upload/f_auto,q_auto,w_344,h_194,c_fill/v1784929204/bg-brand_rprgky.png 344w",
      "https://res.cloudinary.com/crvq1oh0/image/upload/f_auto,q_auto,w_640,h_360,c_fill/v1784929204/bg-brand_rprgky.png 640w",
      "https://res.cloudinary.com/crvq1oh0/image/upload/f_auto,q_auto,w_688,h_387,c_fill/v1784929204/bg-brand_rprgky.png 688w",
      "https://res.cloudinary.com/crvq1oh0/image/upload/f_auto,q_auto,w_1032,h_581,c_fill/v1784929204/bg-brand_rprgky.png 1032w",
      "https://res.cloudinary.com/crvq1oh0/image/upload/f_auto,q_auto,w_1280,h_720,c_fill/v1784929204/bg-brand_rprgky.png 1280w",
      "https://res.cloudinary.com/crvq1oh0/image/upload/f_auto,q_auto,w_1920,h_1080,c_fill/v1784929204/bg-brand_rprgky.png 1920w",
    ].join(", "),
    sizes:
      "(max-width: 24em) 21.5rem, (max-width: 42.5em) calc(100vw - 2.5rem), 40rem",
    sources: undefined,
  } satisfies SetImageProps,
  render: (args: SetImageProps) => renderSetImage(args),
};
