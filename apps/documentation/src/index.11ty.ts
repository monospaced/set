import {
  renderSetBox,
  renderSetContainer,
  renderSetGrid,
  renderSetGridItem,
  renderSetHeading,
  renderSetImage,
  renderSetText,
} from "@monospaced/set-core";

import type { SiteData } from "./_data/site";

const HERO =
  "https://res.cloudinary.com/monospaced/image/upload/2022-08-27_20.06.48--cyan";

interface PageData {
  site: SiteData;
}

export default class Index {
  data() {
    return {
      layout: "base.11ty.ts",
      permalink: "/",
      title: "",
    };
  }

  render(data: PageData): string {
    const { site } = data;
    return [
      renderSetImage({
        adaptive: true,
        animated: true,
        fit: "cover",
        height: 450,
        priority: true,
        sources: [
          {
            height: 1096,
            media: "(min-width: 100em)",
            srcSet: `${HERO}--21x9--2560--load--{scheme}.webp`,
            still: `${HERO}--21x9--2560--adaptive.svg`,
            width: 2560,
          },
          {
            height: 548,
            media: "(min-width: 58em)",
            srcSet: `${HERO}--21x9--load--{scheme}.webp`,
            still: `${HERO}--21x9--adaptive.svg`,
            width: 1280,
          },
          {
            height: 720,
            media: "(min-width: 46em)",
            srcSet: `${HERO}--16x9--load--{scheme}.webp`,
            still: `${HERO}--16x9--adaptive.svg`,
            width: 1280,
          },
          {
            height: 854,
            media: "(min-width: 40em)",
            srcSet: `${HERO}--3x2--load--{scheme}.webp`,
            still: `${HERO}--3x2--adaptive.svg`,
            width: 1280,
          },
          {
            height: 427,
            media: "(min-width: 35em)",
            srcSet: `${HERO}--3x2--640--load--{scheme}.webp`,
            still: `${HERO}--3x2--640--adaptive.svg`,
            width: 640,
          },
          {
            height: 640,
            media: "(min-width: 25em)",
            srcSet: `${HERO}--1x1--640--load--{scheme}.webp`,
            still: `${HERO}--1x1--640--adaptive.svg`,
            width: 640,
          },
          {
            height: 640,
            media: "(min-width: 20em)",
            srcSet: `${HERO}--4x5--640--load--{scheme}.webp`,
            still: `${HERO}--4x5--640--adaptive.svg`,
            width: 800,
          },
        ],
        src: `${HERO}--4x5--640--load--{scheme}.webp`,
        still: `${HERO}--4x5--640--adaptive.svg`,
      }),
      renderSetBox({
        paddingBlock: "lg",
        paddingInline: "none",
        children: renderSetContainer({
          maxInlineSize: "none",
          children: renderSetGrid({
            children: [
              renderSetGridItem({
                colSpan: 5,
                colStart: 2,
                children: renderSetHeading({
                  level: 1,
                  responsive: true,
                  size: "lg",
                  text: site.title,
                }),
              }),
              renderSetGridItem({
                colSpan: 5,
                colStart: 7,
                children: renderSetText({
                  as: "p",
                  children: site.description,
                  linkVisited: false,
                  responsive: true,
                  size: "lg",
                }),
              }),
            ].join(""),
          }),
        }),
      }),
    ].join("");
  }
}
