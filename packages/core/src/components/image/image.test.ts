import { describe, expect, it } from "vitest";

import { describeSpecConsistency } from "../../test/spec";
import {
  defineSetImage,
  renderSetImage,
  SET_IMAGE_SPEC,
  SET_IMAGE_TAG_NAME,
  type SetImageProps,
} from "./image";

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
  it("renders a set-image host and img with required src and default alt", () => {
    const root = mountImage(renderSetImage({ src: "/image.jpg" }));
    const wrapper = getWrapper(root);
    const img = getImg(root);

    expect(wrapper.tagName.toLowerCase()).toBe(SET_IMAGE_TAG_NAME);
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

  it("emits data-gravity only when fit is cover and gravity is not C", () => {
    const coverGravity = mountImage(
      renderSetImage({ fit: "cover", gravity: "SE", src: "/image.jpg" }),
    );
    expect(getWrapper(coverGravity).getAttribute("data-gravity")).toBe("SE");

    const coverCentre = mountImage(
      renderSetImage({ fit: "cover", gravity: "C", src: "/image.jpg" }),
    );
    expect(getWrapper(coverCentre).hasAttribute("data-gravity")).toBe(false);

    const noCover = mountImage(
      renderSetImage({ gravity: "SE", src: "/image.jpg" }),
    );
    expect(getWrapper(noCover).hasAttribute("data-gravity")).toBe(false);
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

  it("renders paired scheme variants with fragments when adaptive", () => {
    const root = mountImage(
      renderSetImage({ adaptive: true, src: "/image.svg" }),
    );
    const wrapper = getWrapper(root);
    const imgs = wrapper.querySelectorAll("img");

    expect(wrapper.hasAttribute("data-adaptive")).toBe(true);
    expect(imgs).toHaveLength(2);
    expect(imgs[0]?.getAttribute("data-scheme")).toBe("light");
    expect(imgs[0]?.getAttribute("src")).toBe("/image.svg#light");
    expect(imgs[1]?.getAttribute("data-scheme")).toBe("dark");
    expect(imgs[1]?.getAttribute("src")).toBe("/image.svg#dark");
  });

  it("appends scheme fragments to every srcset candidate when adaptive", () => {
    const root = mountImage(
      renderSetImage({
        adaptive: true,
        src: "/image.svg",
        srcSet: "/image.svg 1280w, /image-wide.svg 1920w",
      }),
    );
    const imgs = root.querySelectorAll("img");

    expect(imgs[0]?.getAttribute("srcset")).toBe(
      "/image.svg#light 1280w, /image-wide.svg#light 1920w",
    );
    expect(imgs[1]?.getAttribute("srcset")).toBe(
      "/image.svg#dark 1280w, /image-wide.svg#dark 1920w",
    );
  });

  it("marks the picture, not the img, with data-scheme when adaptive has sources", () => {
    const root = mountImage(
      renderSetImage({
        adaptive: true,
        sources: [{ media: "(min-width: 64rem)", srcSet: "/image-wide.svg" }],
        src: "/image.svg",
      }),
    );
    const pictures = root.querySelectorAll("picture");

    expect(pictures).toHaveLength(2);
    expect(pictures[0]?.getAttribute("data-scheme")).toBe("light");
    expect(pictures[0]?.querySelector("source")?.getAttribute("srcset")).toBe(
      "/image-wide.svg#light",
    );
    expect(pictures[0]?.querySelector("img")?.hasAttribute("data-scheme")).toBe(
      false,
    );
    expect(pictures[1]?.getAttribute("data-scheme")).toBe("dark");
  });

  it("throws when adaptive sources contain URL fragments", () => {
    expect(() =>
      renderSetImage({ adaptive: true, src: "/image.svg#light" }),
    ).toThrow("adaptive sources must not contain URL fragments.");
  });

  it("preserves commas embedded in adaptive srcset candidate URLs", () => {
    const root = mountImage(
      renderSetImage({
        adaptive: true,
        src: "/image.svg",
        srcSet: "https://cdn.example/upload/w_640,c_fill/image.svg 640w",
      }),
    );

    expect(root.querySelectorAll("img")[0]?.getAttribute("srcset")).toBe(
      "https://cdn.example/upload/w_640,c_fill/image.svg#light 640w",
    );
  });

  it("throws on adaptive srcset candidates separated by comma without whitespace", () => {
    expect(() =>
      renderSetImage({
        adaptive: true,
        src: "/image.svg",
        srcSet: "/image.svg 1x,/image-2x.svg 2x",
      }),
    ).toThrow(
      "adaptive srcSet candidates must be a URL plus at most one descriptor, separated by a comma and whitespace.",
    );
  });

  it("renders a single unmarked image when adaptive is not set", () => {
    const root = mountImage(renderSetImage({ src: "/image.svg" }));

    expect(root.querySelectorAll("img")).toHaveLength(1);
    expect(getWrapper(root).hasAttribute("data-adaptive")).toBe(false);
    expect(getImg(root).hasAttribute("data-scheme")).toBe(false);
  });

  it("renders paired scheme pictures with a reduced-motion still when adaptive animated", () => {
    const root = mountImage(
      renderSetImage({
        adaptive: true,
        animated: true,
        src: "https://cdn/example--cyan--scan--3x2--{scheme}.webp",
        still: "https://cdn/example--cyan--3x2--adaptive.svg",
      }),
    );
    const wrapper = getWrapper(root);
    const pictures = root.querySelectorAll("picture");

    expect(wrapper.hasAttribute("data-animated")).toBe(true);
    expect(pictures).toHaveLength(2);
    expect(pictures[0]?.getAttribute("data-scheme")).toBe("light");
    expect(pictures[1]?.getAttribute("data-scheme")).toBe("dark");

    const lightStill = pictures[0]?.querySelector("source");
    expect(lightStill?.getAttribute("media")).toBe(
      "(prefers-reduced-motion: reduce)",
    );
    expect(lightStill?.getAttribute("srcset")).toBe(
      "https://cdn/example--cyan--3x2--adaptive.svg#light",
    );

    expect(pictures[0]?.querySelector("img")?.getAttribute("src")).toBe(
      "https://cdn/example--cyan--scan--3x2--light.webp",
    );
    expect(pictures[1]?.querySelector("img")?.getAttribute("src")).toBe(
      "https://cdn/example--cyan--scan--3x2--dark.webp",
    );
    expect(pictures[1]?.querySelector("source")?.getAttribute("srcset")).toBe(
      "https://cdn/example--cyan--3x2--adaptive.svg#dark",
    );
  });

  it("substitutes {scheme} across every animated srcset candidate", () => {
    const root = mountImage(
      renderSetImage({
        adaptive: true,
        animated: true,
        src: "https://cdn/base--{scheme}.webp",
        srcSet:
          "https://cdn/sm--{scheme}.webp 640w, https://cdn/lg--{scheme}.webp 1280w",
        still: "https://cdn/adaptive.svg",
      }),
    );
    const imgs = root.querySelectorAll("img");

    expect(imgs[0]?.getAttribute("srcset")).toBe(
      "https://cdn/sm--light.webp 640w, https://cdn/lg--light.webp 1280w",
    );
    expect(imgs[1]?.getAttribute("srcset")).toBe(
      "https://cdn/sm--dark.webp 640w, https://cdn/lg--dark.webp 1280w",
    );
  });

  it("art-directs animated motion and gates reduced-motion stills per source", () => {
    const root = mountImage(
      renderSetImage({
        adaptive: true,
        animated: true,
        src: "https://cdn/example--cyan--scan--3x2--{scheme}.webp",
        still: "https://cdn/example--cyan--3x2--adaptive.svg",
        sources: [
          {
            height: 720,
            media: "(min-width: 64em)",
            srcSet: "https://cdn/example--cyan--scan--16x9--{scheme}.webp",
            still: "https://cdn/example--cyan--16x9--adaptive.svg",
            width: 1280,
          },
        ],
      }),
    );
    const light = root.querySelectorAll("picture")[0];
    const sources = light?.querySelectorAll("source");

    // Order: art-directed reduced-motion still, default reduced-motion still,
    // then the motion source.
    expect(sources?.[0]?.getAttribute("media")).toBe(
      "(prefers-reduced-motion: reduce) and (min-width: 64em)",
    );
    expect(sources?.[0]?.getAttribute("srcset")).toBe(
      "https://cdn/example--cyan--16x9--adaptive.svg#light",
    );
    expect(sources?.[1]?.getAttribute("media")).toBe(
      "(prefers-reduced-motion: reduce)",
    );
    expect(sources?.[1]?.getAttribute("srcset")).toBe(
      "https://cdn/example--cyan--3x2--adaptive.svg#light",
    );
    expect(sources?.[2]?.getAttribute("media")).toBe("(min-width: 64em)");
    expect(sources?.[2]?.getAttribute("srcset")).toBe(
      "https://cdn/example--cyan--scan--16x9--light.webp",
    );
  });

  it("throws when a {scheme} placeholder is used without adaptive", () => {
    expect(() =>
      renderSetImage({
        animated: true,
        src: "https://cdn/base--{scheme}.webp",
        still: "https://cdn/adaptive.svg",
      }),
    ).toThrow(
      "the {scheme} placeholder requires adaptive to enable light/dark.",
    );
  });

  it("renders a single unpaired animated picture when no {scheme} token is used", () => {
    const root = mountImage(
      renderSetImage({
        animated: true,
        src: "https://cdn/animation.webp",
        still: "https://cdn/still.png",
      }),
    );
    const wrapper = getWrapper(root);
    const pictures = root.querySelectorAll("picture");

    expect(wrapper.hasAttribute("data-animated")).toBe(true);
    expect(pictures).toHaveLength(1);
    expect(pictures[0]?.hasAttribute("data-scheme")).toBe(false);

    const still = pictures[0]?.querySelector("source");
    expect(still?.getAttribute("media")).toBe(
      "(prefers-reduced-motion: reduce)",
    );
    // No scheme pairing, so the still is used verbatim (no #fragment appended).
    expect(still?.getAttribute("srcset")).toBe("https://cdn/still.png");
    expect(pictures[0]?.querySelector("img")?.getAttribute("src")).toBe(
      "https://cdn/animation.webp",
    );
  });

  it("throws when adaptive animated sources omit the {scheme} placeholder", () => {
    expect(() =>
      renderSetImage({
        adaptive: true,
        animated: true,
        src: "https://cdn/base--{scheme}.webp",
        sources: [{ srcSet: "https://cdn/wide.webp" }],
        still: "https://cdn/adaptive.svg",
      }),
    ).toThrow("adaptive animated sources must contain a {scheme} placeholder.");
  });

  it("throws when animated is set without a still", () => {
    expect(() =>
      renderSetImage({
        animated: true,
        src: "https://cdn/animation.webp",
      }),
    ).toThrow("animated requires a still.");
  });

  it("throws when an animated still contains a URL fragment", () => {
    expect(() =>
      renderSetImage({
        animated: true,
        src: "https://cdn/animation.webp",
        still: "https://cdn/still.svg#light",
      }),
    ).toThrow("animated still must not contain URL fragments.");
  });

  it("stacks a base picture and a lead overlay when sequenced", () => {
    const root = mountImage(
      renderSetImage({
        animated: true,
        leadSrc: "https://cdn/load-scan.webp",
        src: "https://cdn/scan.webp",
        still: "https://cdn/still.svg",
      }),
    );
    const wrapper = getWrapper(root);
    const pictures = root.querySelectorAll("picture");

    expect(wrapper.hasAttribute("data-sequenced")).toBe(true);
    expect(pictures).toHaveLength(2);

    // Base picture: reduced-motion still ahead of the src motion, no data-layer.
    expect(pictures[0]?.hasAttribute("data-layer")).toBe(false);
    expect(pictures[0]?.querySelector("source")?.getAttribute("media")).toBe(
      "(prefers-reduced-motion: reduce)",
    );
    expect(pictures[0]?.querySelector("img")?.getAttribute("src")).toBe(
      "https://cdn/scan.webp",
    );

    // Lead overlay: leadSrc gated to no-preference, still as decorative fallback.
    expect(pictures[1]?.getAttribute("data-layer")).toBe("lead");
    const leadSource = pictures[1]?.querySelector("source");
    expect(leadSource?.getAttribute("media")).toBe(
      "(prefers-reduced-motion: no-preference)",
    );
    expect(leadSource?.getAttribute("srcset")).toBe(
      "https://cdn/load-scan.webp",
    );
    const leadImg = pictures[1]?.querySelector("img");
    expect(leadImg?.getAttribute("src")).toBe("https://cdn/still.svg");
    expect(leadImg?.getAttribute("alt")).toBe("");
  });

  it("does not mark data-sequenced for animated without leadSrc", () => {
    const root = mountImage(
      renderSetImage({
        animated: true,
        src: "https://cdn/animation.webp",
        still: "https://cdn/still.svg",
      }),
    );
    expect(getWrapper(root).hasAttribute("data-sequenced")).toBe(false);
  });

  it("sequences a scheme-paired set when adaptive", () => {
    const root = mountImage(
      renderSetImage({
        adaptive: true,
        animated: true,
        leadSrc: "https://cdn/load-scan--{scheme}.webp",
        src: "https://cdn/scan--{scheme}.webp",
        still: "https://cdn/adaptive.svg",
      }),
    );
    const pictures = root.querySelectorAll("picture");

    // light base, light lead, dark base, dark lead
    expect(pictures).toHaveLength(4);
    expect(pictures[0]?.getAttribute("data-scheme")).toBe("light");
    expect(pictures[0]?.hasAttribute("data-layer")).toBe(false);
    expect(pictures[0]?.querySelector("img")?.getAttribute("src")).toBe(
      "https://cdn/scan--light.webp",
    );
    expect(pictures[1]?.getAttribute("data-layer")).toBe("lead");
    expect(pictures[1]?.querySelector("source")?.getAttribute("srcset")).toBe(
      "https://cdn/load-scan--light.webp",
    );
    expect(pictures[1]?.querySelector("img")?.getAttribute("src")).toBe(
      "https://cdn/adaptive.svg#light",
    );
    expect(pictures[3]?.getAttribute("data-scheme")).toBe("dark");
    expect(pictures[3]?.getAttribute("data-layer")).toBe("lead");
  });

  it("art-directs the base and lead from per-source srcSet and leadSrc", () => {
    const root = mountImage(
      renderSetImage({
        animated: true,
        leadSrc: "https://cdn/load-scan--3x2.webp",
        src: "https://cdn/scan--3x2.webp",
        sources: [
          {
            media: "(min-width: 64em)",
            srcSet: "https://cdn/scan--16x9.webp",
            leadSrc: "https://cdn/load-scan--16x9.webp",
            still: "https://cdn/16x9--adaptive.svg",
          },
        ],
        still: "https://cdn/3x2--adaptive.svg",
      }),
    );
    const base = root.querySelector("picture:not([data-layer])");
    const baseMotion = base?.querySelectorAll('source:not([media*="reduce"])');
    expect(baseMotion?.[0]?.getAttribute("srcset")).toBe(
      "https://cdn/scan--16x9.webp",
    );

    const lead = root.querySelector('picture[data-layer="lead"]');
    expect(lead?.querySelector("source")?.getAttribute("srcset")).toBe(
      "https://cdn/load-scan--16x9.webp",
    );
  });

  it("throws when leadSrc is set without animated", () => {
    expect(() =>
      renderSetImage({
        leadSrc: "https://cdn/load-scan.webp",
        src: "https://cdn/scan.webp",
      }),
    ).toThrow("leadSrc requires animated.");
  });

  it("art-directs a non-adaptive animated image", () => {
    const root = mountImage(
      renderSetImage({
        animated: true,
        src: "https://cdn/base.webp",
        sources: [
          {
            media: "(min-width: 64em)",
            srcSet: "https://cdn/wide.webp",
            still: "https://cdn/wide-still.svg",
          },
        ],
        still: "https://cdn/still.svg",
      }),
    );
    const pictures = root.querySelectorAll("picture");
    expect(pictures).toHaveLength(1);
    expect(pictures[0]?.hasAttribute("data-scheme")).toBe(false);

    // art-directed still, default still, then the motion source — no #fragments
    // appended since it is unpaired.
    const sources = pictures[0]?.querySelectorAll("source");
    expect(sources?.[0]?.getAttribute("media")).toBe(
      "(prefers-reduced-motion: reduce) and (min-width: 64em)",
    );
    expect(sources?.[0]?.getAttribute("srcset")).toBe(
      "https://cdn/wide-still.svg",
    );
    expect(sources?.[1]?.getAttribute("media")).toBe(
      "(prefers-reduced-motion: reduce)",
    );
    expect(sources?.[2]?.getAttribute("media")).toBe("(min-width: 64em)");
    expect(sources?.[2]?.getAttribute("srcset")).toBe("https://cdn/wide.webp");
  });

  it("falls back to the default still and lead when a source omits them", () => {
    const root = mountImage(
      renderSetImage({
        animated: true,
        leadSrc: "https://cdn/lead.webp",
        src: "https://cdn/base.webp",
        sources: [
          { media: "(min-width: 64em)", srcSet: "https://cdn/wide.webp" },
        ],
        still: "https://cdn/still.svg",
      }),
    );

    // Source has no still → no art-directed reduced-motion still, just the default.
    const base = root.querySelector("picture:not([data-layer])");
    const baseStills = base?.querySelectorAll('source[media*="reduce"]');
    expect(baseStills).toHaveLength(1);
    expect(baseStills?.[0]?.getAttribute("media")).toBe(
      "(prefers-reduced-motion: reduce)",
    );

    // Source has no leadSrc → no art-directed lead source, just the default.
    const lead = root.querySelector('picture[data-layer="lead"]');
    const leadSources = lead?.querySelectorAll("source");
    expect(leadSources).toHaveLength(1);
    expect(leadSources?.[0]?.getAttribute("srcset")).toBe(
      "https://cdn/lead.webp",
    );
  });

  it("throws when a per-source animated still contains a URL fragment", () => {
    expect(() =>
      renderSetImage({
        animated: true,
        src: "https://cdn/animation.webp",
        sources: [
          {
            srcSet: "https://cdn/wide.webp",
            still: "https://cdn/wide-still.svg#light",
          },
        ],
        still: "https://cdn/still.svg",
      }),
    ).toThrow("animated still must not contain URL fragments.");
  });
});

describe("defineSetImage", () => {
  it("registers the custom element and tolerates repeat definition", () => {
    defineSetImage();
    expect(customElements.get(SET_IMAGE_TAG_NAME)).toBeTruthy();
    expect(() => defineSetImage()).not.toThrow();
  });

  it("anchors every scheme's lead overlay to its own load", () => {
    defineSetImage();

    // Parse detached so the overlays' frames aren't ready when they connect.
    const host = document.createElement("div");
    host.className = "set";
    host.innerHTML = renderSetImage({
      adaptive: true,
      animated: true,
      leadSrc: "https://cdn/load-scan--{scheme}.webp",
      src: "https://cdn/scan--{scheme}.webp",
      still: "https://cdn/adaptive.svg",
    });
    const leads = host.querySelectorAll<HTMLElement>('[data-layer="lead"]');
    const leadA = leads[0];
    const leadB = leads[1];
    const imgA = leadA?.querySelector("img");
    const imgB = leadB?.querySelector("img");
    if (!leadA || !leadB || !imgA || !imgB) {
      throw new Error("expected a light and a dark lead overlay");
    }
    Object.defineProperty(imgA, "complete", {
      configurable: true,
      value: false,
    });
    Object.defineProperty(imgB, "complete", {
      configurable: true,
      value: false,
    });

    document.body.replaceChildren(host); // connect → runtime arms both leads

    // Neither overlay hands off until its own frames load.
    expect(leadA.hasAttribute("data-sequencing")).toBe(false);
    expect(leadB.hasAttribute("data-sequencing")).toBe(false);

    // Each arms independently, on its own overlay's load.
    imgA.dispatchEvent(new Event("load"));
    expect(leadA.hasAttribute("data-sequencing")).toBe(true);
    expect(leadB.hasAttribute("data-sequencing")).toBe(false);

    imgB.dispatchEvent(new Event("load"));
    expect(leadB.hasAttribute("data-sequencing")).toBe(true);
  });

  it("waits for load when complete is true but no pixels are decoded", () => {
    // iOS Safari / Chrome can report complete=true before the <picture> has
    // begun loading its source; starting then would clip a slow load.
    defineSetImage();

    const host = document.createElement("div");
    host.className = "set";
    host.innerHTML = renderSetImage({
      animated: true,
      leadSrc: "https://cdn/load-scan.webp",
      src: "https://cdn/scan.webp",
      still: "https://cdn/still.svg",
    });
    const lead = host.querySelector<HTMLElement>('[data-layer="lead"]');
    const img = lead?.querySelector("img");
    if (!lead || !img) throw new Error("expected a lead overlay");
    Object.defineProperty(img, "complete", { configurable: true, value: true });
    Object.defineProperty(img, "naturalWidth", {
      configurable: true,
      value: 0,
    });

    document.body.replaceChildren(host); // connect → runtime arms

    // No decoded pixels yet: hold, don't arm from render.
    expect(lead.hasAttribute("data-sequencing")).toBe(false);

    // The hand-off is armed only once the frames actually load.
    img.dispatchEvent(new Event("load"));
    expect(lead.hasAttribute("data-sequencing")).toBe(true);
  });

  it("upgrades a non-sequenced image to an inert host", () => {
    defineSetImage();
    const root = mountImage(
      renderSetImage({
        animated: true,
        src: "https://cdn/animation.webp",
        still: "https://cdn/still.svg",
      }),
    );
    expect(root.querySelector('[data-layer="lead"]')).toBeNull();
    expect(root.querySelector(SET_IMAGE_TAG_NAME)).toBeTruthy();
  });
});

describeSpecConsistency<SetImageProps>({
  baseProps: { src: "/img.jpg" },
  renderer: renderSetImage,
  spec: SET_IMAGE_SPEC,
  propOverrides: {
    // The harness probes `animated` on its own (no `adaptive`), so supply a
    // valid unpaired config: a `still` and a `src` without a `{scheme}` token.
    animated: {
      src: "https://cdn.example/example--cyan--scan--3x2.webp",
      still: "https://cdn.example/example--cyan--3x2--adaptive.svg",
    },
    // The `data-sequenced` rule probes `leadSrc`; sequencing requires
    // `animated` and a `still`, so supply both alongside.
    leadSrc: {
      animated: true,
      still: "https://cdn.example/example--cyan--3x2--adaptive.svg",
    },
  },
});
