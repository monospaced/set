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
                      height: 548,
                      src: "https://res.cloudinary.com/monospaced/image/upload/f_auto,q_auto/v1787217526/Emblem_myotyd.png",
                      width: 1280,
                    }),
                  }),
                  renderSetFigure({
                    caption: "Typeface",
                    children: renderSetImage({
                      height: 548,
                      src: "https://res.cloudinary.com/monospaced/image/upload/f_auto,q_auto/v1787217223/Typeface_whbldp.png",
                      width: 1280,
                    }),
                  }),
                  renderSetFigure({
                    caption: "Prose typography",
                    children: renderSetImage({
                      height: 548,
                      src: "https://res.cloudinary.com/monospaced/image/upload/f_auto,q_auto/v1787217221/Prose_typography_kfovbp.png",
                      width: 1280,
                    }),
                  }),
                  renderSetFigure({
                    caption: "Technical typography",
                    children: renderSetImage({
                      height: 548,
                      src: "https://res.cloudinary.com/monospaced/image/upload/f_auto,q_auto/v1787217219/Technical_typography_xneubs.png",
                      width: 1280,
                    }),
                  }),
                  renderSetFigure({
                    caption: "Brand cyan",
                    children: renderSetImage({
                      height: 548,
                      src: "https://res.cloudinary.com/monospaced/image/upload/f_auto,q_auto/v1787139664/Brand_cyan_fs41ig.png",
                      width: 1280,
                    }),
                  }),
                  renderSetFigure({
                    caption: "Cyan dark pairing",
                    children: renderSetImage({
                      height: 548,
                      src: "https://res.cloudinary.com/monospaced/image/upload/f_auto,q_auto/v1787140504/Cyan_dark_pairing_zu9aas.png",
                      width: 1280,
                    }),
                  }),

                  renderSetFigure({
                    caption: "Cyan logos",
                    children: renderSetImage({
                      height: 548,
                      src: "https://res.cloudinary.com/monospaced/image/upload/f_auto,q_auto/v1787181319/Cyan_logos_j1rmcd.png",
                      width: 1280,
                    }),
                  }),
                  renderSetFigure({
                    caption: "Cyan logomarks",
                    children: renderSetImage({
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
                          height: 548,
                          src: "https://res.cloudinary.com/monospaced/image/upload/v1787141323/Imagery_1_gcl4ql.png",
                          width: 1280,
                        }),
                        renderSetImage({
                          height: 548,
                          src: "https://res.cloudinary.com/monospaced/image/upload/v1787141921/Imagery_2_ggtkwb.png",
                          width: 1280,
                        }),
                        renderSetImage({
                          height: 548,
                          src: "https://res.cloudinary.com/monospaced/image/upload/v1787141961/Imagery_3_r1a8yb.png",
                          width: 1280,
                        }),
                        renderSetImage({
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
                      height: 548,
                      src: "https://res.cloudinary.com/monospaced/image/upload/f_auto,q_auto/v1787140729/Supporting_color_ywemac.png",
                      width: 1280,
                    }),
                  }),
                  renderSetFigure({
                    caption: "Testcard",
                    children: renderSetImage({
                      height: 1920,
                      src: "https://res.cloudinary.com/monospaced/image/upload/f_auto,q_auto/v1787180690/Testcard_eexyx0.png",
                      width: 1280,
                    }),
                  }),
                  renderSetFigure({
                    caption: "Syntax highlighting",
                    children: renderSetImage({
                      height: 548,
                      src: "https://res.cloudinary.com/monospaced/image/upload/f_auto,q_auto/v1787180062/Syntax_highlighting_hvktmk.png",
                      width: 1280,
                    }),
                  }),
                  renderSetFigure({
                    caption: "Alternative imagery",
                    children: renderSetImage({
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
