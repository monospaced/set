import { renderSetImage } from "@monospaced/set-core";

import type { ImageryData } from "./_data/imagery";
import imageryData from "./_data/imagery";
import { renderFoundationsShell } from "./_shared/foundations";

interface PageData {
  imagery: ImageryData;
}

const IMAGE =
  "https://res.cloudinary.com/monospaced/image/upload/2025-10-23_12.15.15--cyan";

const exampleImage = renderSetImage({
  adaptive: true,
  alt: "Image rendered as a two-level ordered-dither bitmap on the cyan palette axis.",
  fit: "fluid",
  height: 1600,
  sources: [
    {
      height: 548,
      media: "(min-width: 90em)",
      srcSet: `${IMAGE}--21x9--adaptive.svg`,
      width: 1280,
    },
    {
      height: 720,
      media: "(min-width: 64em)",
      srcSet: `${IMAGE}--16x9--adaptive.svg`,
      width: 1280,
    },
    {
      height: 854,
      media: "(min-width: 48em)",
      srcSet: `${IMAGE}--3x2--adaptive.svg`,
      width: 1280,
    },
    {
      height: 1280,
      media: "(min-width: 30em)",
      srcSet: `${IMAGE}--1x1--adaptive.svg`,
      width: 1280,
    },
  ],
  src: `${IMAGE}--4x5--adaptive.svg`,
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
