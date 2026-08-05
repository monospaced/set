import { describe, expect, it } from "vitest";

import { describeSpecConsistency } from "../../test/spec";
import { renderSetImage, SET_IMAGE_SPEC, type SetImageProps } from "./image";

function mountImage(html: string): HTMLElement {
  document.body.innerHTML = `<div class="set">${html}</div>`;
  return document.body.querySelector(".set") as HTMLElement;
}

function getWrapper(root: HTMLElement): HTMLElement {
  const wrapper = root.querySelector(".set-image");
  expect(wrapper).toBeTruthy();
  return wrapper as HTMLElement;
}

function getImg(root: HTMLElement): HTMLImageElement {
  const img = root.querySelector("img");
  expect(img).toBeTruthy();
  return img as HTMLImageElement;
}

describe("renderSetImage", () => {
  it("renders div.image and img with required src and default alt", () => {
    const root = mountImage(renderSetImage({ src: "/image.jpg" }));
    const wrapper = getWrapper(root);
    const img = getImg(root);

    expect(wrapper.classList.contains("set-image")).toBe(true);
    expect(img.getAttribute("src")).toBe("/image.jpg");
    expect(img.getAttribute("alt")).toBe("");
  });

  it("throws when src is empty after trimming", () => {
    expect(() => renderSetImage({ src: "   " })).toThrow(
      "src must be a non-empty string.",
    );
  });

  it("emits image-level variant attributes only when enabled", () => {
    const enabledRoot = mountImage(
      renderSetImage({
        fit: "cover",
        gravity: "W",
        radius: true,
        shadow: true,
        src: "/image.jpg",
      }),
    );
    const enabledWrapper = getWrapper(enabledRoot);

    expect(enabledWrapper.getAttribute("data-object-fit")).toBe("cover");
    expect(enabledWrapper.getAttribute("data-gravity")).toBe("W");
    expect(enabledWrapper.hasAttribute("data-radius")).toBe(true);
    expect(enabledWrapper.hasAttribute("data-shadow")).toBe(true);

    const defaultRoot = mountImage(renderSetImage({ src: "/image.jpg" }));
    const defaultWrapper = getWrapper(defaultRoot);

    expect(defaultWrapper.hasAttribute("data-object-fit")).toBe(false);
    expect(defaultWrapper.hasAttribute("data-gravity")).toBe(false);
    expect(defaultWrapper.hasAttribute("data-radius")).toBe(false);
    expect(defaultWrapper.hasAttribute("data-shadow")).toBe(false);
  });

  it("emits aspect ratio only when fit is cover and height is not set", () => {
    const coverWithAspectRatio = mountImage(
      renderSetImage({
        aspectRatio: "16:9",
        fit: "cover",
        src: "/image.jpg",
      }),
    );
    expect(
      getWrapper(coverWithAspectRatio).getAttribute("data-aspect-ratio"),
    ).toBe("16:9");

    const coverWithWidth = mountImage(
      renderSetImage({
        aspectRatio: "16:9",
        fit: "cover",
        src: "/image.jpg",
        width: 300,
      }),
    );
    expect(getWrapper(coverWithWidth).getAttribute("data-aspect-ratio")).toBe(
      "16:9",
    );

    const coverWithHeight = mountImage(
      renderSetImage({
        aspectRatio: "16:9",
        fit: "cover",
        height: 200,
        src: "/image.jpg",
      }),
    );
    expect(getWrapper(coverWithHeight).hasAttribute("data-aspect-ratio")).toBe(
      false,
    );

    const noCover = mountImage(
      renderSetImage({
        aspectRatio: "16:9",
        src: "/image.jpg",
      }),
    );
    expect(getWrapper(noCover).hasAttribute("data-aspect-ratio")).toBe(false);
  });

  it("writes wrapper size vars when width and/or height are provided", () => {
    const root = mountImage(
      renderSetImage({
        height: 200,
        src: "/image.jpg",
        width: 300,
      }),
    );
    const wrapper = getWrapper(root);

    expect(wrapper.getAttribute("style")).toContain(
      "--set-image-block-size: 12.5rem",
    );
    expect(wrapper.getAttribute("style")).toContain(
      "--set-image-inline-size: 18.75rem",
    );
  });

  it("emits img width/height only when fit is not cover", () => {
    const coverRoot = mountImage(
      renderSetImage({
        fit: "cover",
        height: 200,
        src: "/image.jpg",
        width: 300,
      }),
    );
    const coverImg = getImg(coverRoot);
    expect(coverImg.hasAttribute("height")).toBe(false);
    expect(coverImg.hasAttribute("width")).toBe(false);

    const noCoverRoot = mountImage(
      renderSetImage({
        height: 200,
        src: "/image.jpg",
        width: 300,
      }),
    );
    const noCoverImg = getImg(noCoverRoot);
    expect(noCoverImg.getAttribute("height")).toBe("200");
    expect(noCoverImg.getAttribute("width")).toBe("300");
  });

  it("trims and emits srcSet and sizes on img when sources are omitted", () => {
    const root = mountImage(
      renderSetImage({
        sizes: " 100vw ",
        src: "/fallback.jpg",
        srcSet: " /image-640.jpg 640w, /image-1280.jpg 1280w ",
      }),
    );
    const img = getImg(root);

    expect(img.getAttribute("srcset")).toBe(
      "/image-640.jpg 640w, /image-1280.jpg 1280w",
    );
    expect(img.getAttribute("sizes")).toBe("100vw");
  });

  it("omits img sizes and emits picture/source when sources are provided", () => {
    const root = mountImage(
      renderSetImage({
        sizes: "100vw",
        sources: [
          {
            height: 720,
            media: " (min-width: 60em) ",
            sizes: " 60vw ",
            srcSet: " /lg.jpg 1200w ",
            type: " image/avif ",
            width: 1200,
          },
          { srcSet: "/sm.jpg 600w" },
        ],
        src: "/fallback.jpg",
      }),
    );
    const picture = root.querySelector("picture");
    const source = root.querySelector("source");
    const img = getImg(root);

    expect(picture).toBeTruthy();
    expect(source).toBeTruthy();
    expect(source?.getAttribute("srcset")).toBe("/lg.jpg 1200w");
    expect(source?.getAttribute("media")).toBe("(min-width: 60em)");
    expect(source?.getAttribute("sizes")).toBe("60vw");
    expect(source?.getAttribute("type")).toBe("image/avif");
    expect(source?.getAttribute("width")).toBe("1200");
    expect(source?.getAttribute("height")).toBe("720");
    expect(img.hasAttribute("sizes")).toBe(false);
  });

  it("throws when a source srcSet is empty after trimming", () => {
    expect(() =>
      renderSetImage({
        sources: [{ srcSet: "   " }],
        src: "/fallback.jpg",
      }),
    ).toThrow("sources[0].srcSet must be non-empty.");
  });

  it("emits loading=lazy only when lazy is true and priority is false", () => {
    const lazyRoot = mountImage(
      renderSetImage({
        lazy: true,
        src: "/image.jpg",
      }),
    );
    expect(getImg(lazyRoot).getAttribute("loading")).toBe("lazy");

    const eagerRoot = mountImage(renderSetImage({ src: "/image.jpg" }));
    expect(getImg(eagerRoot).hasAttribute("loading")).toBe(false);

    const priorityRoot = mountImage(
      renderSetImage({
        lazy: true,
        priority: true,
        src: "/image.jpg",
      }),
    );
    expect(getImg(priorityRoot).hasAttribute("loading")).toBe(false);
  });

  it("emits data-fluid only when fit is fluid", () => {
    const fluidRoot = mountImage(
      renderSetImage({
        fit: "fluid",
        src: "/image.jpg",
      }),
    );
    expect(getWrapper(fluidRoot).hasAttribute("data-fluid")).toBe(true);

    const coverRoot = mountImage(
      renderSetImage({
        fit: "cover",
        src: "/image.jpg",
      }),
    );
    expect(getWrapper(coverRoot).hasAttribute("data-fluid")).toBe(false);

    const defaultRoot = mountImage(renderSetImage({ src: "/image.jpg" }));
    expect(getWrapper(defaultRoot).hasAttribute("data-fluid")).toBe(false);
  });

  it("emits fetchpriority=high only when priority is true", () => {
    const priorityRoot = mountImage(
      renderSetImage({
        priority: true,
        src: "/image.jpg",
      }),
    );
    expect(getImg(priorityRoot).getAttribute("fetchpriority")).toBe("high");

    const defaultRoot = mountImage(renderSetImage({ src: "/image.jpg" }));
    expect(getImg(defaultRoot).hasAttribute("fetchpriority")).toBe(false);
  });

  it("renders consumer-provided id on the host", () => {
    const root = mountImage(
      renderSetImage({ id: "my-image", src: "/image.jpg" }),
    );
    const image = root.querySelector(".set-image") as HTMLElement;

    expect(image.id).toBe("my-image");
  });

  it("omits id when not provided", () => {
    const root = mountImage(renderSetImage({ src: "/image.jpg" }));
    const image = root.querySelector(".set-image") as HTMLElement;

    expect(image.hasAttribute("id")).toBe(false);
  });

  it("throws on a syntactically invalid id", () => {
    expect(() =>
      renderSetImage({ id: "not valid", src: "/image.jpg" }),
    ).toThrow();
  });
});

describeSpecConsistency<SetImageProps>({
  baseProps: { src: "/img.jpg" },
  renderer: renderSetImage,
  spec: SET_IMAGE_SPEC,
});
