import {
  renderSetBox,
  renderSetContainer,
  renderSetDivider,
  renderSetFigure,
  renderSetGrid,
  renderSetGridItem,
  renderSetHeading,
  renderSetImage,
  renderSetStack,
  renderSetText,
  renderSetVideo,
} from "@monospaced/set-core";

import type { BrandData } from "./_data/brand";
import brandData from "./_data/brand";

interface PageData {
  brand: BrandData;
}

export default class Brand {
  data() {
    return {
      description: brandData.strapline,
      layout: "base.11ty.ts",
      permalink: "/brand/",
      title: brandData.title,
    };
  }

  render(data: PageData): string {
    const brand = data.brand;

    return renderSetContainer({
      maxInlineSize: "none",
      children: renderSetBox({
        paddingBlock: "lg",
        paddingInline: "none",
        responsive: true,
        children: renderSetGrid({
          children: [
            renderSetGridItem({
              colStart: 2,
              colSpan: 10,
              children: renderSetStack({
                gap: "md",
                children: [
                  renderSetHeading({
                    level: 1,
                    responsive: true,
                    size: "2xl",
                    children: brand.title,
                  }),
                  renderSetText({
                    as: "p",
                    children: brand.strapline,
                    responsive: true,
                    size: "lg",
                  }),
                  renderSetDivider({ tone: "brand" }),
                ].join(""),
              }),
            }),
            renderSetGridItem({
              colStart: 2,
              colSpan: 10,
              children: renderSetStack({
                gap: "xl",
                children: [
                  renderSetFigure({
                    caption: "Logo",
                    children: renderSetImage({
                      alt: "The Monospaced wordmark in white monospaced type beside the checkered pixel logomark, on a brand cyan field",
                      height: 548,
                      src: "https://res.cloudinary.com/monospaced/image/upload/v1789299734/Logo_animated.webp",
                      stillSrc:
                        "https://res.cloudinary.com/monospaced/image/upload/f_auto,q_auto/v1787217367/Logo_hxhjg8.png",
                      width: 1280,
                    }),
                  }),
                  renderSetFigure({
                    caption: "Logo construction",
                    children: renderSetVideo({
                      autoPlay: true,
                      controls: true,
                      height: 548,
                      loop: true,
                      muted: true,
                      src: "https://res.cloudinary.com/monospaced/video/upload/v1787135023/Logo_constructions_muqw7c.mp4",
                      width: 1280,
                    }),
                  }),
                  renderSetFigure({
                    caption: "Logomark",
                    children: renderSetImage({
                      alt: "The logomark alone: a narrow vertical checkerboard of white pixel cells centered on a brand cyan field",
                      height: 548,
                      src: "https://res.cloudinary.com/monospaced/image/upload/f_auto,q_auto/v1787217419/Logomark_sioepa.png",
                      width: 1280,
                    }),
                  }),
                  renderSetFigure({
                    caption: "Signature animation",
                    children: renderSetVideo({
                      autoPlay: true,
                      controls: true,
                      height: 548,
                      loop: true,
                      muted: true,
                      src: "https://res.cloudinary.com/monospaced/video/upload/v1787135028/Logomark_xval0a.mp4",
                      width: 1280,
                    }),
                  }),
                  renderSetFigure({
                    caption: "Emblem",
                    children: renderSetImage({
                      alt: "The wordmark set between two horizontal checkered strips, white on brand cyan",
                      height: 548,
                      src: "https://res.cloudinary.com/monospaced/image/upload/f_auto,q_auto/v1787217526/Emblem_myotyd.png",
                      width: 1280,
                    }),
                  }),
                  renderSetFigure({
                    caption: "Typeface",
                    children: renderSetImage({
                      alt: "Type specimen of Berkeley Mono on near-black, showing 'Hamburgefonstiv' and the digits zero to nine",
                      height: 548,
                      src: "https://res.cloudinary.com/monospaced/image/upload/f_auto,q_auto/v1787217223/Typeface_whbldp.png",
                      width: 1280,
                    }),
                  }),
                  renderSetFigure({
                    caption: "Prose",
                    children: renderSetImage({
                      alt: "A sample sentence set in light monospaced type on near-black: 'Execute gzip benchmarks to analyse quick dev proxy flaws before building json.'",
                      height: 548,
                      src: "https://res.cloudinary.com/monospaced/image/upload/f_auto,q_auto/v1787217221/Prose_typography_kfovbp.png",
                      width: 1280,
                    }),
                  }),
                  renderSetFigure({
                    caption: "Monospace",
                    children: renderSetImage({
                      alt: "A code sample distinguishing easily confused glyphs — capital O, zero, capital I, one, and lowercase l — with arrow and comparison ligatures",
                      height: 548,
                      src: "https://res.cloudinary.com/monospaced/image/upload/f_auto,q_auto/v1787217219/Technical_typography_xneubs.png",
                      width: 1280,
                    }),
                  }),
                  renderSetFigure({
                    caption: "Cyan",
                    children: renderSetImage({
                      alt: "The twelve-step cyan ramp as vertical columns, running from near-white through saturated mid teal to near-black",
                      height: 548,
                      src: "https://res.cloudinary.com/monospaced/image/upload/f_auto,q_auto/v1787139664/Brand_cyan_fs41ig.png",
                      width: 1280,
                    }),
                  }),
                  renderSetFigure({
                    caption: "Logo colorways",
                    children: renderSetImage({
                      alt: "Four logo colorways in quadrants: deep teal on pale cyan, near-black on mid cyan, white on brand cyan, and light cyan on near-black",
                      height: 548,
                      src: "https://res.cloudinary.com/monospaced/image/upload/f_auto,q_auto/v1787181319/Cyan_logos_j1rmcd.png",
                      width: 1280,
                    }),
                  }),
                  renderSetFigure({
                    caption: "Logomark colorways",
                    children: renderSetImage({
                      alt: "The logomark repeated across four side-by-side panels, each pairing a different tone from the cyan ramp with its background",
                      height: 548,
                      src: "https://res.cloudinary.com/monospaced/image/upload/f_auto,q_auto/v1787181317/Cyan_logomarks_mqi9kn.png",
                      width: 1280,
                    }),
                  }),
                  renderSetFigure({
                    caption: "Supporting colors",
                    children: renderSetImage({
                      alt: "A grid of twelve-step ramps for the supporting hues, one hue per row, each running light to dark",
                      height: 548,
                      src: "https://res.cloudinary.com/monospaced/image/upload/f_auto,q_auto/v1787140729/Supporting_color_ywemac.png",
                      width: 1280,
                    }),
                  }),
                  renderSetFigure({
                    caption: "Syntax highlighting",
                    children: renderSetImage({
                      alt: "A code sample on dark teal highlighted in the brand palette: gray comments, blue keywords, orange numbers, green strings, and pink and violet accents",
                      height: 548,
                      src: "https://res.cloudinary.com/monospaced/image/upload/f_auto,q_auto/v1787180062/Syntax_highlighting_hvktmk.png",
                      width: 1280,
                    }),
                  }),
                  renderSetFigure({
                    caption: "Photo treatment",
                    children: `<div class="docs-photo-treatment">${[
                      renderSetImage({
                        alt: "Cyan halftone photograph of a train passing in front of building facades",
                        fit: "fluid",
                        sources: [
                          {
                            height: 854,
                            media: "(min-width: 103em)",
                            srcSet:
                              "https://res.cloudinary.com/monospaced/image/upload/2018-10-29_15.35.16--cyan--3x2--mid.png",
                            width: 1280,
                          },
                          {
                            height: 640,
                            media: "(min-width: 46em)",
                            srcSet:
                              "https://res.cloudinary.com/monospaced/image/upload/2018-10-29_15.35.16--cyan--3x2--960--mid.png",
                            width: 960,
                          },
                          {
                            height: 427,
                            media: "(min-width: 40em)",
                            srcSet:
                              "https://res.cloudinary.com/monospaced/image/upload/2018-10-29_15.35.16--cyan--3x2--640--mid.png",
                            width: 640,
                          },
                          {
                            height: 640,
                            media: "(min-width: 24em)",
                            srcSet:
                              "https://res.cloudinary.com/monospaced/image/upload/2018-10-29_15.35.16--cyan--3x2--960--mid.png",
                            width: 960,
                          },
                          {
                            height: 427,
                            media: "(min-width: 20em)",
                            srcSet:
                              "https://res.cloudinary.com/monospaced/image/upload/2018-10-29_15.35.16--cyan--3x2--640--mid.png",
                            width: 640,
                          },
                        ],
                        src: "https://res.cloudinary.com/monospaced/image/upload/2018-10-29_15.35.16--cyan--3x2--640--mid.png",
                      }),
                      renderSetImage({
                        alt: "Cyan halftone photograph of autumnal tree branches",
                        fit: "fluid",
                        sources: [
                          {
                            height: 854,
                            media: "(min-width: 103em)",
                            srcSet:
                              "https://res.cloudinary.com/monospaced/image/upload/2018-11-11_10.29.59--cyan--3x2--mid.png",
                            width: 1280,
                          },
                          {
                            height: 640,
                            media: "(min-width: 46em)",
                            srcSet:
                              "https://res.cloudinary.com/monospaced/image/upload/2018-11-11_10.29.59--cyan--3x2--960--mid.png",
                            width: 960,
                          },
                          {
                            height: 427,
                            media: "(min-width: 40em)",
                            srcSet:
                              "https://res.cloudinary.com/monospaced/image/upload/2018-11-11_10.29.59--cyan--3x2--640--mid.png",
                            width: 640,
                          },
                          {
                            height: 640,
                            media: "(min-width: 24em)",
                            srcSet:
                              "https://res.cloudinary.com/monospaced/image/upload/2018-11-11_10.29.59--cyan--3x2--960--mid.png",
                            width: 960,
                          },
                          {
                            height: 427,
                            media: "(min-width: 20em)",
                            srcSet:
                              "https://res.cloudinary.com/monospaced/image/upload/2018-11-11_10.29.59--cyan--3x2--640--mid.png",
                            width: 640,
                          },
                        ],
                        src: "https://res.cloudinary.com/monospaced/image/upload/2018-11-11_10.29.59--cyan--3x2--640--mid.png",
                      }),
                      renderSetImage({
                        alt: "Cyan halftone photograph of a tropical fish in an aquarium",
                        fit: "fluid",
                        sources: [
                          {
                            height: 854,
                            media: "(min-width: 103em)",
                            srcSet:
                              "https://res.cloudinary.com/monospaced/image/upload/2015-12-29_13.22.34--cyan--3x2--mid.png",
                            width: 1280,
                          },
                          {
                            height: 640,
                            media: "(min-width: 46em)",
                            srcSet:
                              "https://res.cloudinary.com/monospaced/image/upload/2015-12-29_13.22.34--cyan--3x2--960--mid.png",
                            width: 960,
                          },
                          {
                            height: 427,
                            media: "(min-width: 40em)",
                            srcSet:
                              "https://res.cloudinary.com/monospaced/image/upload/2015-12-29_13.22.34--cyan--3x2--640--mid.png",
                            width: 640,
                          },
                          {
                            height: 640,
                            media: "(min-width: 24em)",
                            srcSet:
                              "https://res.cloudinary.com/monospaced/image/upload/2015-12-29_13.22.34--cyan--3x2--960--mid.png",
                            width: 960,
                          },
                          {
                            height: 427,
                            media: "(min-width: 20em)",
                            srcSet:
                              "https://res.cloudinary.com/monospaced/image/upload/2015-12-29_13.22.34--cyan--3x2--640--mid.png",
                            width: 640,
                          },
                        ],
                        src: "https://res.cloudinary.com/monospaced/image/upload/2015-12-29_13.22.34--cyan--3x2--640--mid.png",
                      }),
                      renderSetImage({
                        alt: "Cyan halftone photograph of cumulonimbus cloud",
                        fit: "fluid",
                        sources: [
                          {
                            height: 854,
                            media: "(min-width: 103em)",
                            srcSet:
                              "https://res.cloudinary.com/monospaced/image/upload/2018-04-20_15.28.26--cyan--3x2--mid.png",
                            width: 1280,
                          },
                          {
                            height: 640,
                            media: "(min-width: 46em)",
                            srcSet:
                              "https://res.cloudinary.com/monospaced/image/upload/2018-04-20_15.28.26--cyan--3x2--960--mid.png",
                            width: 960,
                          },
                          {
                            height: 427,
                            media: "(min-width: 40em)",
                            srcSet:
                              "https://res.cloudinary.com/monospaced/image/upload/2018-04-20_15.28.26--cyan--3x2--640--mid.png",
                            width: 640,
                          },
                          {
                            height: 640,
                            media: "(min-width: 24em)",
                            srcSet:
                              "https://res.cloudinary.com/monospaced/image/upload/2018-04-20_15.28.26--cyan--3x2--960--mid.png",
                            width: 960,
                          },
                          {
                            height: 427,
                            media: "(min-width: 20em)",
                            srcSet:
                              "https://res.cloudinary.com/monospaced/image/upload/2018-04-20_15.28.26--cyan--3x2--640--mid.png",
                            width: 640,
                          },
                        ],
                        src: "https://res.cloudinary.com/monospaced/image/upload/2018-04-20_15.28.26--cyan--3x2--640--mid.png",
                      }),
                    ].join("")}</div>`,
                  }),
                  renderSetFigure({
                    caption: "Ambient animation",
                    children: `<div style="max-inline-size: 80rem">${renderSetImage(
                      {
                        alt: "Cyan halftone photograph of cumulonimbus cloud with a lopping scan animation effect",
                        fit: "fluid",
                        sources: [
                          {
                            height: 852,
                            media: "(min-width: 101em)",
                            srcSet:
                              "https://res.cloudinary.com/monospaced/image/upload/v1790177860/2018-04-20_15.28.26--cyan--3x2--scan--mid.webp",
                            stillSrc:
                              "https://res.cloudinary.com/monospaced/image/upload/v1789307949/2018-04-20_15.28.26--cyan--3x2--mid.png",
                            width: 1280,
                          },
                          {
                            height: 640,
                            media: "(min-width: 46em)",
                            srcSet:
                              "https://res.cloudinary.com/monospaced/image/upload/v1790177860/2018-04-20_15.28.26--cyan--3x2--960--scan--mid.webp",
                            stillSrc:
                              "https://res.cloudinary.com/monospaced/image/upload/v1790172756/2018-04-20_15.28.26--cyan--3x2--960--mid.png",
                            width: 960,
                          },
                          {
                            height: 426,
                            media: "(min-width: 33em)",
                            srcSet:
                              "https://res.cloudinary.com/monospaced/image/upload/v1790177860/2018-04-20_15.28.26--cyan--3x2--640--scan--mid.webp",
                            stillSrc:
                              "https://res.cloudinary.com/monospaced/image/upload/v1790172732/2018-04-20_15.28.26--cyan--3x2--640--mid.png",
                            width: 640,
                          },
                          {
                            height: 320,
                            media: "(min-width: 20em)",
                            srcSet:
                              "https://res.cloudinary.com/monospaced/image/upload/v1790177860/2018-04-20_15.28.26--cyan--3x2--480--scan--mid.webp",
                            stillSrc:
                              "https://res.cloudinary.com/monospaced/image/upload/v1790201532/2018-04-20_15.28.26--cyan--3x2--480--mid.png",
                            width: 480,
                          },
                        ],
                        src: "https://res.cloudinary.com/monospaced/image/upload/v1790177860/2018-04-20_15.28.26--cyan--3x2--480--scan--mid.webp",
                        stillSrc:
                          "https://res.cloudinary.com/monospaced/image/upload/v1790201532/2018-04-20_15.28.26--cyan--3x2--480--mid.png",
                      },
                    )}</div>`,
                  }),
                  renderSetFigure({
                    caption: "Logo on photo treatment",
                    children: `<div style="max-inline-size: 80rem">${renderSetImage(
                      {
                        alt: "Monospaced logo in white on a cyan halftone photograph of cumulonimbus cloud",
                        fit: "fluid",
                        sources: [
                          {
                            height: 1280,
                            media: "(min-width: 92.75em)",
                            srcSet:
                              "https://res.cloudinary.com/monospaced/image/upload/v1790200055/Logo_on_photo_treatment_1920.png",
                            width: 1920,
                          },
                          {
                            height: 854,
                            media: "(min-width: 40em)",
                            srcSet:
                              "https://res.cloudinary.com/monospaced/image/upload/v1790198452/Logo_on_photo_treatment.png",
                            width: 1280,
                          },
                          {
                            height: 640,
                            media: "(min-width: 24em)",
                            srcSet:
                              "https://res.cloudinary.com/monospaced/image/upload/v1790198540/Logo_on_photo_treatment_960.png",
                            width: 960,
                          },
                          {
                            height: 427,
                            media: "(min-width: 20em)",
                            srcSet:
                              "https://res.cloudinary.com/monospaced/image/upload/v1790198668/Logo_on_photo_treatment_640.png",
                            width: 640,
                          },
                        ],
                        src: "https://res.cloudinary.com/monospaced/image/upload/v1790198668/Logo_on_photo_treatment_640.png",
                      },
                    )}</div>`,
                  }),
                  renderSetFigure({
                    caption: "Stickers",
                    children: renderSetImage({
                      alt: "Photograph of a laptop sticker-bombed with Monospaced brand stickers",
                      height: 960,
                      src: "https://res.cloudinary.com/monospaced/image/upload/f_auto,q_auto/v1787168681/Stickers_j0kqx8.jpg",
                      width: 1280,
                    }),
                  }),
                  renderSetFigure({
                    caption: "Posters",
                    children: renderSetImage({
                      alt: "Two stylised posters representing aspect of the Monospaced visual brand identity hanging in wooden frames on a dark cyan wall",
                      height: 960,
                      src: "https://res.cloudinary.com/monospaced/image/upload/f_auto,q_auto/v1787691081/Posters_whvojg.jpg",
                      width: 1280,
                    }),
                  }),
                ].join(""),
              }),
            }),
          ].join(""),
        }),
      }),
    });
  }
}
