import { describe, expect, it } from "vitest";

import { describeSpecConsistency } from "../../test/spec";
import {
  renderSetSpinner,
  SET_SPINNER_SPEC,
  type SetSpinnerProps,
} from "./spinner";

function mountSpinner(html: string): HTMLElement {
  document.body.innerHTML = `<div class="set">${html}</div>`;
  return document.body.querySelector(".set") as HTMLElement;
}

describe("renderSetSpinner", () => {
  it("renders the default spinner contract", () => {
    const root = mountSpinner(renderSetSpinner());
    const spinner = root.querySelector(".set-spinner") as HTMLElement;
    const svg = spinner.querySelector("svg") as SVGElement;

    expect(spinner.tagName).toBe("SPAN");
    expect(spinner.className).toBe("set-spinner");
    expect(spinner.getAttribute("data-size")).toBe("md");
    expect(spinner.hasAttribute("data-tone")).toBe(false);
    expect(spinner.hasAttribute("role")).toBe(false);

    expect(svg).toBeTruthy();
    expect(svg.getAttribute("aria-hidden")).toBe("true");
    expect(spinner.querySelector(".circle-lg")).toBeTruthy();
    expect(spinner.querySelector(".circle-sm")).toBeTruthy();
    expect(spinner.querySelector(".visually-hidden")).toBeNull();
  });

  it("emits the requested size", () => {
    const root = mountSpinner(renderSetSpinner({ size: "2xl" }));

    expect(root.querySelector(".set-spinner")?.getAttribute("data-size")).toBe(
      "2xl",
    );
  });

  it("omits default tone and emits non-default tone", () => {
    const defaultRoot = mountSpinner(renderSetSpinner({ tone: "default" }));
    expect(
      defaultRoot.querySelector(".set-spinner")?.hasAttribute("data-tone"),
    ).toBe(false);

    const brandRoot = mountSpinner(renderSetSpinner({ tone: "brand" }));
    expect(
      brandRoot.querySelector(".set-spinner")?.getAttribute("data-tone"),
    ).toBe("brand");
  });

  it("renders a status label when provided", () => {
    const root = mountSpinner(renderSetSpinner({ label: "Loading" }));
    const spinner = root.querySelector(".set-spinner") as HTMLElement;
    const hiddenLabel = spinner.querySelector(
      ".visually-hidden",
    ) as HTMLElement;

    expect(spinner.getAttribute("role")).toBe("status");
    expect(hiddenLabel.textContent).toBe("Loading");
  });

  it("escapes the status label", () => {
    const root = mountSpinner(
      renderSetSpinner({ label: `<strong>Loading</strong>` }),
    );
    const hiddenLabel = root.querySelector(
      ".set-spinner .visually-hidden",
    ) as HTMLElement;

    expect(hiddenLabel.innerHTML).toBe("&lt;strong&gt;Loading&lt;/strong&gt;");
  });

  it("renders consumer-provided id on the host", () => {
    const root = mountSpinner(renderSetSpinner({ id: "my-spinner" }));
    const spinner = root.querySelector(".set-spinner") as HTMLElement;

    expect(spinner.id).toBe("my-spinner");
  });

  it("omits id when not provided", () => {
    const root = mountSpinner(renderSetSpinner());
    const spinner = root.querySelector(".set-spinner") as HTMLElement;

    expect(spinner.hasAttribute("id")).toBe(false);
  });

  it("throws on a syntactically invalid id", () => {
    expect(() => renderSetSpinner({ id: "not valid" })).toThrow();
  });
});

describeSpecConsistency<SetSpinnerProps>({
  baseProps: {},
  renderer: renderSetSpinner,
  spec: SET_SPINNER_SPEC,
});
