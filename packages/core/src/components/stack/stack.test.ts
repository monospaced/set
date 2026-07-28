import { getByText } from "@testing-library/dom";
import { describe, expect, it } from "vitest";

import { describeSpecConsistency } from "../../test/spec";
import { renderSetStack, SET_STACK_SPEC, type SetStackProps } from "./stack";

function mountStack(html: string): HTMLElement {
  document.body.innerHTML = `<div class="set">${html}</div>`;
  return document.body.querySelector(".set") as HTMLElement;
}

describe("renderSetStack", () => {
  it("renders a stack div with default gap and no responsive attribute", () => {
    const root = mountStack(renderSetStack({ children: "Body" }));
    const stack = getByText(root, "Body");

    expect(stack.tagName).toBe("DIV");
    expect(stack.classList.contains("set-stack")).toBe(true);
    expect(stack.hasAttribute("data-align")).toBe(false);
    expect(stack.getAttribute("data-gap")).toBe("md");
    expect(stack.hasAttribute("data-responsive")).toBe(false);
  });

  it("renders a ul when as is ul", () => {
    const root = mountStack(renderSetStack({ as: "ul", children: "Body" }));
    const stack = getByText(root, "Body");

    expect(stack.tagName).toBe("UL");
    expect(stack.classList.contains("set-stack")).toBe(true);
  });

  it("renders trusted HTML content when children is provided", () => {
    const root = mountStack(
      renderSetStack({
        children: '<p>Lorem <em>ipsum</em> <a href="/docs">docs</a></p>',
      }),
    );

    expect(root.querySelector("p")?.textContent).toContain("Lorem");
    expect(root.querySelector("em")?.textContent).toBe("ipsum");
    expect(root.querySelector("a")?.getAttribute("href")).toBe("/docs");
  });

  it("allows omitted and empty children without throwing", () => {
    const omittedRoot = mountStack(renderSetStack({}));
    const omittedStack = omittedRoot.querySelector(".set-stack");

    expect(omittedStack).toBeTruthy();
    expect(omittedStack?.innerHTML).toBe("");

    const emptyRoot = mountStack(renderSetStack({ children: "" }));
    const emptyStack = emptyRoot.querySelector(".set-stack");

    expect(emptyStack).toBeTruthy();
    expect(emptyStack?.innerHTML).toBe("");
  });

  it("always emits data-gap for all variants", () => {
    const noneRoot = mountStack(
      renderSetStack({ children: "Body", gap: "none" }),
    );
    const noneStack = getByText(noneRoot, "Body");

    expect(noneStack.getAttribute("data-gap")).toBe("none");

    const xsRoot = mountStack(renderSetStack({ children: "Body", gap: "xs" }));
    const xsStack = getByText(xsRoot, "Body");

    expect(xsStack.getAttribute("data-gap")).toBe("xs");

    const smRoot = mountStack(renderSetStack({ children: "Body", gap: "sm" }));
    const smStack = getByText(smRoot, "Body");

    expect(smStack.getAttribute("data-gap")).toBe("sm");

    const lgRoot = mountStack(renderSetStack({ children: "Body", gap: "lg" }));
    const lgStack = getByText(lgRoot, "Body");

    expect(lgStack.getAttribute("data-gap")).toBe("lg");
  });

  it("emits data-responsive only when responsive is true", () => {
    const responsiveRoot = mountStack(
      renderSetStack({ children: "Body", responsive: true }),
    );
    const responsiveStack = getByText(responsiveRoot, "Body");

    expect(responsiveStack.hasAttribute("data-responsive")).toBe(true);

    const nonResponsiveRoot = mountStack(
      renderSetStack({ children: "Body", responsive: false }),
    );
    const nonResponsiveStack = getByText(nonResponsiveRoot, "Body");

    expect(nonResponsiveStack.hasAttribute("data-responsive")).toBe(false);
  });

  it("emits data-align when align is explicitly provided", () => {
    const startRoot = mountStack(
      renderSetStack({ align: "start", children: "Body" }),
    );
    const startStack = getByText(startRoot, "Body");
    expect(startStack.getAttribute("data-align")).toBe("start");

    const centerRoot = mountStack(
      renderSetStack({ align: "center", children: "Body" }),
    );
    const centerStack = getByText(centerRoot, "Body");
    expect(centerStack.getAttribute("data-align")).toBe("center");

    const endRoot = mountStack(
      renderSetStack({ align: "end", children: "Body" }),
    );
    const endStack = getByText(endRoot, "Body");
    expect(endStack.getAttribute("data-align")).toBe("end");

    const stretchRoot = mountStack(
      renderSetStack({ align: "stretch", children: "Body" }),
    );
    const stretchStack = getByText(stretchRoot, "Body");
    expect(stretchStack.hasAttribute("data-align")).toBe(false);
  });

  it("renders consumer-provided id on the host", () => {
    const root = mountStack(
      renderSetStack({ children: "Body", id: "my-stack" }),
    );
    const stack = root.querySelector(".set-stack") as HTMLElement;

    expect(stack.id).toBe("my-stack");
  });

  it("omits id when not provided", () => {
    const root = mountStack(renderSetStack({ children: "Body" }));
    const stack = root.querySelector(".set-stack") as HTMLElement;

    expect(stack.hasAttribute("id")).toBe(false);
  });

  it("throws on a syntactically invalid id", () => {
    expect(() =>
      renderSetStack({ children: "Body", id: "not valid" }),
    ).toThrow();
  });
});

describeSpecConsistency<SetStackProps>({
  baseProps: {},
  renderer: renderSetStack,
  spec: SET_STACK_SPEC,
});
