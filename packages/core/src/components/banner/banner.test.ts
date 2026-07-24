import { getByRole, queryByRole } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { describeSpecConsistency } from "../../test/spec";
import {
  defineSetBanner,
  renderSetBanner,
  SET_BANNER_EVENT_BEFORE_DISMISS,
  SET_BANNER_EVENT_DISMISS,
  SET_BANNER_SPEC,
  SET_BANNER_TAG_NAME,
  type SetBannerProps,
} from "./banner";

function mountBanner(html: string): HTMLElement {
  document.body.innerHTML = `<div class="set">${html}</div>`;
  return document.body.querySelector(".set") as HTMLElement;
}

defineSetBanner();

describe("renderSetBanner", () => {
  it("renders the default banner contract", () => {
    const root = mountBanner(renderSetBanner({ message: "Body copy" }));
    const banner = root.querySelector(SET_BANNER_TAG_NAME) as HTMLElement;

    expect(banner.tagName).toBe("SET-BANNER");
    expect(banner.className).toBe("set-banner");
    expect(banner.hasAttribute("data-tone")).toBe(false);
    expect(banner.hasAttribute("role")).toBe(false);
    expect(banner.hasAttribute("data-dismissible")).toBe(true);
    expect(banner.getAttribute("data-dismissible-label")).toBe(
      "Dismiss banner",
    );
    expect(banner.querySelector(".message")?.textContent?.trim()).toBe(
      "Body copy",
    );
    expect(banner.querySelector(".set-link")).toBeNull();
    expect(
      getByRole(root, "button", { name: "Dismiss banner" }),
    ).not.toBeNull();
  });

  it("renders an action link when provided", () => {
    const root = mountBanner(
      renderSetBanner({
        actionHref: "/docs",
        actionLabel: "Learn more",
        message: "Body copy",
      }),
    );

    const action = getByRole(root, "link", { name: "Learn more" });
    expect(action.getAttribute("href")).toBe("/docs");
    expect(action.classList.contains("set-link")).toBe(true);
  });

  it("throws when actionHref and actionLabel are not provided together", () => {
    expect(() =>
      renderSetBanner({ actionHref: "/docs", message: "Body copy" }),
    ).toThrow("actionHref and actionLabel must be provided together.");
    expect(() =>
      renderSetBanner({ actionLabel: "Learn more", message: "Body copy" }),
    ).toThrow("actionHref and actionLabel must be provided together.");
  });

  it("renders dismissible attributes and tone when provided", () => {
    const root = mountBanner(
      renderSetBanner({
        dismissible: true,
        dismissibleLabel: "Close banner",
        message: "Body copy",
        tone: "error",
      }),
    );
    const banner = root.querySelector(SET_BANNER_TAG_NAME) as HTMLElement;

    expect(banner.getAttribute("data-tone")).toBe("error");
    expect(banner.hasAttribute("data-dismissible")).toBe(true);
    expect(banner.getAttribute("data-dismissible-label")).toBe("Close banner");
  });

  it("renders consumer-provided id on the host", () => {
    const root = mountBanner(
      renderSetBanner({ id: "my-banner", message: "Body copy" }),
    );
    const banner = root.querySelector(SET_BANNER_TAG_NAME) as HTMLElement;

    expect(banner.id).toBe("my-banner");
  });

  it("omits id when not provided", () => {
    const root = mountBanner(renderSetBanner({ message: "Body copy" }));
    const banner = root.querySelector(SET_BANNER_TAG_NAME) as HTMLElement;

    expect(banner.hasAttribute("id")).toBe(false);
  });

  it("throws on a syntactically invalid id", () => {
    expect(() =>
      renderSetBanner({ id: "not valid", message: "Body copy" }),
    ).toThrow();
  });

  it("escapes message text content", () => {
    const root = mountBanner(
      renderSetBanner({
        message: 'Body <em>copy</em> <a href="/docs">docs</a>',
      }),
    );

    expect(root.querySelector(".message em")).toBeNull();
    expect(root.querySelector(".message .set-link")).toBeNull();
    expect(root.querySelector(".message")?.innerHTML).toContain("&lt;em&gt;");
  });

  it("escapes action label text", () => {
    const root = mountBanner(
      renderSetBanner({
        actionHref: "/docs",
        actionLabel: "<strong>Learn more</strong>",
        message: "Body copy",
      }),
    );

    const action = root.querySelector(".set-link") as HTMLElement;
    expect(action.innerHTML).toContain(
      "&lt;strong&gt;Learn more&lt;/strong&gt;",
    );
    expect(action.querySelector("strong")).toBeNull();
  });
});

describe("defineSetBanner", () => {
  it("upgrades dismissible SSR markup with a dismiss control", () => {
    const root = mountBanner(
      renderSetBanner({ dismissible: true, message: "Body copy" }),
    );

    expect(
      getByRole(root, "button", { name: "Dismiss banner" }),
    ).not.toBeNull();
  });

  it("uses a custom dismiss label when provided", () => {
    const root = mountBanner(
      renderSetBanner({
        dismissible: true,
        dismissibleLabel: "Close banner",
        message: "Body copy",
      }),
    );

    expect(getByRole(root, "button", { name: "Close banner" })).not.toBeNull();
  });

  it("falls back to the default dismiss label when provided as an empty string", () => {
    const root = mountBanner(
      renderSetBanner({
        dismissible: true,
        dismissibleLabel: "",
        message: "Body copy",
      }),
    );
    const banner = root.querySelector(SET_BANNER_TAG_NAME) as HTMLElement;

    expect(banner.getAttribute("data-dismissible-label")).toBe(
      "Dismiss banner",
    );
    expect(
      getByRole(root, "button", { name: "Dismiss banner" }),
    ).not.toBeNull();
  });

  it("removes the banner when the dismiss control is clicked", async () => {
    const user = userEvent.setup();
    const root = mountBanner(
      renderSetBanner({ dismissible: true, message: "Body copy" }),
    );

    await user.click(getByRole(root, "button", { name: "Dismiss banner" }));

    expect(root.querySelector(SET_BANNER_TAG_NAME)).toBeNull();
  });

  it("dispatches a cancelable before-dismiss event and a dismiss event", async () => {
    const user = userEvent.setup();
    const root = mountBanner(
      renderSetBanner({ dismissible: true, message: "Body copy" }),
    );
    const banner = root.querySelector(SET_BANNER_TAG_NAME) as HTMLElement;

    const received: string[] = [];
    root.addEventListener(SET_BANNER_EVENT_BEFORE_DISMISS, () => {
      received.push(SET_BANNER_EVENT_BEFORE_DISMISS);
    });
    root.addEventListener(SET_BANNER_EVENT_DISMISS, () => {
      expect(root.querySelector(SET_BANNER_TAG_NAME)).toBe(banner);
      received.push(SET_BANNER_EVENT_DISMISS);
    });

    await user.click(getByRole(root, "button", { name: "Dismiss banner" }));

    expect(received).toEqual([
      SET_BANNER_EVENT_BEFORE_DISMISS,
      SET_BANNER_EVENT_DISMISS,
    ]);
    expect(root.querySelector(SET_BANNER_TAG_NAME)).toBeNull();
  });

  it("does not remove the banner when before-dismiss is prevented", async () => {
    const user = userEvent.setup();
    const root = mountBanner(
      renderSetBanner({ dismissible: true, message: "Body copy" }),
    );
    const banner = root.querySelector(SET_BANNER_TAG_NAME) as HTMLElement;

    let dismissFired = false;
    banner.addEventListener(SET_BANNER_EVENT_BEFORE_DISMISS, (event) => {
      event.preventDefault();
    });
    banner.addEventListener(SET_BANNER_EVENT_DISMISS, () => {
      dismissFired = true;
    });

    await user.click(getByRole(root, "button", { name: "Dismiss banner" }));

    expect(root.querySelector(SET_BANNER_TAG_NAME)).toBe(banner);
    expect(dismissFired).toBe(false);
  });

  it("does not inject a dismiss control when dismissible is false", () => {
    const root = mountBanner(
      renderSetBanner({ dismissible: false, message: "Body copy" }),
    );

    expect(queryByRole(root, "button")).toBeNull();
  });
});

describeSpecConsistency<SetBannerProps>({
  baseProps: { message: "Body copy" },
  propOverrides: {
    actionHref: { actionLabel: "Learn more" },
    actionLabel: { actionHref: "/docs" },
  },
  renderer: renderSetBanner,
  spec: SET_BANNER_SPEC,
});
