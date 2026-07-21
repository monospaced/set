import { describe, expect, it } from "vitest";

import { describeSpecConsistency } from "../../test/spec";
import {
  SET_AVATAR_SPEC,
  type SetAvatarProps,
  renderSetAvatar,
} from "./avatar";

function mountAvatar(html: string): HTMLElement {
  document.body.innerHTML = `<div class="set">${html}</div>`;
  return document.body.querySelector(".set") as HTMLElement;
}

function getAvatar(root: HTMLElement): HTMLElement {
  const avatar = root.querySelector(".set-avatar");
  expect(avatar).toBeTruthy();
  return avatar as HTMLElement;
}

describe("renderSetAvatar", () => {
  it("renders settled defaults", () => {
    const root = mountAvatar(renderSetAvatar({}));
    const avatar = getAvatar(root);

    expect(avatar.tagName).toBe("SPAN");
    expect(avatar.getAttribute("data-size")).toBe("md");
    expect(avatar.hasAttribute("data-color")).toBe(false);
    expect(avatar.hasAttribute("data-entity")).toBe(false);
    expect(avatar.getAttribute("role")).toBe("img");
    expect(avatar.getAttribute("aria-label")).toBe("Avatar");
    expect(root.querySelector(".icon-wrapper")).toBeTruthy();
  });

  it("emits non-default color and omits neutral color", () => {
    const explicit = mountAvatar(renderSetAvatar({ color: "05" }));
    expect(getAvatar(explicit).getAttribute("data-color")).toBe("05");

    const neutral = mountAvatar(renderSetAvatar({ color: "neutral" }));
    expect(getAvatar(neutral).hasAttribute("data-color")).toBe(false);
  });

  it("hash-derives deterministic non-neutral color from name", () => {
    const first = mountAvatar(renderSetAvatar({ name: "Jane Smith" }));
    const second = mountAvatar(renderSetAvatar({ name: "Jane Smith" }));

    const firstColor = getAvatar(first).getAttribute("data-color");
    const secondColor = getAvatar(second).getAttribute("data-color");

    expect(firstColor).toBe(secondColor);
    expect(["01", "02", "03", "04", "05", "06", "07", "08", "09"]).toContain(
      firstColor,
    );
  });

  it("respects variant precedence: src > initials > name-derived initials > icon", () => {
    const image = mountAvatar(
      renderSetAvatar({
        initials: "ABC",
        name: "Jane Smith",
        src: " /photo.jpg ",
      }),
    );
    expect(image.querySelector("img")?.getAttribute("src")).toBe("/photo.jpg");
    expect(image.querySelector(".initials")).toBeNull();
    expect(image.querySelector(".icon-wrapper")).toBeNull();

    const initials = mountAvatar(renderSetAvatar({ initials: "Cvd" }));
    expect(initials.querySelector(".initials")?.textContent).toBe("Cvd");
    expect(initials.querySelector(".icon-wrapper")).toBeNull();

    const derived = mountAvatar(renderSetAvatar({ name: "Chris van Dyke" }));
    expect(derived.querySelector(".initials")?.textContent).toBe("Cv");
    expect(derived.querySelector(".icon-wrapper")).toBeNull();
  });

  it("treats empty src and empty initials as omitted", () => {
    const root = mountAvatar(
      renderSetAvatar({
        initials: "   ",
        src: "   ",
      }),
    );

    expect(root.querySelector("img")).toBeNull();
    expect(root.querySelector(".initials")).toBeNull();
    expect(root.querySelector(".icon-wrapper")).toBeTruthy();
  });

  it("validates explicit initials", () => {
    expect(() => renderSetAvatar({ initials: "ABCD" })).toThrow(
      "initials must normalize to 3 characters or fewer.",
    );
    expect(() => renderSetAvatar({ initials: "A1" })).toThrow(
      "initials must contain only alphabetic characters.",
    );
  });

  it("uses accessible-label precedence alt > name > Avatar for non-image variants", () => {
    const withAlt = mountAvatar(renderSetAvatar({ alt: "Agent" }));
    expect(getAvatar(withAlt).getAttribute("aria-label")).toBe("Agent");

    const withName = mountAvatar(renderSetAvatar({ name: "Jane Smith" }));
    expect(getAvatar(withName).getAttribute("aria-label")).toBe("Jane Smith");

    const fallback = mountAvatar(renderSetAvatar({}));
    expect(getAvatar(fallback).getAttribute("aria-label")).toBe("Avatar");
  });

  it("applies image semantics when src is present", () => {
    const root = mountAvatar(
      renderSetAvatar({
        alt: "Profile",
        entity: "team",
        src: "/photo.jpg",
      }),
    );
    const avatar = getAvatar(root);
    const img = root.querySelector("img");

    expect(img).toBeTruthy();
    expect(img?.getAttribute("alt")).toBe("Profile");
    expect(avatar.hasAttribute("role")).toBe(false);
    expect(avatar.hasAttribute("aria-label")).toBe(false);
    expect(avatar.getAttribute("data-entity")).toBe("team");
  });

  it("emits aria-hidden behavior for both image and non-image variants", () => {
    const iconRoot = mountAvatar(
      renderSetAvatar({
        ariaHidden: true,
        entity: "bot",
      }),
    );
    const iconAvatar = getAvatar(iconRoot);

    expect(iconAvatar.getAttribute("aria-hidden")).toBe("true");
    expect(iconAvatar.hasAttribute("role")).toBe(false);
    expect(iconAvatar.hasAttribute("aria-label")).toBe(false);

    const imageRoot = mountAvatar(
      renderSetAvatar({
        ariaHidden: true,
        src: "/photo.jpg",
      }),
    );
    const imageAvatar = getAvatar(imageRoot);
    const img = imageRoot.querySelector("img");

    expect(imageAvatar.getAttribute("aria-hidden")).toBe("true");
    expect(imageAvatar.hasAttribute("role")).toBe(false);
    expect(imageAvatar.hasAttribute("aria-label")).toBe(false);
    expect(img?.getAttribute("alt")).toBe("");
  });

  it("emits non-default entity and forwards icon sizing contract", () => {
    const root = mountAvatar(renderSetAvatar({ entity: "organization" }));
    const avatar = getAvatar(root);
    const icon = root.querySelector(".set-icon");

    expect(avatar.tagName).toBe("SPAN");
    expect(avatar.getAttribute("data-entity")).toBe("organization");
    expect(icon).toBeTruthy();
    expect(icon?.getAttribute("data-size")).toBe("fill");
    expect(icon?.getAttribute("aria-hidden")).toBe("true");
  });

  it("emits requested size variant", () => {
    const root = mountAvatar(renderSetAvatar({ size: "xl" }));
    expect(getAvatar(root).getAttribute("data-size")).toBe("xl");
  });

  it("renders consumer-provided id on the host", () => {
    const root = mountAvatar(renderSetAvatar({ id: "my-avatar" }));
    expect(getAvatar(root).id).toBe("my-avatar");
  });

  it("omits id when not provided", () => {
    const root = mountAvatar(renderSetAvatar({}));
    expect(getAvatar(root).hasAttribute("id")).toBe(false);
  });

  it("throws on a syntactically invalid id", () => {
    expect(() => renderSetAvatar({ id: "not valid" })).toThrow();
  });
});

describeSpecConsistency<SetAvatarProps>({
  baseProps: {},
  renderer: renderSetAvatar,
  spec: SET_AVATAR_SPEC,
});
