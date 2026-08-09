import { beforeEach, describe, expect, it } from "vitest";

import { describeSpecConsistency } from "../../test/spec";
import { renderSetIcon, type SetIconName } from "../icon/icon";
import {
  defineSetLightswitch,
  renderSetLightswitch,
  SET_LIGHTSWITCH_EVENT_CHANGE,
  SET_LIGHTSWITCH_SPEC,
  SET_LIGHTSWITCH_STORAGE_KEY,
  type SetLightswitchProps,
} from "./lightswitch";

function mountLightswitch(html: string, rootAttributes = ""): HTMLElement {
  document.body.innerHTML = `<div class="set"${rootAttributes ? ` ${rootAttributes}` : ""}>${html}</div>`;
  return document.body.querySelector(".set") as HTMLElement;
}

function getButton(root: HTMLElement): HTMLButtonElement {
  const button = root.querySelector("button");
  expect(button).toBeTruthy();
  return button as HTMLButtonElement;
}

function getOption(root: HTMLElement, target: "light" | "dark"): HTMLElement {
  const option = root.querySelector(`.option[data-option="${target}"]`);
  expect(option).toBeTruthy();
  return option as HTMLElement;
}

function getOptionLabel(root: HTMLElement, target: "light" | "dark"): string {
  return getOption(root, target).querySelector(".label")?.textContent ?? "";
}

function iconPath(name: SetIconName): string {
  const probe = document.createElement("div");
  probe.innerHTML = renderSetIcon({ ariaHidden: true, name, size: "fill" });
  return probe.querySelector("path")?.getAttribute("d") ?? "";
}

function getOptionIconPath(
  root: HTMLElement,
  target: "light" | "dark",
): string {
  return (
    getOption(root, target).querySelector("svg path")?.getAttribute("d") ??
    "missing"
  );
}

describe("renderSetLightswitch", () => {
  it("renders an icon-only toggle button", () => {
    const root = mountLightswitch(renderSetLightswitch({}));
    const button = getButton(root);

    expect(button.classList.contains("toggle")).toBe(true);
    expect(button.getAttribute("data-appearance")).toBe("text");
    expect(button.getAttribute("data-size")).toBe("md");
    expect(button.getAttribute("type")).toBe("button");
  });

  it("renders both actions: moon to switch to dark, sun to switch to light", () => {
    const root = mountLightswitch(renderSetLightswitch({}));

    expect(getOptionIconPath(root, "dark")).toBe(iconPath("moon"));
    expect(getOptionLabel(root, "dark")).toBe("Switch to dark theme");
    expect(getOptionIconPath(root, "light")).toBe(iconPath("sunny"));
    expect(getOptionLabel(root, "light")).toBe("Switch to light theme");
  });

  it("renders custom labels", () => {
    const root = mountLightswitch(
      renderSetLightswitch({ labelDark: "Go dark", labelLight: "Go light" }),
    );

    expect(getOptionLabel(root, "dark")).toBe("Go dark");
    expect(getOptionLabel(root, "light")).toBe("Go light");
  });

  it("falls back to default labels when blank", () => {
    const root = mountLightswitch(
      renderSetLightswitch({ labelDark: "  ", labelLight: "  " }),
    );

    expect(getOptionLabel(root, "dark")).toBe("Switch to dark theme");
    expect(getOptionLabel(root, "light")).toBe("Switch to light theme");
  });

  it("renders consumer-provided id on the host", () => {
    const root = mountLightswitch(
      renderSetLightswitch({ id: "my-lightswitch" }),
    );
    const host = root.querySelector(".set-lightswitch") as HTMLElement;

    expect(host.id).toBe("my-lightswitch");
  });

  it("throws on a syntactically invalid id", () => {
    expect(() => renderSetLightswitch({ id: "not valid" })).toThrow();
  });
});

let mediaQueryMatches = false;

Object.defineProperty(document.defaultView ?? window, "matchMedia", {
  configurable: true,
  value: (query: string) => ({
    addEventListener: () => {},
    get matches() {
      return mediaQueryMatches;
    },
    media: query,
    removeEventListener: () => {},
  }),
});

beforeEach(() => {
  mediaQueryMatches = false;
  localStorage.clear();
});

describe("defineSetLightswitch", () => {
  beforeEach(() => {
    defineSetLightswitch();
  });

  it("registers the custom element and tolerates repeat definition", () => {
    expect(customElements.get("set-lightswitch")).toBeTruthy();
    expect(() => defineSetLightswitch()).not.toThrow();
  });

  it("leaves the root alone on connect when nothing is stored", () => {
    mediaQueryMatches = true;
    const root = mountLightswitch(renderSetLightswitch({}));

    expect(root.hasAttribute("data-set-theme")).toBe(false);
  });

  it("applies a stored override to the root on connect", () => {
    localStorage.setItem(SET_LIGHTSWITCH_STORAGE_KEY, "dark");
    const root = mountLightswitch(renderSetLightswitch({}));

    expect(root.getAttribute("data-set-theme")).toBe("dark");
  });

  it("stores an override when toggling away from the system preference", () => {
    const root = mountLightswitch(renderSetLightswitch({}));

    getButton(root).click();

    expect(localStorage.getItem(SET_LIGHTSWITCH_STORAGE_KEY)).toBe("dark");
    expect(root.getAttribute("data-set-theme")).toBe("dark");
  });

  it("clears the override when toggling back to the system preference", () => {
    const root = mountLightswitch(renderSetLightswitch({}));
    const button = getButton(root);

    button.click();
    button.click();

    expect(localStorage.getItem(SET_LIGHTSWITCH_STORAGE_KEY)).toBe(null);
    expect(root.hasAttribute("data-set-theme")).toBe(false);
  });

  it("stores a light override under a dark system preference", () => {
    mediaQueryMatches = true;
    const root = mountLightswitch(renderSetLightswitch({}));

    getButton(root).click();

    expect(localStorage.getItem(SET_LIGHTSWITCH_STORAGE_KEY)).toBe("light");
    expect(root.getAttribute("data-set-theme")).toBe("light");
  });

  it("resolves an author-set root theme and can release it to auto", () => {
    const root = mountLightswitch(
      renderSetLightswitch({}),
      'data-set-theme="dark"',
    );

    getButton(root).click();

    expect(localStorage.getItem(SET_LIGHTSWITCH_STORAGE_KEY)).toBe(null);
    expect(root.hasAttribute("data-set-theme")).toBe(false);
  });

  it("never rewrites a stored override when the system preference changes", () => {
    localStorage.setItem(SET_LIGHTSWITCH_STORAGE_KEY, "dark");
    const root = mountLightswitch(renderSetLightswitch({}));

    mediaQueryMatches = true;

    expect(localStorage.getItem(SET_LIGHTSWITCH_STORAGE_KEY)).toBe("dark");
    expect(root.getAttribute("data-set-theme")).toBe("dark");
  });

  it("keeps both actions in the DOM across toggles", () => {
    const root = mountLightswitch(renderSetLightswitch({}));
    const button = getButton(root);

    button.click();
    button.click();

    expect(getOptionIconPath(root, "dark")).toBe(iconPath("moon"));
    expect(getOptionIconPath(root, "light")).toBe(iconPath("sunny"));
  });

  it("dispatches a change event describing the applied theme", () => {
    const root = mountLightswitch(renderSetLightswitch({}));
    const details: Array<{ stored: boolean; theme: string }> = [];
    root.addEventListener(SET_LIGHTSWITCH_EVENT_CHANGE, (event) => {
      details.push((event as CustomEvent).detail);
    });
    const button = getButton(root);

    button.click();
    button.click();

    expect(details).toEqual([
      { stored: true, theme: "dark" },
      { stored: false, theme: "light" },
    ]);
  });
});

describeSpecConsistency<SetLightswitchProps>({
  baseProps: {},
  renderer: renderSetLightswitch,
  spec: SET_LIGHTSWITCH_SPEC,
});
