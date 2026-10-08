import { describe, expect, it } from "vitest";

import { render } from "../../test/render";
import { Avatar } from "./avatar";
import { getInitials } from "./get-initials";

const avatar = (container: HTMLElement): HTMLElement => {
  const el = container.querySelector('[role="img"]');
  if (!(el instanceof HTMLElement)) throw new Error("no avatar rendered");
  return el;
};

describe("Avatar", () => {
  it("labels itself from name and derives initials", () => {
    const { container, unmount } = render(<Avatar name="Ada Lovelace" />);
    const el = avatar(container);

    expect(el.getAttribute("aria-label")).toBe("Ada Lovelace");
    expect(el.textContent).toBe("AL");
    unmount();
  });

  it("prefers explicit initials and alt", () => {
    const { container, unmount } = render(
      <Avatar alt="Profile" initials="xy" name="Ada Lovelace" />,
    );
    const el = avatar(container);

    expect(el.getAttribute("aria-label")).toBe("Profile");
    expect(el.textContent).toBe("xy");
    unmount();
  });

  it("renders an image instead of initials when src is given", () => {
    const { container, unmount } = render(
      <Avatar name="Ada Lovelace" src="https://example.com/a.png" />,
    );

    expect(avatar(container).textContent).toBe("");
    expect(container.querySelector("img, [role='img'] div")).not.toBeNull();
    unmount();
  });

  it("can be hidden from assistive technology", () => {
    const { container, unmount } = render(
      <Avatar aria-hidden name="Ada Lovelace" testID="a" />,
    );

    expect(container.querySelector('[role="img"]')).toBeNull();
    expect(
      container.querySelector('[data-testid="a"]')?.getAttribute("aria-hidden"),
    ).toBe("true");
    unmount();
  });

  it("falls back to the entity icon", () => {
    const { container, unmount } = render(<Avatar entity="bot" />);
    const el = avatar(container);

    expect(el.getAttribute("aria-label")).toBe("Avatar");
    expect(el.querySelector("svg")).not.toBeNull();
    unmount();
  });

  it("rejects non-alphabetic initials", () => {
    expect(() => render(<Avatar initials="A1" />)).toThrow(/alphabetic/);
  });
});

describe("getInitials", () => {
  it.each([
    ["Ada", "A"],
    ["Ada Lovelace", "AL"],
    ["Alexandria Ocasio-Cortez", "AOC"],
    ["Ludwig van Beethoven", "Lv"],
    ["John Ronald Reuel Tolkien", "JT"],
    ["Jean-Luc Picard", "JP"],
    ["  ", undefined],
    ["李 小龍", undefined],
  ])("%s → %s", (name, expected) => {
    expect(getInitials(name)).toBe(expected);
  });
});
