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
                    text: brand.title,
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
                      src: "https://res.cloudinary.com/monospaced/image/upload/f_auto,q_auto/v1787217367/Logo_hxhjg8.png",
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
                      alt: "Type specimen of Berkeley Mono TX-02 on near-black, showing 'Hamburgefonstiv' and the digits zero to nine",
                      height: 548,
                      src: "https://res.cloudinary.com/monospaced/image/upload/f_auto,q_auto/v1787217223/Typeface_whbldp.png",
                      width: 1280,
                    }),
                  }),
                  renderSetFigure({
                    caption: "Prose typography",
                    children: renderSetImage({
                      alt: "A sample sentence set in light monospaced type on near-black: 'Execute gzip benchmarks to analyse quick dev proxy flaws before building json.'",
                      height: 548,
                      src: "https://res.cloudinary.com/monospaced/image/upload/f_auto,q_auto/v1787217221/Prose_typography_kfovbp.png",
                      width: 1280,
                    }),
                  }),
                  renderSetFigure({
                    caption: "Technical typography",
                    children: renderSetImage({
                      alt: "A code sample distinguishing easily confused glyphs — capital O, zero, capital I, one, and lowercase l — with arrow and comparison ligatures",
                      height: 548,
                      src: "https://res.cloudinary.com/monospaced/image/upload/f_auto,q_auto/v1787217219/Technical_typography_xneubs.png",
                      width: 1280,
                    }),
                  }),
                  renderSetFigure({
                    caption: "Brand cyan",
                    children: renderSetImage({
                      alt: "The twelve-step cyan ramp as vertical columns, running from near-white through saturated mid teal to near-black",
                      height: 548,
                      src: "https://res.cloudinary.com/monospaced/image/upload/f_auto,q_auto/v1787139664/Brand_cyan_fs41ig.png",
                      width: 1280,
                    }),
                  }),
                  renderSetFigure({
                    caption: "Cyan dark pairing",
                    children: renderSetImage({
                      alt: "The logo in near-black on a mid-tone cyan field",
                      height: 548,
                      src: "https://res.cloudinary.com/monospaced/image/upload/f_auto,q_auto/v1787140504/Cyan_dark_pairing_zu9aas.png",
                      width: 1280,
                    }),
                  }),

                  renderSetFigure({
                    caption: "Cyan logos",
                    children: renderSetImage({
                      alt: "Four logo colorways in quadrants: deep teal on pale cyan, near-black on mid cyan, white on brand cyan, and light cyan on near-black",
                      height: 548,
                      src: "https://res.cloudinary.com/monospaced/image/upload/f_auto,q_auto/v1787181319/Cyan_logos_j1rmcd.png",
                      width: 1280,
                    }),
                  }),
                  renderSetFigure({
                    caption: "Cyan logomarks",
                    children: renderSetImage({
                      alt: "The logomark repeated across four side-by-side panels, each pairing a different tone from the cyan ramp with its background",
                      height: 548,
                      src: "https://res.cloudinary.com/monospaced/image/upload/f_auto,q_auto/v1787181317/Cyan_logomarks_mqi9kn.png",
                      width: 1280,
                    }),
                  }),
                  renderSetFigure({
                    caption: "Imagery",
                    children: renderSetStack({
                      gap: "xs",
                      children: [
                        renderSetImage({
                          alt: "The black logo over a cyan halftone photograph of high-rise building facades",
                          height: 548,
                          src: "https://res.cloudinary.com/monospaced/image/upload/v1787141323/Imagery_1_gcl4ql.png",
                          width: 1280,
                        }),
                        renderSetImage({
                          alt: "The black logo over a cyan halftone photograph of bare tree branches",
                          height: 548,
                          src: "https://res.cloudinary.com/monospaced/image/upload/v1787141921/Imagery_2_ggtkwb.png",
                          width: 1280,
                        }),
                        renderSetImage({
                          alt: "The black logo over a cyan halftone pattern resembling a circuit board",
                          height: 548,
                          src: "https://res.cloudinary.com/monospaced/image/upload/v1787141961/Imagery_3_r1a8yb.png",
                          width: 1280,
                        }),
                        renderSetImage({
                          alt: "The black logo over a cyan halftone pattern of ornate coffered tiles",
                          height: 548,
                          src: "https://res.cloudinary.com/monospaced/image/upload/v1787141898/Imagery_4_x8tnlw.png",
                          width: 1280,
                        }),
                      ].join(""),
                    }),
                  }),
                  renderSetFigure({
                    caption: "Supporting color",
                    children: renderSetImage({
                      alt: "A grid of twelve-step ramps for the supporting hues, one hue per row, each running light to dark",
                      height: 548,
                      src: "https://res.cloudinary.com/monospaced/image/upload/f_auto,q_auto/v1787140729/Supporting_color_ywemac.png",
                      width: 1280,
                    }),
                  }),
                  renderSetFigure({
                    caption: "Testcard",
                    children: renderSetImage({
                      alt: "A television test card titled Monospaced: a checkerboard surround framing a circular face with color bars, frequency gratings, and grayscale steps",
                      height: 1920,
                      src: "https://res.cloudinary.com/monospaced/image/upload/f_auto,q_auto/v1787180690/Testcard_eexyx0.png",
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
                    caption: "Alternative imagery",
                    children: renderSetImage({
                      alt: "The halftone tile treatment in four alternative hues — cyan, magenta, olive, and gray quadrants — each carrying the black logo",
                      height: 548,
                      src: "https://res.cloudinary.com/monospaced/image/upload/v1787180818/Alternative_imagery_o9hzdw.png",
                      width: 1280,
                    }),
                  }),
                  renderSetFigure({
                    caption: "Stickers",
                    children: renderSetImage({
                      height: 960,
                      src: "https://res.cloudinary.com/monospaced/image/upload/f_auto,q_auto/v1787168681/Stickers_j0kqx8.jpg",
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
