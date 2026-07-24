import { describe, expect, it } from "vitest";

import { describeSpecConsistency } from "../../test/spec";
import {
  renderSetPoster,
  renderSetPosterImage,
  SET_POSTER_SPEC,
  type SetPosterProps,
} from "./poster";

function mountPoster(html: string): HTMLElement {
  document.body.innerHTML = `<div class="set">${html}</div>`;
  return document.body.querySelector(".set") as HTMLElement;
}

const fixtureMedia = renderSetPosterImage({ src: "/image.jpg" });

describe("renderSetPoster", () => {
  it("renders the default poster contract", () => {
    const root = mountPoster(renderSetPoster({ media: fixtureMedia }));
    const poster = root.querySelector(".set-poster") as HTMLElement;

    expect(poster.tagName).toBe("DIV");
    expect(poster.className).toBe("set-poster");
    expect(
      poster
        .querySelector(".image-wrapper .set-image img")
        ?.getAttribute("src"),
    ).toBe("/image.jpg");
    expect(poster.querySelector(".content")).toBeFalsy();
  });

  it("renders trusted foreground child HTML inside content wrapper", () => {
    const root = mountPoster(
      renderSetPoster({
        children: '<div class="copy">Poster content</div>',
        media: fixtureMedia,
      }),
    );

    expect(root.querySelector(".set-poster .content .copy")?.textContent).toBe(
      "Poster content",
    );
  });

  it("emits data-set-surface when surface is provided", () => {
    const root = mountPoster(
      renderSetPoster({ media: fixtureMedia, surface: "brand" }),
    );

    expect(
      root.querySelector(".set-poster")?.getAttribute("data-set-surface"),
    ).toBe("brand");
  });

  it("emits content theme and default surface when contentTheme is provided", () => {
    const root = mountPoster(
      renderSetPoster({ contentTheme: "dark", media: fixtureMedia }),
    );
    const poster = root.querySelector(".set-poster") as HTMLElement;

    expect(poster.getAttribute("data-set-content-theme")).toBe("dark");
    expect(poster.getAttribute("data-set-surface")).toBe("default");
  });

  it("preserves an explicit brand surface when contentTheme is provided", () => {
    const root = mountPoster(
      renderSetPoster({
        contentTheme: "light",
        media: fixtureMedia,
        surface: "brand",
      }),
    );
    const poster = root.querySelector(".set-poster") as HTMLElement;

    expect(poster.getAttribute("data-set-content-theme")).toBe("light");
    expect(poster.getAttribute("data-set-surface")).toBe("brand");
  });

  it("renders consumer-provided id on the host", () => {
    const root = mountPoster(
      renderSetPoster({ id: "my-poster", media: fixtureMedia }),
    );
    const poster = root.querySelector(".set-poster") as HTMLElement;

    expect(poster.id).toBe("my-poster");
  });

  it("omits id when not provided", () => {
    const root = mountPoster(renderSetPoster({ media: fixtureMedia }));
    const poster = root.querySelector(".set-poster") as HTMLElement;

    expect(poster.hasAttribute("id")).toBe(false);
  });

  it("throws on a syntactically invalid id", () => {
    expect(() =>
      renderSetPoster({ id: "not valid", media: fixtureMedia }),
    ).toThrow();
  });
});

describe("renderSetPosterImage", () => {
  it("emits cover and high-priority fetch hints regardless of caller", () => {
    const root = mountPoster(
      renderSetPoster({
        media: renderSetPosterImage({ src: "/image.jpg" }),
      }),
    );
    const wrapper = root.querySelector(".image-wrapper .set-image");
    const img = wrapper?.querySelector("img");

    expect(wrapper?.getAttribute("data-object-fit")).toBe("cover");
    expect(img?.getAttribute("fetchpriority")).toBe("high");
  });

  it("forwards gravity, sizes, src, and srcSet; emits empty alt", () => {
    const root = mountPoster(
      renderSetPoster({
        media: renderSetPosterImage({
          gravity: "SE",
          sizes: "(max-width: 30em) 100vw, 60rem",
          src: "/image.jpg",
          srcSet: "/image.jpg 1x, /image-2x.jpg 2x",
        }),
      }),
    );
    const wrapper = root.querySelector(".image-wrapper .set-image");
    const img = wrapper?.querySelector("img");

    expect(wrapper?.getAttribute("data-gravity")).toBe("SE");
    expect(img?.getAttribute("alt")).toBe("");
    expect(img?.getAttribute("sizes")).toBe("(max-width: 30em) 100vw, 60rem");
    expect(img?.getAttribute("srcset")).toBe("/image.jpg 1x, /image-2x.jpg 2x");
  });
});

describeSpecConsistency<SetPosterProps>({
  baseProps: { media: fixtureMedia },
  renderer: renderSetPoster,
  spec: SET_POSTER_SPEC,
});
