import { getByRole } from "@testing-library/dom";
import { describe, expect, it } from "vitest";

import { describeSpecConsistency } from "../../test/spec";
import { renderSetLink, SET_LINK_SPEC, type SetLinkProps } from "./link";

function mount(html: string): void {
  document.body.innerHTML = `<div class="set">${html}</div>`;
}

describe("renderSetLink", () => {
  it("renders a link with the standard attrs", () => {
    mount(renderSetLink({ href: "/docs", label: "Docs" }));
    const link = getByRole(document.body, "link", { name: "Docs" });

    expect(link.getAttribute("href")).toBe("/docs");
    expect(link.getAttribute("data-size")).toBe("md");
    expect(link.getAttribute("data-tone")).toBeNull();
    expect(link.hasAttribute("data-underline")).toBe(false);
  });

  it("escapes the label text", () => {
    mount(renderSetLink({ href: "/docs", label: "<Docs>" }));
    const link = getByRole(document.body, "link", { name: "<Docs>" });

    expect(link.querySelector(".label")?.innerHTML).toBe("&lt;Docs&gt;");
  });

  it("renders trusted icon markup when provided", () => {
    mount(
      renderSetLink({
        href: "/docs",
        icon: '<svg class="brand-icon" aria-hidden="true"></svg>',
        label: "Docs",
      }),
    );
    const link = getByRole(document.body, "link", { name: "Docs" });

    expect(link.firstElementChild?.className).toBe("icon-wrapper");
    expect(link.querySelector(".icon-wrapper .brand-icon")).toBeTruthy();
  });

  it("emits rel and target when values are provided", () => {
    mount(
      renderSetLink({
        href: "/docs",
        label: "Docs",
        rel: "noreferrer",
        target: "_blank",
      }),
    );
    const link = getByRole(document.body, "link", { name: "Docs" });

    expect(link.getAttribute("rel")).toBe("noreferrer");
    expect(link.getAttribute("target")).toBe("_blank");
  });

  it("emits neutral tone and small size when provided", () => {
    mount(
      renderSetLink({
        href: "/docs",
        label: "Docs",
        size: "sm",
        tone: "neutral",
      }),
    );
    const link = getByRole(document.body, "link", { name: "Docs" });

    expect(link.getAttribute("data-size")).toBe("sm");
    expect(link.getAttribute("data-tone")).toBe("neutral");
  });

  it("emits underline when provided", () => {
    mount(renderSetLink({ href: "/docs", label: "Docs", underline: true }));
    const link = getByRole(document.body, "link", { name: "Docs" });

    expect(link.hasAttribute("data-underline")).toBe(true);
  });

  it("emits appearance and larger size for button-styled links", () => {
    mount(
      renderSetLink({
        appearance: "solid",
        href: "/docs",
        label: "Docs",
        size: "lg",
      }),
    );
    const link = getByRole(document.body, "link", { name: "Docs" });

    expect(link.getAttribute("data-appearance")).toBe("solid");
    expect(link.getAttribute("data-size")).toBe("lg");
  });

  it("renders icon at end when iconPlacement is end", () => {
    mount(
      renderSetLink({
        href: "/docs",
        icon: '<svg aria-hidden="true"></svg>',
        iconPlacement: "end",
        label: "Docs",
      }),
    );
    const link = getByRole(document.body, "link", { name: "Docs" });

    expect(link.lastElementChild?.className).toBe("icon-wrapper");
  });

  it("emits labelVisibility when icon is present", () => {
    mount(
      renderSetLink({
        href: "/docs",
        icon: '<svg aria-hidden="true"></svg>',
        label: "Docs",
        labelVisibility: "hiddenBelowTablet",
      }),
    );
    const link = getByRole(document.body, "link", { name: "Docs" });

    expect(link.getAttribute("data-label-visibility")).toBe(
      "hiddenBelowTablet",
    );
  });

  it("throws when label is hidden but no icon is present", () => {
    expect(() =>
      renderSetLink({
        href: "/docs",
        label: "Docs",
        labelVisibility: "hidden",
      }),
    ).toThrow("labelVisibility requires icon when label is not visible.");
  });

  it("emits download and suppresses rel/target when set", () => {
    mount(
      renderSetLink({
        download: "report.pdf",
        href: "/docs/report.pdf",
        label: "Report",
        rel: "noreferrer",
        target: "_blank",
      }),
    );
    const link = getByRole(document.body, "link", { name: "Report" });

    expect(link.getAttribute("download")).toBe("report.pdf");
    expect(link.getAttribute("rel")).toBeNull();
    expect(link.getAttribute("target")).toBeNull();
  });

  it("emits valueless download when true", () => {
    mount(
      renderSetLink({
        download: true,
        href: "/docs/report.pdf",
        label: "Report",
      }),
    );
    const link = getByRole(document.body, "link", { name: "Report" });

    expect(link.hasAttribute("download")).toBe(true);
    expect(link.getAttribute("download")).toBe("");
  });

  it("renders consumer-provided id on the host", () => {
    mount(renderSetLink({ href: "/docs", id: "my-link", label: "Docs" }));
    const link = getByRole(document.body, "link", { name: "Docs" });

    expect(link.id).toBe("my-link");
  });

  it("omits id when not provided", () => {
    mount(renderSetLink({ href: "/docs", label: "Docs" }));
    const link = getByRole(document.body, "link", { name: "Docs" });

    expect(link.hasAttribute("id")).toBe(false);
  });

  it("throws on a syntactically invalid id", () => {
    expect(() =>
      renderSetLink({ href: "/docs", id: "not valid", label: "Docs" }),
    ).toThrow();
  });

  it("emits aria-current when current is set", () => {
    mount(renderSetLink({ current: "page", href: "/docs", label: "Docs" }));
    const link = getByRole(document.body, "link", { name: "Docs" });

    expect(link.getAttribute("aria-current")).toBe("page");
  });

  it("omits aria-current when current is not set", () => {
    mount(renderSetLink({ href: "/docs", label: "Docs" }));
    const link = getByRole(document.body, "link", { name: "Docs" });

    expect(link.hasAttribute("aria-current")).toBe(false);
  });
});

describeSpecConsistency<SetLinkProps>({
  baseProps: { href: "/docs", label: "Docs" },
  propOverrides: {
    labelVisibility: { icon: '<svg aria-hidden="true"></svg>' },
  },
  renderer: renderSetLink,
  spec: SET_LINK_SPEC,
});
