import { describe, expect, it } from "vitest";

import { describeSpecConsistency } from "../../test/spec";
import {
  ditherLevel,
  renderSetPattern,
  SET_PATTERN_SPEC,
  type SetPatternProps,
} from "./pattern";

function mountPattern(html: string): HTMLElement {
  document.body.innerHTML = `<div class="set">${html}</div>`;
  return document.body.querySelector(".set") as HTMLElement;
}

describe("renderSetPattern", () => {
  it("renders the settled default root contract", () => {
    const root = mountPattern(renderSetPattern());
    const pattern = root.querySelector(".set-pattern") as HTMLElement;

    expect(pattern).toBeTruthy();
    expect(pattern.tagName).toBe("DIV");
    expect(pattern.className).toBe("set-pattern");
    expect(pattern.getAttribute("data-size")).toBe("md");
    expect(pattern.hasAttribute("data-tone")).toBe(false);
    expect(pattern.getAttribute("data-variant")).toBe("tile");
    expect(pattern.innerHTML).toBe("");
  });

  it("emits explicit variant, size, and tone values", () => {
    const root = mountPattern(
      renderSetPattern({
        size: "fill",
        tone: "brand",
        variant: "tileLight",
      }),
    );
    const pattern = root.querySelector(".set-pattern") as HTMLElement;

    expect(pattern.getAttribute("data-size")).toBe("fill");
    expect(pattern.getAttribute("data-tone")).toBe("brand");
    expect(pattern.getAttribute("data-variant")).toBe("tileLight");
  });

  it("emits the subtle tone value", () => {
    const root = mountPattern(renderSetPattern({ tone: "subtle" }));
    const pattern = root.querySelector(".set-pattern") as HTMLElement;

    expect(pattern.getAttribute("data-tone")).toBe("subtle");
  });

  it("emits the secondary and tertiary brand tone values", () => {
    for (const tone of ["brandSecondary", "brandTertiary"] as const) {
      const root = mountPattern(renderSetPattern({ tone }));
      const pattern = root.querySelector(".set-pattern") as HTMLElement;

      expect(pattern.getAttribute("data-tone")).toBe(tone);
    }
  });

  it("snaps density to 17 dither levels", () => {
    expect(ditherLevel(0)).toBe(0);
    expect(ditherLevel(33)).toBe(5);
    expect(ditherLevel(50)).toBe(8);
    expect(ditherLevel(100)).toBe(16);
    expect(ditherLevel(140)).toBe(16);
    expect(ditherLevel(-5)).toBe(0);
  });

  it("emits the dither level and cell shape", () => {
    const root = mountPattern(
      renderSetPattern({ cell: "character", density: 75, variant: "dither" }),
    );
    const pattern = root.querySelector(".set-pattern") as HTMLElement;

    expect(pattern.getAttribute("data-variant")).toBe("dither");
    expect(pattern.getAttribute("data-level")).toBe("12");
    expect(pattern.getAttribute("data-cell")).toBe("character");
    expect(pattern.querySelector(".ramp")).toBeNull();
  });

  it("omits the level and cell attributes off the dither variants", () => {
    const root = mountPattern(renderSetPattern({ density: 75 }));
    const pattern = root.querySelector(".set-pattern") as HTMLElement;

    expect(pattern.hasAttribute("data-level")).toBe(false);
    expect(pattern.hasAttribute("data-cell")).toBe(false);
  });

  it("renders a ramp as 17 bands from solid toward the direction", () => {
    const root = mountPattern(
      renderSetPattern({ children: "<p>Body</p>", variant: "ditherRamp" }),
    );
    const pattern = root.querySelector(".set-pattern") as HTMLElement;
    const bands = Array.from(pattern.querySelectorAll(".ramp > .band"));

    expect(pattern.hasAttribute("data-direction")).toBe(false);
    expect(pattern.querySelector(".ramp")?.getAttribute("aria-hidden")).toBe(
      "true",
    );
    expect(bands).toHaveLength(17);
    expect(bands.map((band) => band.getAttribute("data-band"))[16]).toBe("16");
    expect(bands[0].getAttribute("data-level")).toBe("16");
    expect(bands[16].getAttribute("data-level")).toBe("0");
    expect(pattern.querySelector("p")?.textContent).toBe("Body");
  });

  it("reverses the ramp for start directions and emits data-direction", () => {
    const root = mountPattern(
      renderSetPattern({ direction: "block-start", variant: "ditherRamp" }),
    );
    const pattern = root.querySelector(".set-pattern") as HTMLElement;
    const bands = Array.from(pattern.querySelectorAll(".band"));

    expect(pattern.getAttribute("data-direction")).toBe("block-start");
    expect(bands[0].getAttribute("data-level")).toBe("0");
    expect(bands[16].getAttribute("data-level")).toBe("16");
  });

  it("renders trusted child HTML inside the root", () => {
    const root = mountPattern(
      renderSetPattern({
        children: '<div class="content">Pattern content</div>',
      }),
    );
    const pattern = root.querySelector(".set-pattern") as HTMLElement;
    const content = pattern.querySelector(".content") as HTMLElement;

    expect(content).toBeTruthy();
    expect(content.textContent).toBe("Pattern content");
  });

  it("renders consumer-provided id on the host", () => {
    const root = mountPattern(renderSetPattern({ id: "my-pattern" }));
    const pattern = root.querySelector(".set-pattern") as HTMLElement;

    expect(pattern.id).toBe("my-pattern");
  });

  it("omits id when not provided", () => {
    const root = mountPattern(renderSetPattern());
    const pattern = root.querySelector(".set-pattern") as HTMLElement;

    expect(pattern.hasAttribute("id")).toBe(false);
  });

  it("throws on a syntactically invalid id", () => {
    expect(() => renderSetPattern({ id: "not valid" })).toThrow();
  });
});

describeSpecConsistency<SetPatternProps>({
  baseProps: {},
  renderer: renderSetPattern,
  spec: SET_PATTERN_SPEC,
});
