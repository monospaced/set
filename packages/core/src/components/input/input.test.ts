import { getByLabelText, getByText, queryByText } from "@testing-library/dom";
import { describe, expect, it } from "vitest";

import { describeSpecConsistency } from "../../test/spec";
import { renderSetInput, SET_INPUT_SPEC, type SetInputProps } from "./input";

function mountInput(html: string): HTMLElement {
  document.body.innerHTML = `<div class="set">${html}</div>`;
  return document.body.querySelector(".set") as HTMLElement;
}

describe("renderSetInput", () => {
  it("renders input with required id/label wiring and default size/type", () => {
    const root = mountInput(renderSetInput({ id: "email", label: "Email" }));
    const input = getByLabelText(root, "Email") as HTMLInputElement;
    const field = root.querySelector(".set-input");

    expect(field?.getAttribute("data-size")).toBe("md");
    expect(field?.getAttribute("data-inline-size")).toBeNull();
    expect(input.getAttribute("id")).toBe("email");
    expect(input.getAttribute("type")).toBe("text");
  });

  it('emits data-inline-size="fit" only when inlineSize is fit', () => {
    const fitRoot = mountInput(
      renderSetInput({ id: "email", inlineSize: "fit", label: "Email" }),
    );
    const fitField = fitRoot.querySelector(".set-input");
    expect(fitField?.getAttribute("data-inline-size")).toBe("fit");

    const fullRoot = mountInput(
      renderSetInput({ id: "email", inlineSize: "full", label: "Email" }),
    );
    const fullField = fullRoot.querySelector(".set-input");
    expect(fullField?.getAttribute("data-inline-size")).toBeNull();
  });

  it("renders description and wires aria-describedby", () => {
    const root = mountInput(
      renderSetInput({
        description: "We won't share this",
        id: "email",
        label: "Email",
      }),
    );
    const input = getByLabelText(root, "Email") as HTMLInputElement;
    const description = getByText(root, "We won't share this");

    expect(description.getAttribute("id")).toBe("email-description");
    expect(input.getAttribute("aria-describedby")).toBe("email-description");
  });

  it("emits aria-invalid only when invalid is true", () => {
    const validRoot = mountInput(
      renderSetInput({
        description: "Description",
        id: "email",
        label: "Email",
      }),
    );
    const validInput = getByLabelText(validRoot, "Email") as HTMLInputElement;
    expect(validInput.getAttribute("aria-invalid")).toBeNull();

    const invalidRoot = mountInput(
      renderSetInput({
        description: "Please enter a valid email",
        id: "email",
        invalid: true,
        label: "Email",
      }),
    );
    const invalidInput = getByLabelText(
      invalidRoot,
      "Email",
    ) as HTMLInputElement;
    expect(invalidInput.getAttribute("aria-invalid")).toBe("true");
  });

  it("suppresses aria-invalid when disabled is true", () => {
    const root = mountInput(
      renderSetInput({
        disabled: true,
        id: "email",
        invalid: true,
        label: "Email",
      }),
    );
    const input = getByLabelText(root, "Email") as HTMLInputElement;

    expect(input.getAttribute("aria-invalid")).toBeNull();
  });

  it("suppresses aria-invalid when readOnly is true", () => {
    const root = mountInput(
      renderSetInput({
        id: "email",
        invalid: true,
        label: "Email",
        readOnly: true,
      }),
    );
    const input = getByLabelText(root, "Email") as HTMLInputElement;

    expect(input.getAttribute("aria-invalid")).toBeNull();
    expect(input.hasAttribute("readonly")).toBe(true);
  });

  it("omits description markup and aria-describedby when description is blank", () => {
    const root = mountInput(
      renderSetInput({
        description: "   ",
        id: "email",
        label: "Email",
      }),
    );
    const input = getByLabelText(root, "Email") as HTMLInputElement;

    expect(input.getAttribute("aria-describedby")).toBeNull();
    expect(root.querySelector(".description")).toBeNull();
  });

  it("maps numeric type to text with numeric inputmode and default pattern", () => {
    const root = mountInput(
      renderSetInput({ id: "pin", label: "PIN", type: "numeric" }),
    );
    const input = getByLabelText(root, "PIN") as HTMLInputElement;

    expect(input.getAttribute("type")).toBe("text");
    expect(input.getAttribute("inputmode")).toBe("numeric");
    expect(input.getAttribute("pattern")).toBe("^[0-9]*$");
    expect(input.getAttribute("spellcheck")).toBe("false");
  });

  it("lets explicit pattern and spellcheck override numeric defaults", () => {
    const root = mountInput(
      renderSetInput({
        id: "pin",
        label: "PIN",
        pattern: "^[0-9]{4}$",
        spellcheck: true,
        type: "numeric",
      }),
    );
    const input = getByLabelText(root, "PIN") as HTMLInputElement;

    expect(input.getAttribute("pattern")).toBe("^[0-9]{4}$");
    expect(input.getAttribute("spellcheck")).toBe("true");
  });

  it("ignores readOnly when disabled is true", () => {
    const root = mountInput(
      renderSetInput({
        disabled: true,
        id: "email",
        label: "Email",
        readOnly: true,
      }),
    );
    const input = getByLabelText(root, "Email") as HTMLInputElement;

    expect(input.hasAttribute("disabled")).toBe(true);
    expect(input.hasAttribute("readonly")).toBe(false);
  });

  it("trims optional strings while preserving field values", () => {
    const root = mountInput(
      renderSetInput({
        autocomplete: "  email  ",
        description: "  Helpful description  ",
        id: " email ",
        label: "Email",
        name: "  accountEmail  ",
        value: "  foo@example.com  ",
      }),
    );
    const input = getByLabelText(root, "Email") as HTMLInputElement;
    const description = getByText(root, "Helpful description");

    expect(input.getAttribute("id")).toBe("email");
    expect(input.getAttribute("autocomplete")).toBe("email");
    expect(input.getAttribute("name")).toBe("accountEmail");
    expect(input.getAttribute("value")).toBe("  foo@example.com  ");
    expect(description.getAttribute("id")).toBe("email-description");
  });

  it('emits autocomplete="off" when autocomplete is false', () => {
    const root = mountInput(
      renderSetInput({
        autocomplete: false,
        id: "email",
        label: "Email",
      }),
    );
    const input = getByLabelText(root, "Email") as HTMLInputElement;

    expect(input.getAttribute("autocomplete")).toBe("off");
  });

  it("omits autocomplete when autocomplete is a blank string", () => {
    const root = mountInput(
      renderSetInput({
        autocomplete: "   ",
        id: "email",
        label: "Email",
      }),
    );
    const input = getByLabelText(root, "Email") as HTMLInputElement;

    expect(input.getAttribute("autocomplete")).toBeNull();
  });

  it("emits explicit spellcheck value for non-numeric inputs", () => {
    const root = mountInput(
      renderSetInput({
        id: "email",
        label: "Email",
        spellcheck: false,
        type: "text",
      }),
    );
    const input = getByLabelText(root, "Email") as HTMLInputElement;

    expect(input.getAttribute("spellcheck")).toBe("false");
  });

  it("throws on invalid id", () => {
    expect(() => renderSetInput({ id: "not valid", label: "Email" })).toThrow(
      "id must start with a letter and contain only letters, numbers, '_', '-', or ':'.",
    );
  });

  it("escapes label and description text", () => {
    const root = mountInput(
      renderSetInput({
        description: `<img src=x onerror=alert(2)>`,
        id: "email",
        label: `<script>alert(1)</script>`,
      }),
    );

    expect(root.querySelector("script")).toBeNull();
    expect(root.querySelector("img")).toBeNull();
    expect(getByText(root, `<img src=x onerror=alert(2)>`)).toBeTruthy();
    expect(getByLabelText(root, `<script>alert(1)</script>`)).toBeTruthy();
    expect(queryByText(root, "alert(1)")).toBeNull();
  });
});

describeSpecConsistency<SetInputProps>({
  baseProps: { id: "input-1", label: "Label" },
  renderer: renderSetInput,
  spec: SET_INPUT_SPEC,
});
