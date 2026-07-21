import { getAllByRole, getByRole } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { describeSpecConsistency } from "../../test/spec";
import {
  SET_NAV_SPEC,
  type SetNavItem,
  type SetNavProps,
  defineSetNav,
  renderSetNav,
} from "./nav";

function mountNav(html: string): HTMLElement {
  document.body.innerHTML = `<div class="set">${html}</div>`;
  return document.body.querySelector(".set") as HTMLElement;
}

const items: SetNavItem[] = [
  { current: true, href: "/one", label: "Item one" },
  { href: "/two", label: "Item two" },
  { href: "/three", label: "Item three" },
];

describe("renderSetNav", () => {
  it("renders semantic nav list markup", () => {
    const root = mountNav(renderSetNav({ items }));

    const nav = getByRole(root, "navigation");

    expect(nav.tagName).toBe("NAV");
    expect(root.querySelector("set-nav")).not.toBeNull();
    expect(getAllByRole(root, "listitem")).toHaveLength(3);
    expect(getAllByRole(root, "link")).toHaveLength(3);
  });

  it("emits aria-current for the current item", () => {
    const root = mountNav(renderSetNav({ items }));

    expect(
      getByRole(root, "link", { name: "Item one" }).getAttribute(
        "aria-current",
      ),
    ).toBe("page");
  });

  it("renders an accessible nav label when provided", () => {
    const root = mountNav(renderSetNav({ items, label: "Primary" }));

    expect(getByRole(root, "navigation", { name: "Primary" })).not.toBeNull();
  });

  it("escapes item labels", () => {
    const root = mountNav(
      renderSetNav({
        items: [{ href: "/x", label: "<strong>boom</strong>" }],
      }),
    );

    const link = getByRole(root, "link");
    expect(link.innerHTML).toBe("&lt;strong&gt;boom&lt;/strong&gt;");
    expect(link.querySelector("strong")).toBeNull();
  });

  it("emits collapsible hooks in SSR output", () => {
    const html = renderSetNav({
      collapsible: "belowTablet",
      contentId: "primary-nav-content",
      expanderPosition: "end",
      items,
      size: "sm",
    });

    expect(html.startsWith("<set-nav ")).toBe(true);
    expect(html.includes('data-collapsible="belowTablet"')).toBe(true);
    expect(html.includes('data-expander-position="end"')).toBe(true);
    expect(html.includes("data-expander-label=")).toBe(false);
    expect(html.includes('data-size="sm"')).toBe(true);
    expect(html.includes('data-part="expander"')).toBe(false);
  });

  it("throws when collapsible is set without a contentId", () => {
    expect(() => renderSetNav({ collapsible: "always", items })).toThrow(
      /contentId must be a non-empty string/,
    );
  });

  it("throws when contentId is not a valid HTML id", () => {
    expect(() =>
      renderSetNav({
        collapsible: "always",
        contentId: "123-bad-start",
        items,
      }),
    ).toThrow(/contentId must start with a letter/);
  });

  it("renders consumer-provided id on the host", () => {
    const root = mountNav(renderSetNav({ id: "my-nav", items }));
    const nav = root.querySelector("set-nav") as HTMLElement;

    expect(nav.id).toBe("my-nav");
  });

  it("omits id when not provided", () => {
    const root = mountNav(renderSetNav({ items }));
    const nav = root.querySelector("set-nav") as HTMLElement;

    expect(nav.hasAttribute("id")).toBe(false);
  });

  it("throws on a syntactically invalid id", () => {
    expect(() => renderSetNav({ id: "not valid", items })).toThrow();
  });
});

describe("defineSetNav", () => {
  it("does not inject an expander when nav is not collapsible", () => {
    const root = mountNav(renderSetNav({ items }));

    defineSetNav();

    expect(root.querySelector('[data-part="expander"]')).toBeNull();
    expect(isRootLocked()).toBe(false);
  });

  it("upgrades collapsible nav with an expander button and closed state", () => {
    const root = mountNav(
      renderSetNav({
        collapsible: "belowTablet",
        contentId: "primary-nav-content",
        items,
      }),
    );

    defineSetNav();

    const button = getByRole(root, "button", { name: "Menu" });

    expect(root.querySelector('[data-part="expander"]')).not.toBeNull();
    expect(button.getAttribute("aria-expanded")).toBe("false");
  });

  it("wires aria-controls when contentId is provided", () => {
    const root = mountNav(
      renderSetNav({
        collapsible: "always",
        contentId: "primary-nav-content",
        items,
      }),
    );

    defineSetNav();

    const button = getByRole(root, "button", { name: "Menu" });
    const content = root.querySelector(".content") as HTMLElement;

    expect(content.id).toBe("primary-nav-content");
    expect(button.getAttribute("aria-controls")).toBe("primary-nav-content");
  });

  it("toggles collapsible nav content on button click", async () => {
    const user = userEvent.setup();
    const root = mountNav(
      renderSetNav({
        collapsible: "always",
        contentId: "primary-nav-content",
        items,
      }),
    );

    defineSetNav();

    const button = getByRole(root, "button", { name: "Menu" });

    await user.click(button);

    expect(button.getAttribute("aria-expanded")).toBe("true");
    expect(isRootLocked()).toBe(true);

    await user.click(button);

    expect(button.getAttribute("aria-expanded")).toBe("false");
    expect(isRootLocked()).toBe(false);
  });

  it("closes expanded nav on Escape", async () => {
    const user = userEvent.setup();
    const root = mountNav(
      renderSetNav({
        collapsible: "always",
        contentId: "primary-nav-content",
        items,
      }),
    );

    defineSetNav();

    const button = getByRole(root, "button", { name: "Menu" });

    await user.click(button);
    await user.keyboard("{Escape}");

    expect(button.getAttribute("aria-expanded")).toBe("false");
    expect(isRootLocked()).toBe(false);
  });
});

describeSpecConsistency<SetNavProps>({
  baseProps: { items },
  propOverrides: {
    collapsible: { contentId: "nav-content" },
  },
  renderer: renderSetNav,
  spec: SET_NAV_SPEC,
});

function isRootLocked(): boolean {
  return document.documentElement.hasAttribute("data-set-scroll-locked");
}
