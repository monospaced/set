import { describe, expect, it } from "vitest";

import { describeSpecConsistency } from "../../test/spec";
import { SET_SHAPE_SPEC, type SetShapeProps, renderSetShape } from "./shape";

function mountShape(html: string): HTMLElement {
  document.body.innerHTML = `<div class="set">${html}</div>`;
  return document.body.querySelector(".set") as HTMLElement;
}

describe("renderSetShape", () => {
  it("renders the settled default root contract", () => {
    const root = mountShape(renderSetShape());
    const shape = root.querySelector(".set-shape") as HTMLElement;

    expect(shape).toBeTruthy();
    expect(shape.tagName).toBe("DIV");
    expect(shape.className).toBe("set-shape");
    expect(shape.getAttribute("data-variant")).toBe("corner");
    expect(shape.hasAttribute("data-tone")).toBe(false);
    expect(shape.getAttribute("data-size")).toBe("md");
  });

  it("emits explicit non-default size and tone attributes", () => {
    const root = mountShape(
      renderSetShape({ size: "fill", tone: "brand", variant: "circle-sm" }),
    );
    const shape = root.querySelector(".set-shape") as HTMLElement;

    expect(shape.getAttribute("data-variant")).toBe("circle-sm");
    expect(shape.getAttribute("data-tone")).toBe("brand");
    expect(shape.getAttribute("data-size")).toBe("fill");
  });

  it("emits each supported non-default tone value", () => {
    const neutral = mountShape(
      renderSetShape({ tone: "neutral", variant: "tile-lg" }),
    ).querySelector(".set-shape") as HTMLElement;
    const support = mountShape(
      renderSetShape({ tone: "support", variant: "tile-slice-sm" }),
    ).querySelector(".set-shape") as HTMLElement;

    expect(neutral.getAttribute("data-tone")).toBe("neutral");
    expect(support.getAttribute("data-tone")).toBe("support");
  });

  it("emits kebab-case variant values directly", () => {
    const root = mountShape(
      renderSetShape({ variant: "tile-slice-lg", size: "xl" }),
    );
    const shape = root.querySelector(".set-shape") as HTMLElement;

    expect(shape.getAttribute("data-variant")).toBe("tile-slice-lg");
    expect(shape.getAttribute("data-size")).toBe("xl");
  });

  it("renders consumer-provided id on the host", () => {
    const root = mountShape(renderSetShape({ id: "my-shape" }));
    const shape = root.querySelector(".set-shape") as HTMLElement;

    expect(shape.id).toBe("my-shape");
  });

  it("omits id when not provided", () => {
    const root = mountShape(renderSetShape());
    const shape = root.querySelector(".set-shape") as HTMLElement;

    expect(shape.hasAttribute("id")).toBe(false);
  });

  it("throws on a syntactically invalid id", () => {
    expect(() => renderSetShape({ id: "not valid" })).toThrow();
  });
});

describeSpecConsistency<SetShapeProps>({
  baseProps: {},
  renderer: renderSetShape,
  spec: SET_SHAPE_SPEC,
});
