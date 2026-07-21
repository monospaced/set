import { describe, expect, it } from "vitest";

import { describeSpecConsistency } from "../../test/spec";
import {
  SET_DETAILS_SPEC,
  type SetDetailsProps,
  renderSetDetails,
} from "./details";

function mountDetails(html: string): HTMLElement {
  document.body.innerHTML = `<div class="set">${html}</div>`;
  return document.body.querySelector(".set") as HTMLElement;
}

describe("renderSetDetails", () => {
  it("renders the default details contract", () => {
    const root = mountDetails(
      renderSetDetails({
        summary: "More information",
      }),
    );
    const details = root.querySelector(".set-details") as HTMLElement;
    const summary = details.querySelector(".summary") as HTMLElement;
    const marker = details.querySelector(
      ".summary .marker .set-icon",
    ) as HTMLElement;
    const content = details.querySelector(".content") as HTMLElement;

    expect(details.tagName).toBe("DETAILS");
    expect(details.className).toBe("set-details");
    expect(details.hasAttribute("open")).toBe(false);
    expect(details.hasAttribute("data-inline-size")).toBe(false);

    expect(summary).toBeTruthy();
    expect(summary.textContent).toBe("More information");
    expect(marker).toBeTruthy();
    expect(marker.getAttribute("aria-hidden")).toBe("true");

    expect(content).toBeTruthy();
    expect(content.innerHTML).toBe("");
  });

  it("emits native open when requested", () => {
    const root = mountDetails(
      renderSetDetails({
        open: true,
        summary: "More information",
      }),
    );

    expect(root.querySelector(".set-details")?.hasAttribute("open")).toBe(true);
  });

  it('emits data-inline-size only when inlineSize is "fit"', () => {
    const fitRoot = mountDetails(
      renderSetDetails({
        inlineSize: "fit",
        summary: "More information",
      }),
    );
    expect(
      fitRoot.querySelector(".set-details")?.getAttribute("data-inline-size"),
    ).toBe("fit");

    const fullRoot = mountDetails(
      renderSetDetails({
        inlineSize: "full",
        summary: "More information",
      }),
    );
    expect(
      fullRoot.querySelector(".set-details")?.hasAttribute("data-inline-size"),
    ).toBe(false);
  });

  it("escapes summary text and preserves trusted children", () => {
    const root = mountDetails(
      renderSetDetails({
        children: "<p><strong>Trusted</strong> content.</p>",
        summary: `<More information>`,
      }),
    );
    const summary = root.querySelector(".set-details .summary") as HTMLElement;
    const content = root.querySelector(".set-details .content") as HTMLElement;

    expect(summary.textContent).toBe("<More information>");
    expect(content.innerHTML).toBe("<p><strong>Trusted</strong> content.</p>");
  });

  it("renders consumer-provided id on the host", () => {
    const root = mountDetails(
      renderSetDetails({ id: "my-details", summary: "Summary" }),
    );
    const details = root.querySelector(".set-details") as HTMLElement;

    expect(details.id).toBe("my-details");
  });

  it("omits id when not provided", () => {
    const root = mountDetails(renderSetDetails({ summary: "Summary" }));
    const details = root.querySelector(".set-details") as HTMLElement;

    expect(details.hasAttribute("id")).toBe(false);
  });

  it("throws on a syntactically invalid id", () => {
    expect(() =>
      renderSetDetails({ id: "not valid", summary: "Summary" }),
    ).toThrow();
  });
});

describeSpecConsistency<SetDetailsProps>({
  baseProps: { summary: "Summary" },
  renderer: renderSetDetails,
  spec: SET_DETAILS_SPEC,
});
