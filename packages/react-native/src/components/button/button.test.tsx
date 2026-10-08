import mnsp from "@monospaced/set-tokens/react-native/mnsp";
import { act } from "react";
import { describe, expect, it, vi } from "vitest";

import { render } from "../../test/render";
import { Button } from "./button";

const button = (container: HTMLElement): HTMLElement => {
  const el = container.querySelector('[role="button"]');
  if (!(el instanceof HTMLElement)) throw new Error("no button rendered");
  return el;
};

describe("Button", () => {
  it("renders the label as an accessible button", () => {
    const { container, unmount } = render(<Button label="Save" />);
    const el = button(container);

    expect(el.textContent).toBe("Save");
    expect(el.getAttribute("aria-label")).toBe("Save");
    expect(el.getAttribute("aria-disabled")).toBeNull();
    unmount();
  });

  it("fires onPress", () => {
    const onPress = vi.fn();
    const { container, unmount } = render(
      <Button label="Save" onPress={onPress} />,
    );

    act(() => {
      button(container).click();
    });
    expect(onPress).toHaveBeenCalledTimes(1);
    unmount();
  });

  it("exposes disabled state and blocks presses", () => {
    const onPress = vi.fn();
    const { container, unmount } = render(
      <Button disabled label="Save" onPress={onPress} />,
    );
    const el = button(container);

    expect(el.getAttribute("aria-disabled")).toBe("true");
    act(() => {
      el.click();
    });
    expect(onPress).not.toHaveBeenCalled();
    unmount();
  });

  it("renders an icon beside the label", () => {
    const { container, unmount } = render(
      <Button icon="search" label="Search" />,
    );
    const el = button(container);

    expect(el.querySelector("svg")).not.toBeNull();
    expect(el.textContent).toBe("Search");
    unmount();
  });

  it("keeps the accessible name when the label is hidden", () => {
    const { container, unmount } = render(
      <Button icon="search" label="Search" labelVisibility="hidden" />,
    );
    const el = button(container);

    expect(el.textContent).toBe("");
    expect(el.getAttribute("aria-label")).toBe("Search");
    unmount();
  });

  it("hides the label below tablet only in the baseline size context", () => {
    const baseline = render(
      <Button
        icon="search"
        label="Search"
        labelVisibility="hiddenBelowTablet"
      />,
    );
    expect(button(baseline.container).textContent).toBe("");
    baseline.unmount();

    const tablet = render(
      <Button
        icon="search"
        label="Search"
        labelVisibility="hiddenBelowTablet"
      />,
      { size: "tablet" },
    );
    expect(button(tablet.container).textContent).toBe("Search");
    tablet.unmount();
  });

  it("requires an icon to hide the label", () => {
    expect(() =>
      render(<Button label="Search" labelVisibility="hidden" />),
    ).toThrow(/requires icon/);
  });

  it("paints solid appearance with the interactive colour", () => {
    const { container, unmount } = render(
      <Button appearance="solid" label="Save" />,
    );
    const { backgroundColor } = getComputedStyle(button(container));

    expect(backgroundColor).toBe(
      hexToRgb(mnsp.theme.light.default.color.interactive.default),
    );
    unmount();
  });

  it("follows the dark scheme when the provider pins it", () => {
    const { container, unmount } = render(
      <Button appearance="solid" label="Save" />,
      { colorScheme: "dark" },
    );
    const { backgroundColor } = getComputedStyle(button(container));

    expect(backgroundColor).toBe(
      hexToRgb(mnsp.theme.dark.default.color.interactive.default),
    );
    unmount();
  });
});

function hexToRgb(hex: string): string {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  return `rgb(${r}, ${g}, ${b})`;
}
