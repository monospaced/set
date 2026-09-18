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
    sources: { ...imageArgTypes.sources, ...mediaCategory, control: false },
    stillSrc: { ...imageArgTypes.stillSrc, ...mediaCategory, control: false },
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
                children: "Heading",
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
    sources: [
      {
        height: 960,
        media: "(min-width: 42.625em)",
        srcSet:
          "https://res.cloudinary.com/monospaced/image/upload/v1789250406/2018-04-20_15.28.26--cyan--dark.png",
        width: 1280,
      },
    ],
    src: "https://res.cloudinary.com/monospaced/image/upload/v1789506378/2018-04-20_15.28.26--cyan--640--dark.png",
    surface: "brand",
  } satisfies StoryArgs,
  render: ({
    gravity,
    sizes,
    sources,
    src,
    srcSet,
    ...posterArgs
  }: StoryArgs) =>
    renderSetPoster({
      ...posterArgs,
      media: renderSetPosterImage({ gravity, sizes, sources, src, srcSet }),
    }),
};

export const AnimatedAdaptive = {
  args: {
    ...Default.args,
    adaptive: true,
    contentTheme: undefined,
    sizes: undefined,
    sources: [
      {
        height: 960,
        media: "(min-width: 42.625em)",
        srcSet:
          "https://res.cloudinary.com/monospaced/image/upload/2018-04-20_15.28.26--cyan--scan--{scheme}.webp",
        stillSrc:
          "https://res.cloudinary.com/monospaced/image/upload/2018-04-20_15.28.26--cyan--adaptive.svg",
        width: 1280,
      },
    ],
    src: "https://res.cloudinary.com/monospaced/image/upload/2018-04-20_15.28.26--cyan--640--scan--{scheme}.webp",
    stillSrc:
      "https://res.cloudinary.com/monospaced/image/upload/2018-04-20_15.28.26--cyan--640--adaptive.svg",
    srcSet: undefined,
  } satisfies StoryArgs,
  render: ({
    children,
    gravity,
    id,
    sizes,
    sources,
    src,
    srcSet,
    stillSrc,
    surface,
  }: StoryArgs) =>
    renderSetPoster({
      children,
      id,
      media: renderSetPosterImage({
        adaptive: true,
        gravity,
        sizes,
        sources,
        src,
        srcSet,
        stillSrc,
      }),
      surface,
    }),
};
