import { describe, expect, it } from "vitest";

import { describeSpecConsistency } from "../../test/spec";
import { renderSetBadge, SET_BADGE_SPEC } from "./badge";

function mountBadge(html: string): HTMLElement {
  document.body.innerHTML = `<div class="set">${html}</div>`;
  return document.body.querySelector(".set") as HTMLElement;
}

describe("renderSetBadge", () => {
  it("renders a span badge with escaped text by default", () => {
    const root = mountBadge(
      renderSetBadge({ label: `<strong>Badge</strong>` }),
    );
    const badge = root.querySelector(".set-badge") as HTMLElement;

    expect(badge).toBeTruthy();
    expect(badge.tagName).toBe("SPAN");
    expect(badge.innerHTML).toBe("&lt;strong&gt;Badge&lt;/strong&gt;");
    expect(badge.hasAttribute("data-floating")).toBe(false);
    expect(badge.getAttribute("data-size")).toBe("md");
    expect(badge.hasAttribute("data-tone")).toBe(false);
  });

  it("emits data-tone for non-default tones", () => {
    const root = mountBadge(
      renderSetBadge({ label: "Pending", tone: "pending" }),
    );
    const badge = root.querySelector(".set-badge") as HTMLElement;

    expect(badge.getAttribute("data-tone")).toBe("pending");
  });

  it("emits data-floating only when true", () => {
    const floatingRoot = mountBadge(
      renderSetBadge({ floating: true, label: "1" }),
    );
    const floatingBadge = floatingRoot.querySelector(
      ".set-badge",
    ) as HTMLElement;

    expect(floatingBadge.hasAttribute("data-floating")).toBe(true);

    const defaultRoot = mountBadge(renderSetBadge({ label: "1" }));
    const defaultBadge = defaultRoot.querySelector(".set-badge") as HTMLElement;
    expect(defaultBadge.hasAttribute("data-floating")).toBe(false);
  });

  it("always emits data-size", () => {
    const smallRoot = mountBadge(
      renderSetBadge({ label: "Badge", size: "sm" }),
    );
    const smallBadge = smallRoot.querySelector(".set-badge") as HTMLElement;
    expect(smallBadge.getAttribute("data-size")).toBe("sm");

    const defaultRoot = mountBadge(renderSetBadge({ label: "Badge" }));
    const defaultBadge = defaultRoot.querySelector(".set-badge") as HTMLElement;
    expect(defaultBadge.getAttribute("data-size")).toBe("md");
  });

  it("renders consumer-provided id on the host", () => {
    const root = mountBadge(renderSetBadge({ id: "my-badge", label: "Badge" }));
    const badge = root.querySelector(".set-badge") as HTMLElement;

    expect(badge.id).toBe("my-badge");
  });

  it("omits id when not provided", () => {
    const root = mountBadge(renderSetBadge({ label: "Badge" }));
    const badge = root.querySelector(".set-badge") as HTMLElement;

    expect(badge.hasAttribute("id")).toBe(false);
  });

  it("throws on a syntactically invalid id", () => {
    expect(() => renderSetBadge({ id: "not valid", label: "Badge" })).toThrow();
  });
});

describeSpecConsistency({
  baseProps: { label: "Badge" },
  renderer: renderSetBadge,
  spec: SET_BADGE_SPEC,
});
