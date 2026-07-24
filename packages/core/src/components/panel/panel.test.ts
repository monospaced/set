import { describe, expect, it } from "vitest";

import { describeSpecConsistency } from "../../test/spec";
import { renderSetPanel, SET_PANEL_SPEC, type SetPanelProps } from "./panel";

function mountPanel(html: string): HTMLElement {
  document.body.innerHTML = `<div class="set">${html}</div>`;
  return document.body.querySelector(".set") as HTMLElement;
}

describe("renderSetPanel", () => {
  it("renders the default panel contract", () => {
    const root = mountPanel(renderSetPanel({ children: "Body" }));
    const panel = root.querySelector(".set-panel") as HTMLElement;

    expect(panel.tagName).toBe("DIV");
    expect(panel.className).toBe("set-panel");
    expect(panel.textContent).toBe("Body");
    expect(panel.getAttribute("data-padding")).toBe("md");
    expect(panel.hasAttribute("data-set-surface")).toBe(false);
  });

  it("renders trusted child HTML without escaping", () => {
    const root = mountPanel(
      renderSetPanel({
        children: '<p>Lorem <em>ipsum</em> <a href="/docs">docs</a></p>',
      }),
    );

    expect(root.querySelector(".set-panel p")?.textContent).toContain("Lorem");
    expect(root.querySelector(".set-panel em")?.textContent).toBe("ipsum");
    expect(root.querySelector(".set-panel a")?.getAttribute("href")).toBe(
      "/docs",
    );
  });

  it("supports omitted or empty children", () => {
    const omitted = mountPanel(renderSetPanel({}));
    const empty = mountPanel(renderSetPanel({ children: "" }));

    expect(omitted.querySelector(".set-panel")?.innerHTML).toBe("");
    expect(empty.querySelector(".set-panel")?.innerHTML).toBe("");
  });

  it("emits requested padding and any supported surface variant", () => {
    const root = mountPanel(
      renderSetPanel({
        children: "Body",
        padding: "xl",
        surface: "inverse",
      }),
    );
    const panel = root.querySelector(".set-panel") as HTMLElement;

    expect(panel.getAttribute("data-padding")).toBe("xl");
    expect(panel.getAttribute("data-set-surface")).toBe("inverse");
  });

  it("renders consumer-provided id on the host", () => {
    const root = mountPanel(
      renderSetPanel({ children: "Body", id: "my-panel" }),
    );
    const panel = root.querySelector(".set-panel") as HTMLElement;

    expect(panel.id).toBe("my-panel");
  });

  it("omits id when not provided", () => {
    const root = mountPanel(renderSetPanel({ children: "Body" }));
    const panel = root.querySelector(".set-panel") as HTMLElement;

    expect(panel.hasAttribute("id")).toBe(false);
  });

  it("throws on a syntactically invalid id", () => {
    expect(() =>
      renderSetPanel({ children: "Body", id: "not valid" }),
    ).toThrow();
  });
});

describeSpecConsistency<SetPanelProps>({
  baseProps: {},
  renderer: renderSetPanel,
  spec: SET_PANEL_SPEC,
});
