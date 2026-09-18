import { getByRole, getByText, queryByRole } from "@testing-library/dom";
import { describe, expect, it } from "vitest";

import { describeSpecConsistency } from "../../test/spec";
import {
  renderSetHeading,
  SET_HEADING_SPEC,
  type SetHeadingProps,
} from "./heading";

function mountHeading(html: string): HTMLElement {
  document.body.innerHTML = `<div class="set">${html}</div>`;
  return document.body.querySelector(".set") as HTMLElement;
}

describe("renderSetHeading", () => {
  it("renders span by default with md size and no responsive attr", () => {
    const root = mountHeading(renderSetHeading({ children: "Title" }));
    const text = getByText(root, "Title");

    expect(queryByRole(root, "heading")).toBeNull();
    expect(text.tagName).toBe("SPAN");
    expect(text.classList.contains("set-heading")).toBe(true);
    expect(text.getAttribute("data-size")).toBe("md");
    expect(text.hasAttribute("data-responsive")).toBe(false);
  });

  it("renders semantic heading role and level when level is provided", () => {
    const root = mountHeading(
      renderSetHeading({ children: "Title", level: 3 }),
    );
    const heading = getByRole(root, "heading", { level: 3, name: "Title" });

    expect(heading).toBeTruthy();
  });

  it("omits data-align for default start align", () => {
    const root = mountHeading(
      renderSetHeading({ align: "start", children: "Title", level: 2 }),
    );
    const heading = getByRole(root, "heading", { level: 2, name: "Title" });

    expect(heading.hasAttribute("data-align")).toBe(false);
  });

  it("emits data-align for non-default align", () => {
    const root = mountHeading(
      renderSetHeading({ align: "end", children: "Title", level: 2 }),
    );
    const heading = getByRole(root, "heading", { level: 2, name: "Title" });

    expect(heading.getAttribute("data-align")).toBe("end");
  });

  it("emits data-size variant when provided", () => {
    const root = mountHeading(
      renderSetHeading({ children: "Title", level: 2, size: "2xl" }),
    );
    const heading = getByRole(root, "heading", { level: 2, name: "Title" });

    expect(heading.getAttribute("data-size")).toBe("2xl");
  });

  it("omits data-optical-align by default and emits it when enabled", () => {
    const defaultRoot = mountHeading(
      renderSetHeading({ children: "Title", level: 2 }),
    );
    const defaultHeading = getByRole(defaultRoot, "heading", {
      level: 2,
      name: "Title",
    });
    expect(defaultHeading.hasAttribute("data-optical-align")).toBe(false);

    const opticalRoot = mountHeading(
      renderSetHeading({ children: "Title", level: 2, opticalAlign: true }),
    );
    const opticalHeading = getByRole(opticalRoot, "heading", {
      level: 2,
      name: "Title",
    });
    expect(opticalHeading.hasAttribute("data-optical-align")).toBe(true);
  });

  it("emits data-responsive when responsive is true", () => {
    const root = mountHeading(
      renderSetHeading({ children: "Title", level: 2, responsive: true }),
    );
    const heading = getByRole(root, "heading", { level: 2, name: "Title" });

    expect(heading.hasAttribute("data-responsive")).toBe(true);
  });

  it("renders inline markup in children", () => {
    const root = mountHeading(
      renderSetHeading({
        children: `Read the <a href="/docs">docs</a>`,
        level: 2,
      }),
    );
    const heading = getByRole(root, "heading", {
      level: 2,
      name: "Read the docs",
    });
    const link = getByRole(heading, "link", { name: "docs" });

    expect(link.getAttribute("href")).toBe("/docs");
  });

  it("omits data-link-visited by default and emits off when disabled", () => {
    const defaultRoot = mountHeading(
      renderSetHeading({ children: "Title", level: 2 }),
    );
    const defaultHeading = getByRole(defaultRoot, "heading", {
      level: 2,
      name: "Title",
    });
    expect(defaultHeading.hasAttribute("data-link-visited")).toBe(false);

    const offRoot = mountHeading(
      renderSetHeading({ children: "Title", level: 2, linkVisited: false }),
    );
    const offHeading = getByRole(offRoot, "heading", {
      level: 2,
      name: "Title",
    });
    expect(offHeading.getAttribute("data-link-visited")).toBe("off");
  });

  it("does not expose heading role in span mode", () => {
    const root = mountHeading(
      renderSetHeading({
        children: "Title",
      }),
    );

    expect(queryByRole(root, "heading")).toBeNull();
  });

  it("renders consumer-provided id on the host", () => {
    const root = mountHeading(
      renderSetHeading({ id: "my-heading", level: 2, children: "Heading" }),
    );
    const heading = root.querySelector(".set-heading") as HTMLElement;

    expect(heading.id).toBe("my-heading");
  });

  it("omits id when not provided", () => {
    const root = mountHeading(
      renderSetHeading({ level: 2, children: "Heading" }),
    );
    const heading = root.querySelector(".set-heading") as HTMLElement;

    expect(heading.hasAttribute("id")).toBe(false);
  });

  it("throws on a syntactically invalid id", () => {
    expect(() =>
      renderSetHeading({ id: "not valid", level: 2, children: "Heading" }),
    ).toThrow();
  });
});

describeSpecConsistency<SetHeadingProps>({
  baseProps: { children: "Heading" },
  renderer: renderSetHeading,
  spec: SET_HEADING_SPEC,
});
