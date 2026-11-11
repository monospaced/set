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
  it("renders the default root at level 8, md, default tone", () => {
    const root = mountDither(renderSetDither());
    const dither = root.querySelector(".set-dither") as HTMLElement;

    expect(dither.tagName).toBe("DIV");
    expect(dither.getAttribute("data-level")).toBe("8");
    expect(dither.getAttribute("data-size")).toBe("md");
    expect(dither.hasAttribute("data-tone")).toBe(false);
    expect(dither.hasAttribute("data-ramp")).toBe(false);
    expect(dither.querySelector(".ramp")).toBeNull();
    expect(dither.innerHTML).toBe("");
  });

  it("snaps density to 17 levels", () => {
    expect(ditherLevel(0)).toBe(0);
    expect(ditherLevel(33)).toBe(5);
    expect(ditherLevel(50)).toBe(8);
    expect(ditherLevel(100)).toBe(16);
    expect(ditherLevel(140)).toBe(16);
    expect(ditherLevel(-5)).toBe(0);
  });

  it("emits explicit density, size and tone values", () => {
    const root = mountDither(
      renderSetDither({ density: 75, size: "xs", tone: "brand" }),
    );
    const dither = root.querySelector(".set-dither") as HTMLElement;

    expect(dither.getAttribute("data-level")).toBe("12");
    expect(dither.getAttribute("data-size")).toBe("xs");
    expect(dither.getAttribute("data-tone")).toBe("brand");
  });

  it("renders a ramp as 17 bands from solid toward the direction", () => {
    const root = mountDither(
      renderSetDither({ children: "<p>Body</p>", ramp: "inline-end" }),
    );
    const dither = root.querySelector(".set-dither") as HTMLElement;
    const bands = Array.from(dither.querySelectorAll(".ramp > .band"));

    expect(dither.getAttribute("data-ramp")).toBe("inline-end");
    expect(dither.hasAttribute("data-level")).toBe(false);
    expect(dither.querySelector(".ramp")?.getAttribute("aria-hidden")).toBe(
      "true",
    );
    expect(bands).toHaveLength(17);
    expect(bands[16].getAttribute("data-band")).toBe("16");
    expect(bands[0].getAttribute("data-level")).toBe("16");
    expect(bands[16].getAttribute("data-level")).toBe("0");
    expect(dither.querySelector("p")?.textContent).toBe("Body");
  });

  it("reverses the ramp for start directions", () => {
    const root = mountDither(renderSetDither({ ramp: "block-start" }));
    const bands = Array.from(root.querySelectorAll(".band"));

    expect(bands[0].getAttribute("data-level")).toBe("0");
    expect(bands[16].getAttribute("data-level")).toBe("16");
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
