import { renderSetImage } from "@monospaced/set-core";

import type { ImageryData } from "./_data/imagery";
import imageryData from "./_data/imagery";
import { renderFoundationsShell } from "./_shared/foundations";

interface PageData {
  imagery: ImageryData;
}

const exampleImage = renderSetImage({
  alt: "Image rendered as a dark, two-level ordered-dither bitmap on the cyan palette axis.",
  fit: "fluid",
  height: 1600,
  sources: [
    {
      height: 548,
      media: "(min-width: 90em)",
      srcSet:
        "https://res.cloudinary.com/monospaced/image/upload/2025-10-23_12.15.15--cyan--21x9_timbyu.png",
      width: 1280,
    },
    {
      height: 720,
      media: "(min-width: 64em)",
      srcSet:
        "https://res.cloudinary.com/monospaced/image/upload/2025-10-23_12.15.15--cyan--16x9_osdt7w.png",
      width: 1280,
    },
    {
      height: 854,
      media: "(min-width: 48em)",
      srcSet:
        "https://res.cloudinary.com/monospaced/image/upload/2025-10-23_12.15.15--cyan--3x2_l6ysx0.png",
      width: 1280,
    },
    {
      height: 1280,
      media: "(min-width: 30em)",
      srcSet:
        "https://res.cloudinary.com/monospaced/image/upload/2025-10-23_12.15.15--cyan--1x1_studcj.png",
      width: 1280,
    },
  ],
  src: "https://res.cloudinary.com/monospaced/image/upload/2025-10-23_12.15.15--cyan--4x5_nijpju.png",
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
