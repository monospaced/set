import { describe, expect, it } from "vitest";

import { describeSpecConsistency } from "../../test/spec";
import { renderSetLogo, SET_LOGO_SPEC, type SetLogoProps } from "./logo";

function mountLogo(html: string): HTMLElement {
  document.body.innerHTML = `<div class="set">${html}</div>`;
  return document.body.querySelector(".set") as HTMLElement;
}

describe("renderSetLogo", () => {
  it("renders div.logo with default variant/tone/size and required label", () => {
    const root = mountLogo(renderSetLogo({ label: "Monospaced" }));
    const logo = root.querySelector(".set-logo") as HTMLElement;

    expect(logo).toBeTruthy();
    expect(logo.tagName).toBe("DIV");
    expect(logo.getAttribute("data-size")).toBe("md");
    expect(logo.hasAttribute("data-variant")).toBe(false);
    expect(logo.hasAttribute("data-tone")).toBe(false);
    expect(logo.querySelector(".visually-hidden")?.textContent).toBe(
      "Monospaced",
    );
  });

  it("emits non-default variant and tone attributes", () => {
    const root = mountLogo(
      renderSetLogo({
        label: "Monospaced",
        tone: "neutral",
        variant: "graphic",
      }),
    );
    const logo = root.querySelector(".set-logo") as HTMLElement;

    expect(logo.getAttribute("data-variant")).toBe("graphic");
    expect(logo.getAttribute("data-tone")).toBe("neutral");
  });

  it("always emits data-size and supports fill", () => {
    const root = mountLogo(
      renderSetLogo({ label: "Monospaced", size: "fill" }),
    );
    const logo = root.querySelector(".set-logo") as HTMLElement;

    expect(logo.getAttribute("data-size")).toBe("fill");
  });

  it("escapes label content", () => {
    const root = mountLogo(renderSetLogo({ label: "Monospaced <Logo>" }));
    const label = root.querySelector(
      ".set-logo .visually-hidden",
    ) as HTMLElement;

    expect(label.textContent).toBe("Monospaced <Logo>");
    expect(label.querySelector("logo")).toBeNull();
  });

  it("renders consumer-provided id on the host", () => {
    const root = mountLogo(renderSetLogo({ id: "my-logo", label: "Brand" }));
    const logo = root.querySelector(".set-logo") as HTMLElement;

    expect(logo.id).toBe("my-logo");
  });

  it("omits id when not provided", () => {
    const root = mountLogo(renderSetLogo({ label: "Brand" }));
    const logo = root.querySelector(".set-logo") as HTMLElement;

    expect(logo.hasAttribute("id")).toBe(false);
  });

  it("throws on a syntactically invalid id", () => {
    expect(() => renderSetLogo({ id: "not valid", label: "Brand" })).toThrow();
  });
});

describeSpecConsistency<SetLogoProps>({
  baseProps: { label: "Brand" },
  renderer: renderSetLogo,
  spec: SET_LOGO_SPEC,
});
