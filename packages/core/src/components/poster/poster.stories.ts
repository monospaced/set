import { specToArgTypes, specToComponentDescription } from "../../spec";
import { renderSetBox } from "../box/box";
import { renderSetButton } from "../button/button";
import { renderSetContainer } from "../container/container";
import { renderSetGrid, renderSetGridItem } from "../grid/grid";
import { renderSetHeading } from "../heading/heading";
import { SET_IMAGE_SPEC } from "../image/image";
import { renderSetStack } from "../stack/stack";
import { renderSetText } from "../text/text";
import {
  renderSetPoster,
  renderSetPosterImage,
  SET_POSTER_SPEC,
  type SetPosterImageProps,
  type SetPosterProps,
} from "./poster";

type StoryArgs = Omit<SetPosterProps, "media"> & SetPosterImageProps;

const posterArgTypes = specToArgTypes(SET_POSTER_SPEC);
const imageArgTypes = specToArgTypes(SET_IMAGE_SPEC);

const mediaCategory = { table: { category: "renderSetPosterImage" } };

const meta = {
  argTypes: {
    ...posterArgTypes,
    contentTheme: { ...posterArgTypes.contentTheme, control: false },
    // Media is built from these inside the story render. Group them so
    // the controls panel shows the props belong to renderSetPosterImage,
    // not to Poster itself.
    adaptive: { ...imageArgTypes.adaptive, ...mediaCategory, control: false },
    gravity: { ...imageArgTypes.gravity, ...mediaCategory },
    sizes: { ...imageArgTypes.sizes, ...mediaCategory },
    src: { ...imageArgTypes.src, ...mediaCategory },
    srcSet: { ...imageArgTypes.srcSet, ...mediaCategory },
    media: { ...posterArgTypes.media, control: false },
  },
  parameters: {
    docs: {
      description: {
        component: specToComponentDescription(SET_POSTER_SPEC),
      },
    },
    padding: 0,
  },
  title: "Structure/Poster",
};

export default meta;

export const Default = {
  args: {
    children: renderSetContainer({
      children: renderSetBox({
        background: "transparent",
        paddingBlock: "xl",
        paddingInline: "none",
        responsive: true,
        children: renderSetGrid({
          children: renderSetGridItem({
            align: "center",
            colSpan: 5,
            colSpanNarrow: 7,
            children: renderSetStack({
              align: "start",
              children: `${renderSetHeading({
                level: 1,
                responsive: true,
                size: "5xl",
                text: "Heading",
              })}${renderSetText({
                as: "p",
                children:
                  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
              })}${renderSetButton({
                size: "lg",
                label: "Call to action",
              })}`,
            }),
          }),
        }),
      }),
    }),
    contentTheme: "dark",
    gravity: "S",
    id: "",
    sizes:
      "(max-width: 24em) 21.5rem, (max-width: 42.5em) calc(100vw - 2.5rem), 40rem",
    src: "https://res.cloudinary.com/monospaced/image/upload/f_auto,q_auto,w_640,h_480,c_fill/v1785950427/2018-04-20_15.28.26--cyan_peg0w6.png",
    srcSet:
      "https://res.cloudinary.com/monospaced/image/upload/f_auto,q_auto,w_344,h_258,c_fill/v1785950427/2018-04-20_15.28.26--cyan_peg0w6.png 344w, https://res.cloudinary.com/monospaced/image/upload/f_auto,q_auto,w_640,h_480,c_fill/v1785950427/2018-04-20_15.28.26--cyan_peg0w6.png 640w, https://res.cloudinary.com/monospaced/image/upload/f_auto,q_auto,w_688,h_516,c_fill/v1785950427/2018-04-20_15.28.26--cyan_peg0w6.png 688w, https://res.cloudinary.com/monospaced/image/upload/f_auto,q_auto,w_1032,h_774,c_fill/v1785950427/2018-04-20_15.28.26--cyan_peg0w6.png 1032w, https://res.cloudinary.com/monospaced/image/upload/f_auto,q_auto,w_1280,h_960,c_fill/v1785950427/2018-04-20_15.28.26--cyan_peg0w6.png 1280w, https://res.cloudinary.com/monospaced/image/upload/f_auto,q_auto,w_1920,h_1440,c_fill/v1785950427/2018-04-20_15.28.26--cyan_peg0w6.png 1920w",
    surface: "brand",
  } satisfies StoryArgs,
  render: ({ gravity, sizes, src, srcSet, ...posterArgs }: StoryArgs) =>
    renderSetPoster({
      ...posterArgs,
      media: renderSetPosterImage({ gravity, sizes, src, srcSet }),
    }),
};

export const Adaptive = {
  args: {
    ...Default.args,
    adaptive: true,
    contentTheme: undefined,
    sizes: undefined,
    src: "https://res.cloudinary.com/monospaced/image/upload/v1787255306/example--cyan--adaptive_4_zpiqha.svg",
    srcSet: undefined,
  } satisfies StoryArgs,
  render: ({ children, gravity, id, sizes, src, srcSet, surface }: StoryArgs) =>
    renderSetPoster({
      children,
      id,
      media: renderSetPosterImage({
        adaptive: true,
        gravity,
        sizes,
        src,
        srcSet,
      }),
      surface,
    }),
};
