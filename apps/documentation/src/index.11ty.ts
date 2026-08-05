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
        fit: "cover",
        height: 450,
        priority: true,
        sources: [
          {
            height: 548,
            media: "(min-width: 58em)",
            srcSet:
              "https://res.cloudinary.com/monospaced/image/upload/2022-08-27_20.06.48--cyan--21x9_vb5unq.png",
            width: 1280,
          },
          {
            height: 720,
            media: "(min-width: 46em)",
            srcSet:
              "https://res.cloudinary.com/monospaced/image/upload/2022-08-27_20.06.48--cyan--16x9_gfu3wg.png",
            width: 1280,
          },
          {
            height: 854,
            media: "(min-width: 35em)",
            srcSet:
              "https://res.cloudinary.com/monospaced/image/upload/2022-08-27_20.06.48--cyan--3x2_jtofij.png",
            width: 1280,
          },
          {
            height: 1280,
            media: "(min-width: 25em)",
            srcSet:
              "https://res.cloudinary.com/monospaced/image/upload/2022-08-27_20.06.48--cyan--1x1_ftkyoo.png",
            width: 1280,
          },
        ],
        src: "https://res.cloudinary.com/monospaced/image/upload/2022-08-27_20.06.48--cyan--4x5_otvixv.png",
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
