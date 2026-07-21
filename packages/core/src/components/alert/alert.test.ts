import { getByRole, queryByRole } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { describeSpecConsistency } from "../../test/spec";
import {
  SET_ALERT_EVENT_BEFORE_DISMISS,
  SET_ALERT_EVENT_DISMISS,
  SET_ALERT_SPEC,
  SET_ALERT_TAG_NAME,
  type SetAlertProps,
  defineSetAlert,
  renderSetAlert,
} from "./alert";

function mountAlert(html: string): HTMLElement {
  document.body.innerHTML = `<div class="set">${html}</div>`;
  return document.body.querySelector(".set") as HTMLElement;
}

defineSetAlert();

describe("renderSetAlert", () => {
  it("renders the default alert contract", () => {
    const root = mountAlert(renderSetAlert({ message: "Body copy" }));
    const alert = root.querySelector(SET_ALERT_TAG_NAME) as HTMLElement;

    expect(alert.tagName).toBe("SET-ALERT");
    expect(alert.className).toBe("set-alert");
    expect(alert.hasAttribute("data-tone")).toBe(false);
    expect(alert.getAttribute("role")).toBe("status");
    expect(alert.hasAttribute("data-dismissible")).toBe(false);
    expect(alert.hasAttribute("data-inline-size")).toBe(false);
    expect(alert.querySelector(".icon-wrapper .set-icon")).not.toBeNull();
    expect(alert.querySelector(".title")).toBeNull();
    expect(alert.querySelector(".message")?.textContent).toBe("Body copy");
  });

  it("renders an optional title and dismissible attributes", () => {
    const root = mountAlert(
      renderSetAlert({
        dismissible: true,
        dismissibleLabel: "Close message",
        message: "Body copy",
        title: "Alert title",
        tone: "error",
      }),
    );
    const alert = root.querySelector(SET_ALERT_TAG_NAME) as HTMLElement;

    expect(alert.querySelector(".title")?.textContent).toBe("Alert title");
    expect(alert.getAttribute("data-tone")).toBe("error");
    expect(alert.getAttribute("role")).toBe("alert");
    expect(alert.hasAttribute("data-dismissible")).toBe(true);
    expect(alert.getAttribute("data-dismissible-label")).toBe("Close message");
  });

  it("emits data-inline-size when inlineSize is fit", () => {
    const root = mountAlert(
      renderSetAlert({ inlineSize: "fit", message: "Body copy" }),
    );
    const alert = root.querySelector(SET_ALERT_TAG_NAME) as HTMLElement;

    expect(alert.getAttribute("data-inline-size")).toBe("fit");
  });

  it("escapes title and message", () => {
    const root = mountAlert(
      renderSetAlert({
        message: "<img src=x onerror=alert(1)>",
        title: "<strong>boom</strong>",
      }),
    );

    const title = root.querySelector(".title") as HTMLElement;
    const message = root.querySelector(".message") as HTMLElement;

    expect(title.innerHTML).toBe("&lt;strong&gt;boom&lt;/strong&gt;");
    expect(message.innerHTML).toBe("&lt;img src=x onerror=alert(1)&gt;");
    expect(root.querySelector("strong")).toBeNull();
    expect(root.querySelector("img")).toBeNull();
  });

  it("renders consumer-provided id on the host", () => {
    const root = mountAlert(
      renderSetAlert({ id: "my-alert", message: "Body copy" }),
    );
    const alert = root.querySelector(SET_ALERT_TAG_NAME) as HTMLElement;

    expect(alert.id).toBe("my-alert");
  });

  it("omits id when not provided", () => {
    const root = mountAlert(renderSetAlert({ message: "Body copy" }));
    const alert = root.querySelector(SET_ALERT_TAG_NAME) as HTMLElement;

    expect(alert.hasAttribute("id")).toBe(false);
  });

  it("throws on a syntactically invalid id", () => {
    expect(() =>
      renderSetAlert({ id: "not valid", message: "Body copy" }),
    ).toThrow();
  });
});

describe("defineSetAlert", () => {
  it("upgrades dismissible SSR markup with a dismiss control", () => {
    const root = mountAlert(
      renderSetAlert({ dismissible: true, message: "Body copy" }),
    );

    expect(getByRole(root, "button", { name: "Dismiss alert" })).not.toBeNull();
  });

  it("uses a custom dismiss label when provided", () => {
    const root = mountAlert(
      renderSetAlert({
        dismissible: true,
        dismissibleLabel: "Close message",
        message: "Body copy",
      }),
    );

    expect(getByRole(root, "button", { name: "Close message" })).not.toBeNull();
  });

  it("falls back to the default dismiss label when provided as an empty string", () => {
    const root = mountAlert(
      renderSetAlert({
        dismissible: true,
        dismissibleLabel: "",
        message: "Body copy",
      }),
    );

    const alert = root.querySelector(SET_ALERT_TAG_NAME) as HTMLElement;

    expect(alert.getAttribute("data-dismissible-label")).toBe("Dismiss alert");
    expect(getByRole(root, "button", { name: "Dismiss alert" })).not.toBeNull();
  });

  it("removes the alert when the dismiss control is clicked", async () => {
    const user = userEvent.setup();
    const root = mountAlert(
      renderSetAlert({ dismissible: true, message: "Body copy" }),
    );

    await user.click(getByRole(root, "button", { name: "Dismiss alert" }));

    expect(root.querySelector(SET_ALERT_TAG_NAME)).toBeNull();
  });

  it("dispatches a cancelable before-dismiss event and a dismiss event", async () => {
    const user = userEvent.setup();
    const root = mountAlert(
      renderSetAlert({ dismissible: true, message: "Body copy" }),
    );
    const alert = root.querySelector(SET_ALERT_TAG_NAME) as HTMLElement;

    const received: string[] = [];
    root.addEventListener(SET_ALERT_EVENT_BEFORE_DISMISS, () => {
      received.push(SET_ALERT_EVENT_BEFORE_DISMISS);
    });
    root.addEventListener(SET_ALERT_EVENT_DISMISS, () => {
      expect(root.querySelector(SET_ALERT_TAG_NAME)).toBe(alert);
      received.push(SET_ALERT_EVENT_DISMISS);
    });

    await user.click(getByRole(root, "button", { name: "Dismiss alert" }));

    expect(received).toEqual([
      SET_ALERT_EVENT_BEFORE_DISMISS,
      SET_ALERT_EVENT_DISMISS,
    ]);
    expect(root.querySelector(SET_ALERT_TAG_NAME)).toBeNull();
  });

  it("does not remove the alert when before-dismiss is prevented", async () => {
    const user = userEvent.setup();
    const root = mountAlert(
      renderSetAlert({ dismissible: true, message: "Body copy" }),
    );
    const alert = root.querySelector(SET_ALERT_TAG_NAME) as HTMLElement;

    let dismissFired = false;
    alert.addEventListener(SET_ALERT_EVENT_BEFORE_DISMISS, (event) => {
      event.preventDefault();
    });
    alert.addEventListener(SET_ALERT_EVENT_DISMISS, () => {
      dismissFired = true;
    });

    await user.click(getByRole(root, "button", { name: "Dismiss alert" }));

    expect(root.querySelector(SET_ALERT_TAG_NAME)).toBe(alert);
    expect(dismissFired).toBe(false);
  });

  it("does not inject a dismiss control for non-dismissible alerts", () => {
    const root = mountAlert(renderSetAlert({ message: "Body copy" }));

    expect(queryByRole(root, "button")).toBeNull();
  });
});

describeSpecConsistency<SetAlertProps>({
  baseProps: { message: "Body copy" },
  renderer: renderSetAlert,
  spec: SET_ALERT_SPEC,
});
