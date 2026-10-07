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
              children: `<div style="max-inline-size: 80rem">${renderSetStack({
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
                    caption: "Logomark animation",
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
                  // renderSetFigure({
                  //   caption: "Emblem",
                  //   children: renderSetImage({
                  //     alt: "The wordmark set between two horizontal checkered strips, white on brand cyan",
                  //     height: 548,
                  //     src: "https://res.cloudinary.com/monospaced/image/upload/f_auto,q_auto/v1787217526/Emblem_myotyd.png",
                  //     width: 1280,
                  //   }),
                  // }),
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
                    caption: "Prose typography",
                    children: renderSetImage({
                      alt: "A sample sentence set in light monospaced type on near-black: 'Execute gzip benchmarks to analyse quirky dev proxy flaws before building json.'",
                      height: 548,
                      src: "https://res.cloudinary.com/monospaced/image/upload/f_auto,q_auto/v1790702905/Prose_typography_kfovbp.png",
                      width: 1280,
                    }),
                  }),
                  renderSetFigure({
                    caption: "Monospace typography",
                    children: renderSetImage({
                      alt: "A code sample distinguishing easily confused glyphs — capital O, zero, capital I, one, and lowercase l — with arrow and comparison ligatures",
                      height: 548,
                      src: "https://res.cloudinary.com/monospaced/image/upload/f_auto,q_auto/v1790893739/Monospace_typography.png",
                      width: 1280,
                    }),
                  }),
                  renderSetFigure({
                    caption: "Iconography",
                    children: renderSetImage({
                      alt: "A set of outline interface icons in a grid, drawn at a consistent stroke weight to match Berkeley Mono.",
                      height: 548,
                      src: "https://res.cloudinary.com/monospaced/image/upload/f_auto,q_auto/v1790324137/Iconography.png",
                      width: 1280,
                    }),
                  }),
                  renderSetFigure({
                    caption: "Cyan",
                    children: renderSetImage({
                      alt: "The twelve-step cyan ramp as vertical columns, running from near-white through saturated mid teal to near-black",
                      height: 548,
                      src: "https://res.cloudinary.com/monospaced/image/upload/f_auto,q_auto/v1790893738/Cyan.png",
                      width: 1280,
                    }),
                  }),
                  renderSetFigure({
                    caption: "Logo colorways",
                    children: renderSetImage({
                      alt: "Four logo colorways in quadrants: deep teal on pale cyan, near-black on mid cyan, white on brand cyan, and light cyan on near-black",
                      height: 548,
                      src: "https://res.cloudinary.com/monospaced/image/upload/f_auto,q_auto/v1790893743/Logo_colorways.png",
                      width: 1280,
                    }),
                  }),
                  renderSetFigure({
                    caption: "Logomark colorways",
                    children: renderSetImage({
                      alt: "The logomark repeated across four side-by-side panels, each pairing a different tone from the cyan ramp with its background",
                      height: 548,
                      src: "https://res.cloudinary.com/monospaced/image/upload/f_auto,q_auto/v1790893744/Logomark_colorways.png",
                      width: 1280,
                    }),
                  }),
                  renderSetFigure({
                    caption: "Spectrum",
                    children: renderSetImage({
                      alt: "A grid of twelve-step ramps for the supporting hues, one hue per row, each running light to dark",
                      height: 548,
                      src: "https://res.cloudinary.com/monospaced/image/upload/f_auto,q_auto/v1790893734/Spectrum.png",
                      width: 1280,
                    }),
                  }),
                  renderSetFigure({
                    caption: "Interface colors",
                    children: `<div class="docs-photo-treatment">${[
                      renderSetImage({
                        alt: "Four status messages on dark cyan: Info in azure, Success in green, Warning in yellow and Error in red, each a tinted panel with a matching icon, title and one-line description.",
                        fit: "fluid",
                        height: 548,
                        src: "https://res.cloudinary.com/monospaced/image/upload/f_auto,q_auto/v1790893727/Interface_colors_1.png",
                        width: 1280,
                      }),
                      renderSetImage({
                        alt: "Column and pie charts of component instance counts, with each of eight components in a distinct supporting color and a legend beneath.",
                        fit: "fluid",
                        height: 548,
                        src: "https://res.cloudinary.com/monospaced/image/upload/f_auto,q_auto/v1790893734/Interface_colors_2.png",
                        width: 1280,
                      }),
                      renderSetImage({
                        alt: "Three rows of generic avatar icons in circles, tinted through rose, violet and orange in alternating lighter and darker steps.",
                        fit: "fluid",
                        height: 548,
                        src: "https://res.cloudinary.com/monospaced/image/upload/f_auto,q_auto/v1790893728/Interface_colors_3.png",
                        width: 1280,
                      }),
                      renderSetImage({
                        alt: "A JavaScript sample syntax-highlighted in the brand palette: blue keywords, yellow class names, green strings, red constants and a gray italic comment.",
                        fit: "fluid",
                        height: 548,
                        src: "https://res.cloudinary.com/monospaced/image/upload/f_auto,q_auto/v1790893728/Interface_colors_4.png",
                        width: 1280,
                      }),
                    ].join("")}</div>`,
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
                    caption: "Animated and adaptive photo treatment",
                    children: `<div class="docs-photo-treatment">${[
                      renderSetImage({
                        alt: "Cyan halftone photograph of cumulonimbus cloud with a looping scan animation effect",
                        fit: "fluid",
                        sources: [
                          {
                            height: 426,
                            media: "(min-width: 103em)",
                            srcSet:
                              "https://res.cloudinary.com/monospaced/image/upload/v1790177860/2018-04-20_15.28.26--cyan--3x2--640--scan--mid.webp",
                            stillSrc:
                              "https://res.cloudinary.com/monospaced/image/upload/v1790172732/2018-04-20_15.28.26--cyan--3x2--640--mid.png",
                            width: 640,
                          },
                          {
                            height: 320,
                            media: "(min-width: 40em)",
                            srcSet:
                              "https://res.cloudinary.com/monospaced/image/upload/v1790177860/2018-04-20_15.28.26--cyan--3x2--480--scan--mid.webp",
                            stillSrc:
                              "https://res.cloudinary.com/monospaced/image/upload/v1790201532/2018-04-20_15.28.26--cyan--3x2--480--mid.png",
                            width: 480,
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
                      }),
                      renderSetImage({
                        adaptive: true,
                        alt: "Cyan halftone photograph of cumulonimbus clouds, adaptive to current light/dark mode",
                        fit: "fluid",
                        sources: [
                          {
                            height: 854,
                            media: "(min-width: 103em)",
                            srcSet:
                              "https://res.cloudinary.com/monospaced/image/upload/v1790283163/2018-04-20_15.28.26--cyan--3x2--adaptive.svg",
                            width: 1280,
                          },
                          {
                            height: 640,
                            media: "(min-width: 46em)",
                            srcSet:
                              "https://res.cloudinary.com/monospaced/image/upload/v1790282922/2018-04-20_15.28.26--cyan--3x2--960--adaptive.svg",
                            width: 960,
                          },
                          {
                            height: 427,
                            media: "(min-width: 40em)",
                            srcSet:
                              "https://res.cloudinary.com/monospaced/image/upload/v1790283167/2018-04-20_15.28.26--cyan--3x2--640--adaptive.svg",
                            width: 640,
                          },
                          {
                            height: 640,
                            media: "(min-width: 24em)",
                            srcSet:
                              "https://res.cloudinary.com/monospaced/image/upload/v1790282922/2018-04-20_15.28.26--cyan--3x2--960--adaptive.svg",
                            width: 960,
                          },
                          {
                            height: 427,
                            media: "(min-width: 20em)",
                            srcSet:
                              "https://res.cloudinary.com/monospaced/image/upload/v1790283167/2018-04-20_15.28.26--cyan--3x2--640--adaptive.svg",
                            width: 640,
                          },
                        ],
                        src: "https://res.cloudinary.com/monospaced/image/upload/v1790283167/2018-04-20_15.28.26--cyan--3x2--640--adaptive.svg",
                      }),
                    ].join("")}</div>`,
                  }),
                  renderSetFigure({
                    caption: "Logo on photo treatment",
                    children: renderSetImage({
                      alt: "Monospaced logo in white on a cyan halftone photograph of cumulonimbus clouds",
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
                    }),
                  }),
                  renderSetFigure({
                    caption: "Web",
                    children: `<div class="docs-photo-treatment">${[
                      renderSetImage({
                        alt: "Bluesky profile header for Monospaced: a cyan halftone banner, the logomark as the circular avatar, and the handle @monospaced.com.",
                        fit: "fluid",
                        height: 853,
                        src: "https://res.cloudinary.com/monospaced/image/upload/f_auto,q_auto/v1790891754/Web_1.png",
                        width: 1280,
                      }),
                      renderSetImage({
                        alt: "Link preview card for monospaced.com, showing the cyan halftone OG image above the site title and description.",
                        fit: "fluid",
                        height: 853,
                        src: "https://res.cloudinary.com/monospaced/image/upload/f_auto,q_auto/v1790891756/Web_2.png",
                        width: 1280,
                      }),
                      renderSetImage({
                        alt: "A browser's shortcuts row with six site icons; the last is the Monospaced logomark on a brand cyan tile, labelled 'monospaced'",
                        fit: "fluid",
                        height: 853,
                        src: "https://res.cloudinary.com/monospaced/image/upload/f_auto,q_auto/v1790891753/Web_3.png",
                        width: 1280,
                      }),
                      renderSetImage({
                        alt: "A Google search result for monospaced.com, with the logomark favicon beside the URL and the site description below.",
                        fit: "fluid",
                        height: 853,
                        src: "https://res.cloudinary.com/monospaced/image/upload/f_auto,q_auto/v1790891753/Web_4.png",
                        width: 1280,
                      }),
                    ].join("")}</div>`,
                  }),
                  renderSetFigure({
                    caption: "Mobile",
                    children: `<div class="docs-photo-treatment">${[
                      renderSetImage({
                        alt: "A phone on an oak table showing the monospaced.com homepage: a cyan halftone image above the strapline and introduction in monospaced type.",
                        fit: "fluid",
                        height: 960,
                        src: "https://res.cloudinary.com/monospaced/image/upload/f_auto,q_auto/v1790891936/Mobile_1.jpg",
                        width: 1280,
                      }),
                      renderSetImage({
                        alt: "A phone showing a long-form page on monospaced.com, with headings, a table and lists set in monospaced type on near-black.",
                        fit: "fluid",
                        height: 960,
                        src: "https://res.cloudinary.com/monospaced/image/upload/f_auto,q_auto/v1790972463/Mobile_2.jpg",
                        width: 1280,
                      }),
                      renderSetImage({
                        alt: "A phone showing the Screen web app with a cyan halftone photograph of cumulonimbus cloud in its loading state.",
                        fit: "fluid",
                        height: 960,
                        src: "https://res.cloudinary.com/monospaced/image/upload/f_auto,q_auto/v1790891940/Mobile_3.jpg",
                        width: 1280,
                      }),
                      renderSetImage({
                        alt: "The same phone and web app with the cloud photograph fully loaded.",
                        fit: "fluid",
                        height: 960,
                        src: "https://res.cloudinary.com/monospaced/image/upload/f_auto,q_auto/v1790972439/Mobile_4.jpg",
                        width: 1280,
                      }),
                    ].join("")}</div>`,
                  }),
                  renderSetFigure({
                    caption: "Stickers",
                    children: renderSetImage({
                      alt: "The same phone and web app with the cloud photograph fully loaded.",
                      height: 960,
                      src: "https://res.cloudinary.com/monospaced/image/upload/f_auto,q_auto/v1787168681/Stickers_j0kqx8.jpg",
                      width: 1280,
                    }),
                  }),
                  renderSetFigure({
                    caption: "Posters",
                    children: renderSetImage({
                      alt: "Two stylised posters representing aspects of the Monospaced visual brand identity hanging in wooden frames on a dark cyan wall",
                      height: 960,
                      src: "https://res.cloudinary.com/monospaced/image/upload/f_auto,q_auto/v1787691081/Posters_whvojg.jpg",
                      width: 1280,
                    }),
                  }),
                ].join(""),
              })}</div>`,
            }),
          ].join(""),
        }),
      }),
    });
  }
}
