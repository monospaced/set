import { readFileSync } from "node:fs";
import { resolve } from "node:path";

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

  it("renders the animated svg for the primary and graphic variants only", () => {
    const animatedRoot = mountLogo(
      renderSetLogo({ animated: true, label: "Monospaced" }),
    );
    const animatedLogo = animatedRoot.querySelector(".set-logo") as HTMLElement;
    expect(animatedLogo.hasAttribute("data-animated")).toBe(true);
    expect(animatedLogo.querySelectorAll("svg .mark rect")).toHaveLength(8);
    expect(animatedLogo.querySelectorAll("svg .word path")).toHaveLength(1);
    expect(animatedLogo.querySelector("svg")?.getAttribute("aria-hidden")).toBe(
      "true",
    );

    const graphicRoot = mountLogo(
      renderSetLogo({
        animated: true,
        label: "Monospaced",
        variant: "graphic",
      }),
    );
    const graphicLogo = graphicRoot.querySelector(".set-logo") as HTMLElement;
    expect(graphicLogo.hasAttribute("data-animated")).toBe(true);
    expect(graphicLogo.querySelectorAll("svg .mark rect")).toHaveLength(8);
    expect(graphicLogo.querySelectorAll("svg .word path")).toHaveLength(0);
    expect(graphicLogo.querySelector("svg")?.getAttribute("viewBox")).toBe(
      "0 0 600 1200",
    );

    const secondaryRoot = mountLogo(
      renderSetLogo({
        animated: true,
        label: "Monospaced",
        variant: "secondary",
      }),
    );
    const secondaryLogo = secondaryRoot.querySelector(
      ".set-logo",
    ) as HTMLElement;
    expect(secondaryLogo.hasAttribute("data-animated")).toBe(false);
    expect(secondaryLogo.querySelector("svg")).toBeNull();

    const staticRoot = mountLogo(renderSetLogo({ label: "Monospaced" }));
    const staticLogo = staticRoot.querySelector(".set-logo") as HTMLElement;
    expect(staticLogo.hasAttribute("data-animated")).toBe(false);
    expect(staticLogo.querySelector("svg")).toBeNull();
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

  it("keeps the animated artwork in step with the shape tokens", () => {
    const tokens = JSON.parse(
      readFileSync(
        resolve(
          process.cwd(),
          "../system/src/mnsp/primitive/shape.tokens.json",
        ),
        "utf8",
      ),
    ) as {
      logo: Record<string, Record<"viewBox" | "path", { $value: string }>>;
    };
    const logo = tokens.logo;

    const primaryRoot = mountLogo(
      renderSetLogo({ animated: true, label: "Monospaced" }),
    );
    const primarySvg = primaryRoot.querySelector(".set-logo svg");
    expect(primarySvg?.getAttribute("viewBox")).toBe(
      logo.primary.viewBox.$value,
    );
    expect(primarySvg?.querySelector(".word path")?.getAttribute("d")).toBe(
      logo.typographic.path.$value,
    );

    const graphicRoot = mountLogo(
      renderSetLogo({
        animated: true,
        label: "Monospaced",
        variant: "graphic",
      }),
    );
    expect(
      graphicRoot.querySelector(".set-logo svg")?.getAttribute("viewBox"),
    ).toBe(logo.graphic.viewBox.$value);
  });
});

describeSpecConsistency<SetLogoProps>({
  baseProps: { label: "Brand" },
  renderer: renderSetLogo,
  spec: SET_LOGO_SPEC,
});
