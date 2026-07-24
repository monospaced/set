import { describe, expect, it } from "vitest";

import { describeSpecConsistency } from "../../test/spec";
import {
  renderSetBlockquote,
  SET_BLOCKQUOTE_SPEC,
  type SetBlockquoteProps,
} from "./blockquote";

function mountBlockquote(html: string): HTMLElement {
  document.body.innerHTML = `<div class="set">${html}</div>`;
  return document.body.querySelector(".set") as HTMLElement;
}

describe("renderSetBlockquote", () => {
  it("renders the default blockquote contract", () => {
    const root = mountBlockquote(
      renderSetBlockquote({
        attribution: "Monospaced",
        quote: "Quote",
      }),
    );
    const blockquote = root.querySelector(".set-blockquote") as HTMLElement;

    expect(blockquote.tagName).toBe("FIGURE");
    expect(blockquote.className).toBe("set-blockquote");
    expect(blockquote.hasAttribute("data-align")).toBe(false);
    expect(blockquote.querySelector("blockquote.quote")).toBeTruthy();
    expect(
      blockquote.querySelector("blockquote.quote > p.set-text")?.textContent,
    ).toBe("Quote");
    expect(
      blockquote
        .querySelector("blockquote.quote > p.set-text")
        ?.getAttribute("data-size"),
    ).toBe("md");
    expect(
      blockquote
        .querySelector("blockquote.quote > p.set-text")
        ?.hasAttribute("data-monospaced"),
    ).toBe(true);
    expect(
      blockquote.querySelector("figcaption.attribution > span.set-text")
        ?.textContent,
    ).toBe("Monospaced");
    expect(
      blockquote
        .querySelector("figcaption.attribution > span.set-text")
        ?.getAttribute("data-size"),
    ).toBe("sm");
  });

  it("passes size through to the quote text and keeps attribution at sm", () => {
    const root = mountBlockquote(
      renderSetBlockquote({
        attribution: "Monospaced",
        quote: "Quote",
        size: "lg",
      }),
    );

    expect(
      root
        .querySelector(".set-blockquote blockquote.quote > p.set-text")
        ?.getAttribute("data-size"),
    ).toBe("lg");
    expect(
      root
        .querySelector(".set-blockquote figcaption.attribution > span.set-text")
        ?.getAttribute("data-size"),
    ).toBe("sm");
  });

  it("passes responsive through to both composed text elements", () => {
    const root = mountBlockquote(
      renderSetBlockquote({
        attribution: "Monospaced",
        quote: "Quote",
        responsive: true,
      }),
    );

    expect(
      root
        .querySelector(".set-blockquote blockquote.quote > p.set-text")
        ?.hasAttribute("data-responsive"),
    ).toBe(true);
    expect(
      root
        .querySelector(".set-blockquote figcaption.attribution > span.set-text")
        ?.hasAttribute("data-responsive"),
    ).toBe(true);
  });

  it("passes align to the root and the composed quote paragraph", () => {
    const root = mountBlockquote(
      renderSetBlockquote({
        align: "center",
        attribution: "Monospaced",
        quote: "Quote",
      }),
    );

    expect(
      root.querySelector(".set-blockquote")?.getAttribute("data-align"),
    ).toBe("center");
    expect(
      root
        .querySelector(".set-blockquote blockquote.quote > p.set-text")
        ?.getAttribute("data-align"),
    ).toBe("center");
  });

  it("passes measured through to the quoted paragraph text", () => {
    const root = mountBlockquote(
      renderSetBlockquote({
        attribution: "Monospaced",
        measured: false,
        quote: "Quote",
      }),
    );

    expect(
      root
        .querySelector(".set-blockquote blockquote.quote > p.set-text")
        ?.hasAttribute("data-monospaced"),
    ).toBe(false);
  });

  it("renders trusted HTML through the composed text elements", () => {
    const root = mountBlockquote(
      renderSetBlockquote({
        attribution: 'By <a href="/team">Monospaced</a>',
        quote: "Quote with <em>emphasis</em>",
      }),
    );

    expect(
      root.querySelector(".set-blockquote blockquote em")?.textContent,
    ).toBe("emphasis");
    expect(
      root
        .querySelector(".set-blockquote figcaption.attribution a")
        ?.getAttribute("href"),
    ).toBe("/team");
  });

  it("renders consumer-provided id on the host", () => {
    const root = mountBlockquote(
      renderSetBlockquote({
        attribution: "Monospaced",
        id: "my-blockquote",
        quote: "Quote",
      }),
    );
    const blockquote = root.querySelector(".set-blockquote") as HTMLElement;

    expect(blockquote.id).toBe("my-blockquote");
  });

  it("omits id when not provided", () => {
    const root = mountBlockquote(
      renderSetBlockquote({ attribution: "Monospaced", quote: "Quote" }),
    );
    const blockquote = root.querySelector(".set-blockquote") as HTMLElement;

    expect(blockquote.hasAttribute("id")).toBe(false);
  });

  it("throws on a syntactically invalid id", () => {
    expect(() =>
      renderSetBlockquote({
        attribution: "Monospaced",
        id: "not valid",
        quote: "Quote",
      }),
    ).toThrow();
  });
});

describeSpecConsistency<SetBlockquoteProps>({
  baseProps: { attribution: "Monospaced", quote: "Quote" },
  renderer: renderSetBlockquote,
  spec: SET_BLOCKQUOTE_SPEC,
});
