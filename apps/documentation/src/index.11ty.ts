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
            height: 548,
            media: "(min-width: 58em)",
            srcSet: `${HERO}--load--21x9--{scheme}.webp`,
            still: `${HERO}--21x9--adaptive.svg`,
            width: 1280,
          },
          {
            height: 720,
            media: "(min-width: 46em)",
            srcSet: `${HERO}--load--16x9--{scheme}.webp`,
            still: `${HERO}--16x9--adaptive.svg`,
            width: 1280,
          },
          {
            height: 854,
            media: "(min-width: 35em)",
            srcSet: `${HERO}--load--3x2--{scheme}.webp`,
            still: `${HERO}--3x2--adaptive.svg`,
            width: 1280,
          },
          {
            height: 1280,
            media: "(min-width: 25em)",
            srcSet: `${HERO}--load--1x1--{scheme}.webp`,
            still: `${HERO}--1x1--adaptive.svg`,
            width: 1280,
          },
        ],
        src: `${HERO}--load--4x5--{scheme}.webp`,
        still: `${HERO}--4x5--adaptive.svg`,
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
