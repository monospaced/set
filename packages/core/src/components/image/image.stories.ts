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
    fit: "intrinsic",
    gravity: "C",
    aspectRatio: undefined,
    width: 0,
    height: 0,
    id: "",
    radius: false,
    shadow: false,
    alt: "",
    lazy: false,
    priority: false,
    src: "https://res.cloudinary.com/monospaced/image/upload/f_auto,q_auto,w_640,h_480,c_fill/v1785950427/2018-04-20_15.28.26--cyan_peg0w6.png",
    srcSet: [
      "https://res.cloudinary.com/monospaced/image/upload/f_auto,q_auto,w_344,h_258,c_fill/v1785950427/2018-04-20_15.28.26--cyan_peg0w6.png 344w",
      "https://res.cloudinary.com/monospaced/image/upload/f_auto,q_auto,w_640,h_480,c_fill/v1785950427/2018-04-20_15.28.26--cyan_peg0w6.png 640w",
      "https://res.cloudinary.com/monospaced/image/upload/f_auto,q_auto,w_688,h_516,c_fill/v1785950427/2018-04-20_15.28.26--cyan_peg0w6.png 688w",
      "https://res.cloudinary.com/monospaced/image/upload/f_auto,q_auto,w_1032,h_774,c_fill/v1785950427/2018-04-20_15.28.26--cyan_peg0w6.png 1032w",
      "https://res.cloudinary.com/monospaced/image/upload/f_auto,q_auto,w_1280,h_960,c_fill/v1785950427/2018-04-20_15.28.26--cyan_peg0w6.png 1280w",
      "https://res.cloudinary.com/monospaced/image/upload/f_auto,q_auto,w_1920,h_1440,c_fill/v1785950427/2018-04-20_15.28.26--cyan_peg0w6.png 1920w",
    ].join(", "),
    sizes:
      "(max-width: 24em) 21.5rem, (max-width: 42.5em) calc(100vw - 2.5rem), 40rem",
    sources: undefined,
  } satisfies SetImageProps,
  render: (args: SetImageProps) => renderSetImage(args),
};

/*
 * `source[media]` accepts media queries only (no container queries), so the
 * breakpoints track the browser viewport — not the docs preview, which caps
 * at ~958px inside wider chrome. Thresholds are therefore calibrated for the
 * docs reading context; the canvas view with the viewport toolbar exercises
 * them directly.
 */
export const ArtDirection = {
  args: {
    alt: "",
    fit: "fluid",
    sources: [
      {
        height: 548,
        media: "(min-width: 90em)",
        srcSet:
          "https://res.cloudinary.com/monospaced/image/upload/2025-10-23_12.15.15--cyan--21x9_timbyu.png",
        width: 1280,
      },
      {
        height: 720,
        media: "(min-width: 64em)",
        srcSet:
          "https://res.cloudinary.com/monospaced/image/upload/2025-10-23_12.15.15--cyan--16x9_osdt7w.png",
        width: 1280,
      },
      {
        height: 854,
        media: "(min-width: 48em)",
        srcSet:
          "https://res.cloudinary.com/monospaced/image/upload/2025-10-23_12.15.15--cyan--3x2_l6ysx0.png",
        width: 1280,
      },
      {
        height: 1280,
        media: "(min-width: 30em)",
        srcSet:
          "https://res.cloudinary.com/monospaced/image/upload/2025-10-23_12.15.15--cyan--1x1_studcj.png",
        width: 1280,
      },
    ],
    src: "https://res.cloudinary.com/monospaced/image/upload/2025-10-23_12.15.15--cyan--4x5_nijpju.png",
    height: 1600,
    width: 1280,
  } satisfies SetImageProps,
  render: (args: SetImageProps) => renderSetImage(args),
};
