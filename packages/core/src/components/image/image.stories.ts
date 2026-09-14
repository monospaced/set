import { specToArgTypes, specToComponentDescription } from "../../spec";
import {
  defineSetImage,
  renderSetImage,
  SET_IMAGE_SPEC,
  type SetImageProps,
  type SetImageSource,
} from "./image";

defineSetImage();

const baseArgTypes = specToArgTypes(SET_IMAGE_SPEC);

const meta = {
  argTypes: {
    ...baseArgTypes,
    adaptive: { ...baseArgTypes.adaptive, control: false },
    animated: { ...baseArgTypes.animated, control: false },
    leadSrc: { ...baseArgTypes.leadSrc, control: false },
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
    src: "https://res.cloudinary.com/monospaced/image/upload/f_auto,q_auto,w_640,h_480,c_fill/v1789385882/2018-04-20_15.28.26--cyan--640--mid.png",
    srcSet: [
      "https://res.cloudinary.com/monospaced/image/upload/f_auto,q_auto,w_344,h_258,c_fill/v1789385882/2018-04-20_15.28.26--cyan--640--mid.png 344w",
      "https://res.cloudinary.com/monospaced/image/upload/f_auto,q_auto,w_640,h_480,c_fill/v1789385882/2018-04-20_15.28.26--cyan--640--mid.png 640w",
      "https://res.cloudinary.com/monospaced/image/upload/f_auto,q_auto,w_688,h_516,c_fill/v1789250805/2018-04-20_15.28.26--cyan--mid.png 688w",
      "https://res.cloudinary.com/monospaced/image/upload/f_auto,q_auto,w_1032,h_774,c_fill/v1789250805/2018-04-20_15.28.26--cyan--mid.png 1032w",
      "https://res.cloudinary.com/monospaced/image/upload/f_auto,q_auto,w_1280,h_960,c_fill/v1789250805/2018-04-20_15.28.26--cyan--mid.png 1280w",
      "https://res.cloudinary.com/monospaced/image/upload/f_auto,q_auto,w_1920,h_1440,c_fill/v1789385882/2018-04-20_15.28.26--cyan--2560--mid.png 1920w",
    ].join(", "),
    // Storybook docs preview: fluid minus Storybook's ~82px chrome gutter (px —
    // foreign to SET's rem scale), capped at the 40rem display width.
    sizes: "min(100vw - 82px, 40rem)",
    sources: undefined,
  } satisfies SetImageProps,
  render: (args: SetImageProps) => renderSetImage(args),
};

const ANIMATED =
  "https://res.cloudinary.com/monospaced/image/upload/2025-10-23_12.15.15--cyan";

/**
 * Builds an art-directed animated source: `srcSet` is the scan base, `leadSrc`
 * the load-scan intro that plays once then reveals it, `still` the
 * reduced-motion adaptive SVG. `{scheme}` is substituted per light/dark node.
 */
const animatedSource = (
  aspect: string,
  media: string,
  width: number,
  height: number,
): SetImageSource => ({
  height,
  leadSrc: `${ANIMATED}--load-scan--${aspect}--{scheme}.webp`,
  media,
  srcSet: `${ANIMATED}--scan--${aspect}--{scheme}.webp`,
  still: `${ANIMATED}--${aspect}--adaptive.svg`,
  width,
});

export const SequencedAnimatedAdaptiveArtDirection = {
  args: {
    alt: "",
    adaptive: true,
    animated: true,
    fit: "fluid",
    sources: [
      animatedSource("16x9", "(min-width: 64em)", 1280, 720),
      animatedSource("3x2", "(min-width: 48em)", 1280, 854),
      animatedSource("1x1", "(min-width: 45em)", 1280, 1280),
      animatedSource("1x1--640", "(min-width: 30em)", 640, 640),
      animatedSource("4x5--640", "(min-width: 20em)", 640, 800),
    ],
    src: `${ANIMATED}--scan--4x5--640--{scheme}.webp`,
    leadSrc: `${ANIMATED}--load-scan--4x5--640--{scheme}.webp`,
    still: `${ANIMATED}--4x5--640--adaptive.svg`,
  } satisfies SetImageProps,
  render: (args: SetImageProps) => renderSetImage(args),
};

export const SimpleAnimated = {
  args: {
    alt: "Animated ordered-dither bitmap scan on the cyan palette axis.",
    animated: true,
    height: 480,
    src: "https://res.cloudinary.com/monospaced/image/upload/v1789386231/2018-04-20_15.28.26--cyan--scan--640--mid.webp",
    still:
      "https://res.cloudinary.com/monospaced/image/upload/f_auto,q_auto,w_640,h_480,c_fill/v1789385882/2018-04-20_15.28.26--cyan--640--mid.png",
    width: 640,
  } satisfies SetImageProps,
  render: (args: SetImageProps) => renderSetImage(args),
};
