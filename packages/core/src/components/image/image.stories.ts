import { specToArgTypes, specToComponentDescription } from "../../spec";
import { renderSetImage, SET_IMAGE_SPEC, type SetImageProps } from "./image";

const baseArgTypes = specToArgTypes(SET_IMAGE_SPEC);

const meta = {
  argTypes: {
    ...baseArgTypes,
    adaptive: { ...baseArgTypes.adaptive, control: false },
    animated: { ...baseArgTypes.animated, control: false },
    sources: { ...baseArgTypes.sources, control: false },
    still: { ...baseArgTypes.still, control: false },
  },
  parameters: {
    docs: {
      description: {
        component: `${specToComponentDescription(SET_IMAGE_SPEC)}\n\nStory images carry the [brand image treatment](https://set.monospaced.com/imagery/).`,
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
    src: "https://res.cloudinary.com/monospaced/image/upload/f_auto,q_auto,w_640,h_480,c_fill/v1787268747/2018-04-20_15.28.26--cyan--mid_xk9pul.png",
    srcSet: [
      "https://res.cloudinary.com/monospaced/image/upload/f_auto,q_auto,w_344,h_258,c_fill/v1787268747/2018-04-20_15.28.26--cyan--mid_xk9pul.png 344w",
      "https://res.cloudinary.com/monospaced/image/upload/f_auto,q_auto,w_640,h_480,c_fill/v1787268747/2018-04-20_15.28.26--cyan--mid_xk9pul.png 640w",
      "https://res.cloudinary.com/monospaced/image/upload/f_auto,q_auto,w_688,h_516,c_fill/v1787268747/2018-04-20_15.28.26--cyan--mid_xk9pul.png 688w",
      "https://res.cloudinary.com/monospaced/image/upload/f_auto,q_auto,w_1032,h_774,c_fill/v1787268747/2018-04-20_15.28.26--cyan--mid_xk9pul.png 1032w",
      "https://res.cloudinary.com/monospaced/image/upload/f_auto,q_auto,w_1280,h_960,c_fill/v1787268747/2018-04-20_15.28.26--cyan--mid_xk9pul.png 1280w",
      "https://res.cloudinary.com/monospaced/image/upload/f_auto,q_auto,w_1920,h_1440,c_fill/v1787268747/2018-04-20_15.28.26--cyan--mid_xk9pul.png 1920w",
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
export const AdaptiveArtDirection = {
  args: {
    alt: "",
    adaptive: true,
    fit: "fluid",
    sources: [
      {
        height: 548,
        media: "(min-width: 90em)",
        srcSet:
          "https://res.cloudinary.com/monospaced/image/upload/v1787268828/2025-10-23_12.15.15--cyan--adaptive--21x9_rhkejn.svg",
        width: 1280,
      },
      {
        height: 720,
        media: "(min-width: 64em)",
        srcSet:
          "https://res.cloudinary.com/monospaced/image/upload/v1787268827/2025-10-23_12.15.15--cyan--adaptive--16x9_fratkp.svg",
        width: 1280,
      },
      {
        height: 854,
        media: "(min-width: 48em)",
        srcSet:
          "https://res.cloudinary.com/monospaced/image/upload/v1787268755/2025-10-23_12.15.15--cyan--adaptive--3x2_tnb9no.svg",
        width: 1280,
      },
      {
        height: 1280,
        media: "(min-width: 30em)",
        srcSet:
          "https://res.cloudinary.com/monospaced/image/upload/v1787268753/2025-10-23_12.15.15--cyan--adaptive--1x1_il858k.svg",
        width: 1280,
      },
    ],
    src: "https://res.cloudinary.com/monospaced/image/upload/v1787268757/2025-10-23_12.15.15--cyan--adaptive--4x5_v59psw.svg",
    height: 1600,
    width: 1280,
  } satisfies SetImageProps,
  render: (args: SetImageProps) => renderSetImage(args),
};

const CLOUDINARY = "https://res.cloudinary.com/monospaced/image/upload";

/*
 * Animated `webp` from Screen. `adaptive` opts into light/dark: the URLs carry
 * a `{scheme}` token the component substitutes across a light/dark pair, and
 * the `still` (adaptive SVG) is shown when the user prefers reduced motion.
 * Toggle the OS reduced-motion setting to see the still take over.
 */
export const Animated = {
  args: {
    alt: "",
    adaptive: true,
    animated: true,
    fit: "fluid",
    src: `${CLOUDINARY}/example--cyan--scan--3x2--{scheme}.webp`,
    still: `${CLOUDINARY}/example--cyan--3x2--adaptive.svg`,
    width: 1280,
    height: 854,
  } satisfies SetImageProps,
  render: (args: SetImageProps) => renderSetImage(args),
};

/*
 * Art-directed animated sources. Each breakpoint carries its own motion webp
 * and a matching reduced-motion still, both adaptive across light/dark.
 */
export const AnimatedArtDirection = {
  args: {
    alt: "",
    adaptive: true,
    animated: true,
    fit: "fluid",
    sources: [
      {
        height: 720,
        media: "(min-width: 64em)",
        srcSet: `${CLOUDINARY}/example--cyan--scan--16x9--{scheme}.webp`,
        still: `${CLOUDINARY}/example--cyan--16x9--adaptive.svg`,
        width: 1280,
      },
    ],
    src: `${CLOUDINARY}/example--cyan--scan--3x2--{scheme}.webp`,
    still: `${CLOUDINARY}/example--cyan--3x2--adaptive.svg`,
    width: 1280,
    height: 854,
  } satisfies SetImageProps,
  render: (args: SetImageProps) => renderSetImage(args),
};
