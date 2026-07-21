# Full page (core)

A complete page composition: branded header with nav, a content intro section laid on the 12-column responsive grid, footer. Built entirely from Set components — no custom CSS.

```ts
import {
  defineSetNav,
  renderSetBox,
  renderSetButton,
  renderSetContainer,
  renderSetDivider,
  renderSetGrid,
  renderSetGridItem,
  renderSetHeading,
  renderSetInline,
  renderSetLogo,
  renderSetNav,
  renderSetPage,
  renderSetRoot,
  renderSetStack,
  renderSetText,
} from "@monospaced/set-core";

defineSetNav();

const page = renderSetPage({
  headerBorder: "scroll",
  headerSize: "lg",
  stickyHeader: "always",
  header: renderSetContainer({
    gutter: "narrow",
    maxInlineSize: "wide",
    children: renderSetBox({
      paddingBlock: "sm",
      paddingInline: "none",
      responsive: true,
      children: renderSetInline({
        gap: "sm",
        justify: "between",
        children: [
          `<a href="/">${renderSetLogo({ label: "Brand", variant: "secondary" })}</a>`,
          renderSetNav({
            collapsible: "belowTablet",
            contentId: "site-nav",
            expanderPosition: "end",
            items: [
              { current: true, href: "/", label: "Home" },
              { href: "/work", label: "Work" },
              { href: "/about", label: "About" },
            ],
          }),
        ].join(""),
      }),
    }),
  }),
  children: renderSetContainer({
    children: renderSetBox({
      paddingBlock: "2xl",
      paddingInline: "none",
      children: renderSetGrid({
        children: renderSetGridItem({
          colSpan: 6,
          colSpanNarrow: 12,
          children: renderSetStack({
            align: "start",
            gap: "lg",
            children: [
              renderSetHeading({
                level: 1,
                responsive: true,
                size: "4xl",
                text: "A heading that anchors the section",
              }),
              renderSetText({
                as: "p",
                children:
                  "Supporting copy that introduces the topic. Set's Text component handles the type scale and measure so this paragraph reads well at any viewport.",
              }),
              renderSetButton({
                appearance: "solid",
                label: "Get started",
                size: "lg",
              }),
            ].join(""),
          }),
        }),
      }),
    }),
  }),
  footer: renderSetContainer({
    gutter: "narrow",
    maxInlineSize: "wide",
    children: [
      renderSetDivider({ tone: "brand" }),
      renderSetBox({
        paddingBlock: "sm",
        paddingInline: "none",
        responsive: true,
        children: renderSetText({
          as: "p",
          tone: "muted",
          children: "© 2026 Brand",
        }),
      }),
    ].join(""),
  }),
});

const html = renderSetRoot({
  appOverscrollBehavior: "none",
  appRoot: true,
  children: page,
});
```

## What's compositional here

- **Root** wraps the app, emitting the `.set` scoping class every component's CSS targets. `appRoot` marks this as the owning app root.
- **Page** owns the shell layout. Header is sticky.
- **Container** bounds the header, main, and footer. The header / footer use a wider `gutter` and `maxInlineSize`; main keeps the default reading width.
- **Box** carries vertical padding rhythm — `sm` for header, `2xl` for main, `md` for footer.
- **Inline** lays out the logo and nav with `justify: "between"`.
- **Nav** is a structural component that handles collapse / expander wiring at narrow viewports.
- **Grid** + **GridItem** lay the main content on the 12-column responsive system. The item spans 6 columns at the default container threshold and falls back to all 12 at narrow viewports — the breakpoint behavior is built into the primitive.
- **Stack** stacks the heading, copy, and CTA inside the grid item with a consistent `gap`. No margins.
- **Heading**, **Text**, **Button**, **Logo**, **Divider** are content leaves.

Main content runs the canonical chassis — **Root → Page → Container → Grid → GridItem → Stack → leaves** — with **Box** providing the section padding around the Grid (Box is a flexible primitive, applied wherever padding / background / border is needed; it has no fixed position in the chain). Site furniture (header, footer) rarely needs the column system, so it nests more simply: **Container → Inline → leaves**, again with Box where padding rhythm is needed.

No custom CSS.
