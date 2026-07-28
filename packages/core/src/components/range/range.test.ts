import { fireEvent, getByLabelText, getByText } from "@testing-library/dom";
import { describe, expect, it } from "vitest";

import { describeSpecConsistency } from "../../test/spec";
import {
  defineSetRange,
  renderSetRange,
  SET_RANGE_SPEC,
  SET_RANGE_TAG_NAME,
  type SetRangeProps,
} from "./range";

function mountRange(html: string): HTMLElement {
  document.body.innerHTML = `<div class="set">${html}</div>`;
  return document.body.querySelector(".set") as HTMLElement;
}

describe("renderSetRange", () => {
  it("renders semantic range markup inside host", () => {
    const root = mountRange(renderSetRange({ id: "volume", label: "Volume" }));
    const host = root.querySelector(SET_RANGE_TAG_NAME);
    const input = getByLabelText(root, "Volume") as HTMLInputElement;
    const field = root.querySelector(".set-range");
    const output = root.querySelector(".output");

    expect(host).not.toBeNull();
    expect(field?.getAttribute("data-size")).toBe("md");
    expect(field?.getAttribute("data-inline-size")).toBeNull();
    expect(input.getAttribute("type")).toBe("range");
    expect(output?.getAttribute("for")).toBe("volume");
    expect(output?.textContent).toBe("");
  });

  it('emits data-inline-size="fit" only when inlineSize is fit', () => {
    const fitRoot = mountRange(
      renderSetRange({ id: "volume", inlineSize: "fit", label: "Volume" }),
    );
    expect(
      fitRoot.querySelector(".set-range")?.getAttribute("data-inline-size"),
    ).toBe("fit");

    const fullRoot = mountRange(
      renderSetRange({ id: "volume", inlineSize: "full", label: "Volume" }),
    );
    expect(
      fullRoot.querySelector(".set-range")?.getAttribute("data-inline-size"),
    ).toBeNull();
  });

  it("renders description and wires aria-describedby", () => {
    const root = mountRange(
      renderSetRange({
        description: "Select a value",
        id: "volume",
        label: "Volume",
      }),
    );
    const input = getByLabelText(root, "Volume") as HTMLInputElement;
    const description = getByText(root, "Select a value");

    expect(description.getAttribute("id")).toBe("volume-description");
    expect(input.getAttribute("aria-describedby")).toBe("volume-description");
  });

  it("emits min, max, step, value, and name when provided", () => {
    const root = mountRange(
      renderSetRange({
        id: "volume",
        label: "Volume",
        max: 10,
        min: 0,
        name: "volume",
        step: 2,
        value: 4,
      }),
    );
    const input = getByLabelText(root, "Volume") as HTMLInputElement;

    expect(input.getAttribute("min")).toBe("0");
    expect(input.getAttribute("max")).toBe("10");
    expect(input.getAttribute("step")).toBe("2");
    expect(input.getAttribute("value")).toBe("4");
    expect(input.getAttribute("name")).toBe("volume");
    expect(root.querySelector(".output")?.textContent).toBe("4");
  });

  it("hydrates the output from the current input value", () => {
    const root = mountRange(
      renderSetRange({
        id: "volume",
        label: "Volume",
        value: 30,
      }),
    );

    defineSetRange();

    expect(root.querySelector(".output")?.textContent).toBe("30");
  });

  it("updates the output on input", () => {
    const root = mountRange(
      renderSetRange({
        id: "volume",
        label: "Volume",
        value: 30,
      }),
    );

    defineSetRange();

    const input = getByLabelText(root, "Volume") as HTMLInputElement;
    const output = root.querySelector(".output") as HTMLOutputElement;

    input.value = "75";
    fireEvent.input(input);

    expect(output.textContent).toBe("75");
  });

  it("updates the output when the input value changes programmatically", () => {
    const root = mountRange(
      renderSetRange({
        id: "volume",
        label: "Volume",
        value: 30,
      }),
    );

    defineSetRange();

    const input = getByLabelText(root, "Volume") as HTMLInputElement;
    const output = root.querySelector(".output") as HTMLOutputElement;

    input.value = "45";

    expect(output.textContent).toBe("45");
  });

  it("throws on invalid id", () => {
    expect(() => renderSetRange({ id: "not valid", label: "Volume" })).toThrow(
      "id must start with a letter and contain only letters, numbers, '_', '-', or ':'.",
    );
  });

  it("escapes label and description text", () => {
    const root = mountRange(
      renderSetRange({
        description: `<img src=x onerror=alert(2)>`,
        id: "volume",
        label: `<script>alert(1)</script>`,
      }),
    );

    expect(root.querySelector("script")).toBeNull();
    expect(root.querySelector("img")).toBeNull();
    expect(getByLabelText(root, `<script>alert(1)</script>`)).toBeTruthy();
    expect(getByText(root, `<img src=x onerror=alert(2)>`)).toBeTruthy();
  });
});

describeSpecConsistency<SetRangeProps>({
  baseProps: { id: "r", label: "Range" },
  renderer: renderSetRange,
  spec: SET_RANGE_SPEC,
});
