import { describe, expect, it } from "vitest";

import { describeSpecConsistency } from "../../test/spec";
import { SET_CARD_SPEC, type SetCardProps, renderSetCard } from "./card";

function mountCard(html: string): HTMLElement {
  document.body.innerHTML = `<div class="set">${html}</div>`;
  return document.body.querySelector(".set") as HTMLElement;
}

describe("renderSetCard", () => {
  it("renders the default card contract", () => {
    const root = mountCard(
      renderSetCard({
        description: "Description",
        title: "Card title",
      }),
    );
    const card = root.querySelector(".set-card") as HTMLElement;

    expect(card.tagName).toBe("DIV");
    expect(card.className).toBe("set-card");
    expect(card.hasAttribute("data-set-surface")).toBe(false);
    expect(card.querySelector(".dots")).toBeTruthy();
    expect(card.querySelector("div.title")?.textContent).toBe("Card title");
    expect(card.querySelector("p.description")?.textContent).toBe(
      "Description",
    );
    expect(card.querySelector("p.note")).toBeNull();
  });

  it("renders a semantic heading when headingLevel is provided", () => {
    const root = mountCard(
      renderSetCard({
        description: "Description",
        headingLevel: 4,
        title: "Card title",
      }),
    );

    expect(root.querySelector(".set-card h4.title")?.textContent).toBe(
      "Card title",
    );
    expect(root.querySelector(".set-card div.title")).toBeNull();
  });

  it("renders a linked title and trailing note icon when href and note are provided", () => {
    const root = mountCard(
      renderSetCard({
        description: "Description",
        href: "/docs",
        note: "Read more",
        title: "Card title",
      }),
    );

    expect(root.querySelector(".set-card .title a")?.getAttribute("href")).toBe(
      "/docs",
    );
    expect(root.querySelector(".set-card .title a")?.textContent).toBe(
      "Card title",
    );
    expect(root.querySelector(".set-card p.note")?.textContent).toContain(
      "Read more",
    );
    expect(root.querySelector(".set-card p.note .set-icon")).toBeTruthy();
  });

  it("renders trusted HTML for description and note", () => {
    const root = mountCard(
      renderSetCard({
        description: "Description with <em>emphasis</em>",
        note: 'By <a href="/team">Measured</a>',
        title: "Card title",
      }),
    );

    expect(root.querySelector(".set-card p.description em")?.textContent).toBe(
      "emphasis",
    );
    expect(root.querySelector(".set-card p.note a")?.getAttribute("href")).toBe(
      "/team",
    );
    expect(root.querySelector(".set-card p.note .set-icon")).toBeNull();
  });

  it("emits any supported surface variant when provided", () => {
    const root = mountCard(
      renderSetCard({
        description: "Description",
        surface: "brand-inverse",
        title: "Card title",
      }),
    );

    expect(
      root.querySelector(".set-card")?.getAttribute("data-set-surface"),
    ).toBe("brand-inverse");
  });

  it("escapes title text", () => {
    const html = renderSetCard({
      description: "Description",
      title: '<script>alert("xss")</script>',
    });

    expect(html).toContain(
      "&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;",
    );
    expect(html).not.toContain("<script>");
  });

  it("renders consumer-provided id on the host", () => {
    const root = mountCard(
      renderSetCard({
        description: "Description",
        id: "my-card",
        title: "Title",
      }),
    );
    const card = root.querySelector(".set-card") as HTMLElement;

    expect(card.id).toBe("my-card");
  });

  it("omits id when not provided", () => {
    const root = mountCard(
      renderSetCard({ description: "Description", title: "Title" }),
    );
    const card = root.querySelector(".set-card") as HTMLElement;

    expect(card.hasAttribute("id")).toBe(false);
  });

  it("throws on a syntactically invalid id", () => {
    expect(() =>
      renderSetCard({
        description: "Description",
        id: "not valid",
        title: "Title",
      }),
    ).toThrow();
  });
});

describeSpecConsistency<SetCardProps>({
  baseProps: { description: "Description", title: "Title" },
  renderer: renderSetCard,
  spec: SET_CARD_SPEC,
});
