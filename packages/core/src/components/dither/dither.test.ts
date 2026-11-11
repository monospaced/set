import { describe, expect, it } from "vitest";

import { describeSpecConsistency } from "../../test/spec";
import {
  ditherLevel,
  renderSetDither,
  SET_DITHER_SPEC,
  type SetDitherProps,
} from "./dither";

function mountDither(html: string): HTMLElement {
  document.body.innerHTML = `<div class="set">${html}</div>`;
  return document.body.querySelector(".set") as HTMLElement;
}

describe("renderSetDither", () => {
  it("renders the default root at level 8, md cell, default tone", () => {
    const root = mountDither(renderSetDither());
    const dither = root.querySelector(".set-dither") as HTMLElement;

    expect(dither.tagName).toBe("DIV");
    expect(dither.getAttribute("data-level")).toBe("8");
    expect(dither.getAttribute("data-cell")).toBe("md");
    expect(dither.hasAttribute("data-tone")).toBe(false);
    expect(dither.hasAttribute("data-ramp")).toBe(false);
    expect(dither.querySelector(".ramp")).toBeNull();
    expect(dither.innerHTML).toBe("");
  });

  it("snaps density to 17 levels, empty only at 0 and solid only at 100", () => {
    expect(ditherLevel(0)).toBe(0);
    expect(ditherLevel(1)).toBe(1);
    expect(ditherLevel(3)).toBe(1);
    expect(ditherLevel(33)).toBe(5);
    expect(ditherLevel(50)).toBe(8);
    expect(ditherLevel(97)).toBe(15);
    expect(ditherLevel(99)).toBe(15);
    expect(ditherLevel(100)).toBe(16);
    expect(ditherLevel(140)).toBe(16);
    expect(ditherLevel(-5)).toBe(0);
  });

  it("emits explicit density, cell and tone values", () => {
    const root = mountDither(
      renderSetDither({ cell: "sm", density: 75, tone: "brand" }),
    );
    const dither = root.querySelector(".set-dither") as HTMLElement;

    expect(dither.getAttribute("data-level")).toBe("12");
    expect(dither.getAttribute("data-cell")).toBe("sm");
    expect(dither.getAttribute("data-tone")).toBe("brand");
  });

  it("renders a ramp as a band per level, dense at the named edge", () => {
    const root = mountDither(
      renderSetDither({
        children: "<p>Body</p>",
        density: 50,
        ramp: "inline-start",
      }),
    );
    const dither = root.querySelector(".set-dither") as HTMLElement;
    const bands = Array.from(dither.querySelectorAll(".ramp > .band"));

    expect(dither.getAttribute("data-ramp")).toBe("inline-start");
    expect(dither.getAttribute("data-level")).toBe("8");
    expect(dither.querySelector(".ramp")?.getAttribute("aria-hidden")).toBe(
      "true",
    );
    expect(bands).toHaveLength(9);
    expect(bands[8].getAttribute("data-band")).toBe("8");
    expect(bands[0].getAttribute("data-level")).toBe("8");
    expect(bands[8].getAttribute("data-level")).toBe("0");
    expect(dither.querySelector("p")?.textContent).toBe("Body");
  });

  it("reverses the ramp for end edges", () => {
    const root = mountDither(
      renderSetDither({ density: 100, ramp: "block-end" }),
    );
    const bands = Array.from(root.querySelectorAll(".band"));

    expect(bands).toHaveLength(17);
    expect(bands[0].getAttribute("data-level")).toBe("0");
    expect(bands[16].getAttribute("data-level")).toBe("16");
  });

  it("emits pixel sizes as rem custom properties with presence attributes", () => {
    const root = mountDither(
      renderSetDither({ aspectRatio: "16:9", blockSize: 48, inlineSize: 320 }),
    );
    const host = root.querySelector(".set-dither") as HTMLElement;

    expect(host.hasAttribute("data-block-size")).toBe(true);
    expect(host.hasAttribute("data-inline-size")).toBe(true);
    expect(host.getAttribute("data-aspect-ratio")).toBe("16:9");
    expect(host.getAttribute("style")).toBe(
      "--set-dither-block-size: 3rem; --set-dither-inline-size: 20rem",
    );
  });

  it("omits sizing attributes and style when unsized", () => {
    const root = mountDither(renderSetDither());
    const host = root.querySelector(".set-dither") as HTMLElement;

    expect(host.hasAttribute("data-block-size")).toBe(false);
    expect(host.hasAttribute("data-inline-size")).toBe(false);
    expect(host.hasAttribute("style")).toBe(false);
  });

  it("renders trusted child HTML inside the root", () => {
    const root = mountDither(
      renderSetDither({ children: '<div class="content">Content</div>' }),
    );

    expect(root.querySelector(".set-dither .content")?.textContent).toBe(
      "Content",
    );
  });

  it("renders consumer-provided id on the host", () => {
    const root = mountDither(renderSetDither({ id: "my-dither" }));
    const dither = root.querySelector(".set-dither") as HTMLElement;

    expect(dither.id).toBe("my-dither");
  });
});

describeSpecConsistency<SetDitherProps>({
  baseProps: {},
  renderer: renderSetDither,
  spec: SET_DITHER_SPEC,
});
