import { getByText } from "@testing-library/dom";
import { describe, expect, it } from "vitest";

import { describeSpecConsistency } from "../../test/spec";
import {
  renderSetGrid,
  renderSetGridItem,
  SET_GRID_ITEM_SPEC,
  SET_GRID_SPEC,
  type SetGridItemProps,
  type SetGridProps,
} from "./grid";

function mountGrid(html: string): HTMLElement {
  document.body.innerHTML = `<div class="set">${html}</div>`;
  return document.body.querySelector(".set") as HTMLElement;
}

describe("renderSetGrid", () => {
  it("renders a set-grid host with inner grid and default gap omitted", () => {
    const root = mountGrid(renderSetGrid({ children: "Body" }));
    const host = root.querySelector(".set-grid");
    const grid = host?.querySelector(".grid");

    expect(host?.tagName).toBe("DIV");
    expect(host?.classList.contains("set-grid")).toBe(true);
    expect(grid?.classList.contains("grid")).toBe(true);
    expect(host?.hasAttribute("data-gap")).toBe(false);
  });

  it("emits explicit non-default gap values on the host", () => {
    const expandedRoot = mountGrid(
      renderSetGrid({ children: "Body", gap: "expanded" }),
    );
    const expandedHost = expandedRoot.querySelector(".set-grid");

    expect(expandedHost?.getAttribute("data-gap")).toBe("expanded");

    const noneRoot = mountGrid(
      renderSetGrid({ children: "Body", gap: "none" }),
    );
    const noneHost = noneRoot.querySelector(".set-grid");

    expect(noneHost?.getAttribute("data-gap")).toBe("none");
  });

  it("renders trusted HTML children", () => {
    const root = mountGrid(
      renderSetGrid({
        children: '<p>Lorem <em>ipsum</em> <a href="/docs">docs</a></p>',
      }),
    );

    expect(root.querySelector("p")?.textContent).toContain("Lorem");
    expect(root.querySelector("em")?.textContent).toBe("ipsum");
    expect(root.querySelector("a")?.getAttribute("href")).toBe("/docs");
  });

  it("renders consumer-provided id on the host", () => {
    const root = mountGrid(renderSetGrid({ id: "my-grid" }));
    const grid = root.querySelector(".set-grid") as HTMLElement;

    expect(grid.id).toBe("my-grid");
  });

  it("omits id when not provided", () => {
    const root = mountGrid(renderSetGrid({}));
    const grid = root.querySelector(".set-grid") as HTMLElement;

    expect(grid.hasAttribute("id")).toBe(false);
  });

  it("throws on a syntactically invalid id", () => {
    expect(() => renderSetGrid({ id: "not valid" })).toThrow();
  });
});

describe("renderSetGridItem", () => {
  it("renders a grid item div with default attrs omitted", () => {
    const root = mountGrid(renderSetGridItem({ children: "Item" }));
    const item = getByText(root, "Item");

    expect(item.tagName).toBe("DIV");
    expect(item.classList.contains("set-grid-item")).toBe(true);
    expect(item.hasAttribute("data-align")).toBe(false);
    expect(item.hasAttribute("data-justify")).toBe(false);
    expect(item.hasAttribute("data-col-span")).toBe(false);
    expect(item.hasAttribute("data-col-span-narrow")).toBe(false);
    expect(item.hasAttribute("data-col-start")).toBe(false);
    expect(item.hasAttribute("data-col-start-narrow")).toBe(false);
    expect(item.hasAttribute("data-col-span-wide")).toBe(false);
    expect(item.hasAttribute("data-col-start-wide")).toBe(false);
    expect(item.hasAttribute("data-row-span-narrow")).toBe(false);
    expect(item.hasAttribute("data-row-span")).toBe(false);
    expect(item.hasAttribute("data-row-span-wide")).toBe(false);
    expect(item.hasAttribute("data-row-start-narrow")).toBe(false);
    expect(item.hasAttribute("data-row-start")).toBe(false);
    expect(item.hasAttribute("data-row-start-wide")).toBe(false);
  });

  it("emits explicit placement and alignment attrs", () => {
    const root = mountGrid(
      renderSetGridItem({
        align: "center",
        children: "Item",
        colSpan: 6,
        colSpanNarrow: 8,
        colSpanWide: 5,
        colStart: 2,
        colStartNarrow: 3,
        colStartWide: 8,
        justify: "end",
        rowSpanNarrow: 3,
        rowSpan: 2,
        rowSpanWide: 4,
        rowStartNarrow: 1,
        rowStart: 4,
        rowStartWide: 6,
      }),
    );
    const item = getByText(root, "Item");

    expect(item.getAttribute("data-align")).toBe("center");
    expect(item.getAttribute("data-justify")).toBe("end");
    expect(item.getAttribute("data-col-span")).toBe("6");
    expect(item.getAttribute("data-col-span-narrow")).toBe("8");
    expect(item.getAttribute("data-col-span-wide")).toBe("5");
    expect(item.getAttribute("data-col-start")).toBe("2");
    expect(item.getAttribute("data-col-start-narrow")).toBe("3");
    expect(item.getAttribute("data-col-start-wide")).toBe("8");
    expect(item.getAttribute("data-row-span-narrow")).toBe("3");
    expect(item.getAttribute("data-row-span")).toBe("2");
    expect(item.getAttribute("data-row-span-wide")).toBe("4");
    expect(item.getAttribute("data-row-start-narrow")).toBe("1");
    expect(item.getAttribute("data-row-start")).toBe("4");
    expect(item.getAttribute("data-row-start-wide")).toBe("6");
  });

  it('emits "start" when explicitly provided for align/justify', () => {
    const root = mountGrid(
      renderSetGridItem({
        align: "start",
        children: "Item",
        justify: "start",
      }),
    );
    const item = getByText(root, "Item");

    expect(item.getAttribute("data-align")).toBe("start");
    expect(item.getAttribute("data-justify")).toBe("start");
  });

  it("composes correctly when mapped into grid children", () => {
    const items = [
      renderSetGridItem({ children: "A", colSpan: 6 }),
      renderSetGridItem({ children: "B", colSpan: 6 }),
    ];
    const root = mountGrid(renderSetGrid({ children: items.join("") }));

    expect(getByText(root, "A").classList.contains("set-grid-item")).toBe(true);
    expect(getByText(root, "B").classList.contains("set-grid-item")).toBe(true);
  });

  it("renders consumer-provided id on the host", () => {
    const root = mountGrid(
      renderSetGridItem({ children: "Item", id: "my-grid-item" }),
    );
    const item = getByText(root, "Item");

    expect(item.id).toBe("my-grid-item");
  });

  it("omits id when not provided", () => {
    const root = mountGrid(renderSetGridItem({ children: "Item" }));
    const item = getByText(root, "Item");

    expect(item.hasAttribute("id")).toBe(false);
  });

  it("throws on a syntactically invalid id", () => {
    expect(() =>
      renderSetGridItem({ children: "Item", id: "not valid" }),
    ).toThrow();
  });
});

describeSpecConsistency<SetGridProps>({
  baseProps: {},
  renderer: renderSetGrid,
  spec: SET_GRID_SPEC,
});

describeSpecConsistency<SetGridItemProps>({
  baseProps: {},
  renderer: renderSetGridItem,
  spec: SET_GRID_ITEM_SPEC,
});
