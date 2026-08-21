import { renderSetImage } from "@monospaced/set-core";

import type { ImageryData } from "./_data/imagery";
import imageryData from "./_data/imagery";
import { renderFoundationsShell } from "./_shared/foundations";

interface PageData {
  imagery: ImageryData;
}

const exampleImage = renderSetImage({
  adaptive: true,
  alt: "Image rendered as a two-level ordered-dither bitmap on the cyan palette axis.",
  fit: "fluid",
  height: 1600,
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
  width: 1280,
});

export default class Imagery {
  data() {
    return {
      layout: "base.11ty.ts",
      permalink: "/imagery/",
      // Meta description: the strapline with markdown links reduced to text.
      description: imageryData.strapline.replaceAll(
        /\[([^\]]+)\]\([^)]+\)/g,
        "$1",
      ),
      title: imageryData.title,
    };
  }

  render(data: PageData): string {
    return renderFoundationsShell({
      children: exampleImage,
      strapline: data.imagery.strapline,
      title: data.imagery.title,
    });
  }
}
