import mnsp from "@monospaced/set-tokens/react-native/mnsp";
import { describe, expect, it } from "vitest";

import { render } from "../../test/render";
import { Icon, ICON_NAMES } from "./icon";

const svg = (container: HTMLElement): SVGElement => {
  const el = container.querySelector("svg");
  if (!el) throw new Error("no svg rendered");
  return el;
};

describe("Icon", () => {
  it("renders a decorative icon by default", () => {
    const { container, unmount } = render(<Icon name="check-circle" />);
    const el = svg(container);

    expect(el.getAttribute("aria-hidden")).toBe("true");
    expect(el.getAttribute("role")).toBeNull();
    expect(el.getAttribute("aria-label")).toBeNull();
    expect(el.querySelector("path")).not.toBeNull();
    unmount();
  });

  it("sizes from the icon tokens", () => {
    const { container, unmount } = render(<Icon name="search" size="lg" />);

    expect(svg(container).getAttribute("width")).toBe(
      String(mnsp.static.layout.icon.size.lg),
    );
    unmount();
  });

  it("labels a named icon", () => {
    const { container, unmount } = render(
      <Icon aria-hidden={false} name="search" title="Search" />,
    );
    const el = svg(container);

    expect(el.getAttribute("role")).toBe("img");
    expect(el.getAttribute("aria-label")).toBe("Search");
    unmount();
  });

  it("requires a title when not hidden", () => {
    expect(() => render(<Icon aria-hidden={false} name="search" />)).toThrow(
      /title must be non-empty/,
    );
  });

  it("rejects unknown names", () => {
    expect(() =>
      render(<Icon name={"nope" as (typeof ICON_NAMES)[number]} />),
    ).toThrow(/Unknown icon name/);
  });

  it("renders every icon in the registry", () => {
    for (const name of ICON_NAMES) {
      const { container, unmount } = render(<Icon name={name} />);
      expect(svg(container)).not.toBeNull();
      unmount();
    }
  });
});
