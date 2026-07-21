import { getByText } from "@testing-library/dom";
import { describe, expect, it } from "vitest";

import { describeSpecConsistency } from "../../test/spec";
import {
  SET_CONTAINER_SPEC,
  type SetContainerProps,
  renderSetContainer,
} from "./container";

function mountContainer(html: string): HTMLElement {
  document.body.innerHTML = `<div class="set">${html}</div>`;
  return document.body.querySelector(".set") as HTMLElement;
}

describe("renderSetContainer", () => {
  it("renders a container div with default gutter and no max-inline-size/gutter attributes", () => {
    const root = mountContainer(renderSetContainer({ children: "Body" }));
    const container = getByText(root, "Body");

    expect(container.tagName).toBe("DIV");
    expect(container.classList.contains("set-container")).toBe(true);
    expect(container.hasAttribute("data-max-inline-size")).toBe(false);
    expect(container.hasAttribute("data-gutter")).toBe(false);
  });

  it("renders trusted HTML content when children is provided", () => {
    const root = mountContainer(
      renderSetContainer({
        children: '<p>Lorem <em>ipsum</em> <a href="/docs">docs</a></p>',
      }),
    );

    expect(root.querySelector("p")?.textContent).toContain("Lorem");
    expect(root.querySelector("em")?.textContent).toBe("ipsum");
    expect(root.querySelector("a")?.getAttribute("href")).toBe("/docs");
  });

  it("allows omitted and empty children without throwing", () => {
    const omittedRoot = mountContainer(renderSetContainer({}));
    const omittedContainer = omittedRoot.querySelector(".set-container");

    expect(omittedContainer).toBeTruthy();
    expect(omittedContainer?.innerHTML).toBe("");

    const emptyRoot = mountContainer(renderSetContainer({ children: "" }));
    const emptyContainer = emptyRoot.querySelector(".set-container");

    expect(emptyContainer).toBeTruthy();
    expect(emptyContainer?.innerHTML).toBe("");
  });

  it("does not emit data attributes for explicit default prop values", () => {
    const root = mountContainer(
      renderSetContainer({
        children: "Body",
        gutter: "default",
        maxInlineSize: "default",
      }),
    );
    const container = getByText(root, "Body");

    expect(container.hasAttribute("data-max-inline-size")).toBe(false);
    expect(container.hasAttribute("data-gutter")).toBe(false);
  });

  it("emits explicit max-inline-size and gutter values", () => {
    const wideRoot = mountContainer(
      renderSetContainer({
        children: "Body",
        gutter: "narrow",
        maxInlineSize: "wide",
      }),
    );
    const wideContainer = getByText(wideRoot, "Body");

    expect(wideContainer.getAttribute("data-max-inline-size")).toBe("wide");
    expect(wideContainer.getAttribute("data-gutter")).toBe("narrow");

    const noneRoot = mountContainer(
      renderSetContainer({
        children: "Body",
        gutter: "none",
        maxInlineSize: "none",
      }),
    );
    const noneContainer = getByText(noneRoot, "Body");

    expect(noneContainer.getAttribute("data-max-inline-size")).toBe("none");
    expect(noneContainer.getAttribute("data-gutter")).toBe("none");
  });
  it("renders consumer-provided id on the host", () => {
    const root = mountContainer(
      renderSetContainer({ children: "Body", id: "my-container" }),
    );
    const container = root.querySelector(".set-container") as HTMLElement;

    expect(container.id).toBe("my-container");
  });

  it("omits id when not provided", () => {
    const root = mountContainer(renderSetContainer({ children: "Body" }));
    const container = root.querySelector(".set-container") as HTMLElement;

    expect(container.hasAttribute("id")).toBe(false);
  });

  it("throws on a syntactically invalid id", () => {
    expect(() =>
      renderSetContainer({ children: "Body", id: "not valid" }),
    ).toThrow();
  });
});

describeSpecConsistency<SetContainerProps>({
  baseProps: {},
  renderer: renderSetContainer,
  spec: SET_CONTAINER_SPEC,
});
