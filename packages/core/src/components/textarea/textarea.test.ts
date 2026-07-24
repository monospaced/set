import { getByLabelText, getByText, queryByText } from "@testing-library/dom";
import { describe, expect, it } from "vitest";

import { describeSpecConsistency } from "../../test/spec";
import {
  renderSetTextarea,
  SET_TEXTAREA_SPEC,
  type SetTextareaProps,
} from "./textarea";

function mountTextarea(html: string): HTMLElement {
  document.body.innerHTML = `<div class="set">${html}</div>`;
  return document.body.querySelector(".set") as HTMLElement;
}

describe("renderSetTextarea", () => {
  it("renders textarea with required id/label wiring and defaults", () => {
    const root = mountTextarea(
      renderSetTextarea({ id: "message", label: "Message" }),
    );
    const textarea = getByLabelText(root, "Message") as HTMLTextAreaElement;
    const field = root.querySelector(".set-textarea");

    expect(field?.getAttribute("data-size")).toBe("md");
    expect(field?.getAttribute("data-inline-size")).toBeNull();
    expect(field?.getAttribute("data-resize")).toBeNull();
    expect(textarea.getAttribute("id")).toBe("message");
    expect(textarea.getAttribute("rows")).toBe("2");
    expect(root.querySelector(".label")?.getAttribute("for")).toBe("message");
  });

  it("emits required only when required is true", () => {
    const requiredRoot = mountTextarea(
      renderSetTextarea({ id: "message", label: "Message", required: true }),
    );
    const requiredTextarea = getByLabelText(
      requiredRoot,
      "Message",
    ) as HTMLTextAreaElement;
    expect(requiredTextarea.hasAttribute("required")).toBe(true);

    const optionalRoot = mountTextarea(
      renderSetTextarea({ id: "message", label: "Message", required: false }),
    );
    const optionalTextarea = getByLabelText(
      optionalRoot,
      "Message",
    ) as HTMLTextAreaElement;
    expect(optionalTextarea.hasAttribute("required")).toBe(false);
  });

  it("emits explicit rows when provided", () => {
    const root = mountTextarea(
      renderSetTextarea({ id: "message", label: "Message", rows: 6 }),
    );
    const textarea = getByLabelText(root, "Message") as HTMLTextAreaElement;

    expect(textarea.getAttribute("rows")).toBe("6");
  });

  it('emits data-inline-size="fit" only when inlineSize is fit', () => {
    const fitRoot = mountTextarea(
      renderSetTextarea({
        id: "message",
        inlineSize: "fit",
        label: "Message",
      }),
    );
    const fitField = fitRoot.querySelector(".set-textarea");
    expect(fitField?.getAttribute("data-inline-size")).toBe("fit");

    const fullRoot = mountTextarea(
      renderSetTextarea({
        id: "message",
        inlineSize: "full",
        label: "Message",
      }),
    );
    const fullField = fullRoot.querySelector(".set-textarea");
    expect(fullField?.getAttribute("data-inline-size")).toBeNull();
  });

  it('emits data-resize="none" only when resize is none', () => {
    const noneRoot = mountTextarea(
      renderSetTextarea({ id: "message", label: "Message", resize: "none" }),
    );
    const noneField = noneRoot.querySelector(".set-textarea");
    expect(noneField?.getAttribute("data-resize")).toBe("none");

    const verticalRoot = mountTextarea(
      renderSetTextarea({
        id: "message",
        label: "Message",
        resize: "vertical",
      }),
    );
    const verticalField = verticalRoot.querySelector(".set-textarea");
    expect(verticalField?.getAttribute("data-resize")).toBeNull();
  });

  it("renders description and wires aria-describedby", () => {
    const root = mountTextarea(
      renderSetTextarea({
        description: "Add details",
        id: "message",
        label: "Message",
      }),
    );
    const textarea = getByLabelText(root, "Message") as HTMLTextAreaElement;
    const description = getByText(root, "Add details");

    expect(description.getAttribute("id")).toBe("message-description");
    expect(textarea.getAttribute("aria-describedby")).toBe(
      "message-description",
    );
  });

  it("omits description markup and aria-describedby when description is blank", () => {
    const root = mountTextarea(
      renderSetTextarea({
        description: "   ",
        id: "message",
        label: "Message",
      }),
    );
    const textarea = getByLabelText(root, "Message") as HTMLTextAreaElement;

    expect(textarea.getAttribute("aria-describedby")).toBeNull();
    expect(root.querySelector(".description")).toBeNull();
  });

  it("emits aria-invalid only when invalid is true and editable", () => {
    const invalidRoot = mountTextarea(
      renderSetTextarea({
        id: "message",
        invalid: true,
        label: "Message",
      }),
    );
    const invalidTextarea = getByLabelText(
      invalidRoot,
      "Message",
    ) as HTMLTextAreaElement;
    expect(invalidTextarea.getAttribute("aria-invalid")).toBe("true");

    const disabledRoot = mountTextarea(
      renderSetTextarea({
        disabled: true,
        id: "message",
        invalid: true,
        label: "Message",
      }),
    );
    const disabledTextarea = getByLabelText(
      disabledRoot,
      "Message",
    ) as HTMLTextAreaElement;
    expect(disabledTextarea.getAttribute("aria-invalid")).toBeNull();

    const readonlyRoot = mountTextarea(
      renderSetTextarea({
        id: "message",
        invalid: true,
        label: "Message",
        readOnly: true,
      }),
    );
    const readonlyTextarea = getByLabelText(
      readonlyRoot,
      "Message",
    ) as HTMLTextAreaElement;
    expect(readonlyTextarea.getAttribute("aria-invalid")).toBeNull();
    expect(readonlyTextarea.hasAttribute("readonly")).toBe(true);
  });

  it("ignores readOnly when disabled is true", () => {
    const root = mountTextarea(
      renderSetTextarea({
        disabled: true,
        id: "message",
        label: "Message",
        readOnly: true,
      }),
    );
    const textarea = getByLabelText(root, "Message") as HTMLTextAreaElement;

    expect(textarea.hasAttribute("disabled")).toBe(true);
    expect(textarea.hasAttribute("readonly")).toBe(false);
  });

  it("trims optional strings while preserving field values", () => {
    const root = mountTextarea(
      renderSetTextarea({
        autocomplete: "  on  ",
        description: "  Helpful description  ",
        id: " message ",
        label: "Message",
        name: "  note  ",
        value: "  hello world  ",
      }),
    );
    const textarea = getByLabelText(root, "Message") as HTMLTextAreaElement;
    const description = getByText(root, "Helpful description");

    expect(textarea.getAttribute("id")).toBe("message");
    expect(textarea.getAttribute("autocomplete")).toBe("on");
    expect(textarea.getAttribute("name")).toBe("note");
    expect(textarea.textContent).toBe("  hello world  ");
    expect(description.getAttribute("id")).toBe("message-description");
  });

  it('emits autocomplete="off" when autocomplete is false', () => {
    const root = mountTextarea(
      renderSetTextarea({
        autocomplete: false,
        id: "message",
        label: "Message",
      }),
    );
    const textarea = getByLabelText(root, "Message") as HTMLTextAreaElement;

    expect(textarea.getAttribute("autocomplete")).toBe("off");
  });

  it("omits autocomplete when autocomplete is a blank string", () => {
    const root = mountTextarea(
      renderSetTextarea({
        autocomplete: "   ",
        id: "message",
        label: "Message",
      }),
    );
    const textarea = getByLabelText(root, "Message") as HTMLTextAreaElement;

    expect(textarea.getAttribute("autocomplete")).toBeNull();
  });

  it("preserves browser default spellcheck when spellcheck is omitted", () => {
    const root = mountTextarea(
      renderSetTextarea({
        id: "message",
        label: "Message",
      }),
    );
    const textarea = getByLabelText(root, "Message") as HTMLTextAreaElement;

    expect(textarea.getAttribute("spellcheck")).toBeNull();
  });

  it("emits explicit spellcheck value when provided", () => {
    const root = mountTextarea(
      renderSetTextarea({
        id: "message",
        label: "Message",
        spellcheck: false,
      }),
    );
    const textarea = getByLabelText(root, "Message") as HTMLTextAreaElement;

    expect(textarea.getAttribute("spellcheck")).toBe("false");
  });

  it("throws when rows is less than 2", () => {
    expect(() =>
      renderSetTextarea({ id: "message", label: "Message", rows: 1 }),
    ).toThrow("rows must be an integer greater than or equal to 2.");
  });

  it("throws when rows is not an integer", () => {
    expect(() =>
      renderSetTextarea({ id: "message", label: "Message", rows: 2.5 }),
    ).toThrow("rows must be an integer greater than or equal to 2.");
  });

  it("throws on invalid id", () => {
    expect(() =>
      renderSetTextarea({ id: "not valid", label: "Message" }),
    ).toThrow(
      "id must start with a letter and contain only letters, numbers, '_', '-', or ':'.",
    );
  });

  it("escapes label, description, and value text", () => {
    const root = mountTextarea(
      renderSetTextarea({
        description: `<img src=x onerror=alert(2)>`,
        id: "message",
        label: `<script>alert(1)</script>`,
        value: `<b>unsafe</b>`,
      }),
    );

    expect(root.querySelector("script")).toBeNull();
    expect(root.querySelector("img")).toBeNull();
    expect(root.querySelector("b")).toBeNull();
    expect(getByText(root, `<img src=x onerror=alert(2)>`)).toBeTruthy();
    expect(getByLabelText(root, `<script>alert(1)</script>`)).toBeTruthy();
    expect(queryByText(root, "alert(1)")).toBeNull();
    expect(root.querySelector("textarea")?.textContent).toBe("<b>unsafe</b>");
  });
});

describeSpecConsistency<SetTextareaProps>({
  baseProps: { id: "ta", label: "Label" },
  renderer: renderSetTextarea,
  spec: SET_TEXTAREA_SPEC,
});
