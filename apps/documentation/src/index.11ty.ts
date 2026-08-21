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
        adaptive: true,
        fit: "cover",
        height: 450,
        priority: true,
        sources: [
          {
            height: 548,
            media: "(min-width: 58em)",
            srcSet:
              "https://res.cloudinary.com/monospaced/image/upload/v1787268750/2022-08-27_20.06.48--cyan--adaptive--21x9_pkufk4.svg",
            width: 1280,
          },
          {
            height: 720,
            media: "(min-width: 46em)",
            srcSet:
              "https://res.cloudinary.com/monospaced/image/upload/v1787268749/2022-08-27_20.06.48--cyan--adaptive--16x9_topypw.svg",
            width: 1280,
          },
          {
            height: 854,
            media: "(min-width: 35em)",
            srcSet:
              "https://res.cloudinary.com/monospaced/image/upload/v1787268826/2022-08-27_20.06.48--cyan--adaptive--3x2_z9gvcz.svg",
            width: 1280,
          },
          {
            height: 1280,
            media: "(min-width: 25em)",
            srcSet:
              "https://res.cloudinary.com/monospaced/image/upload/v1787268825/2022-08-27_20.06.48--cyan--adaptive--1x1_piygpw.svg",
            width: 1280,
          },
        ],
        src: "https://res.cloudinary.com/monospaced/image/upload/v1787268827/2022-08-27_20.06.48--cyan--adaptive--4x5_zpgymo.svg",
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
