# Full page (react)

A complete page composition: branded header with nav, a content intro section laid on the 12-column responsive grid, footer. Built entirely from Set components — no custom CSS.

```tsx
import {
  Box,
  Button,
  Container,
  Divider,
  Grid,
  GridItem,
  Heading,
  Inline,
  Logo,
  Nav,
  Page,
  Root,
  Stack,
  Text,
} from "@monospaced/set-react";

export function App() {
  return (
    <Root appOverscrollBehavior="none" appRoot>
      <Page
        headerBorder="scroll"
        headerSize="lg"
        stickyHeader="always"
        header={
          <Container gutter="narrow" maxInlineSize="wide">
            <Box paddingBlock="sm" paddingInline="none" responsive>
              <Inline gap="sm" justify="between">
                <a href="/">
                  <Logo label="Brand" variant="secondary" />
                </a>
                <Nav
                  collapsible="belowTablet"
                  contentId="site-nav"
                  expanderPosition="end"
                  items={[
                    { current: true, href: "/", label: "Home" },
                    { href: "/work", label: "Work" },
                    { href: "/about", label: "About" },
                  ]}
                />
              </Inline>
            </Box>
          </Container>
        }
        footer={
          <Container gutter="narrow" maxInlineSize="wide">
            <Divider tone="brand" />
            <Box paddingBlock="sm" paddingInline="none" responsive>
              <Text as="p" tone="muted">
                © 2026 Brand
              </Text>
            </Box>
          </Container>
        }
      >
        <Container>
          <Box paddingBlock="2xl" paddingInline="none">
            <Grid>
              <GridItem colSpan={6} colSpanNarrow={12}>
                <Stack align="start" gap="lg">
                  <Heading
                    level={1}
                    responsive
                    size="4xl"
                    text="A heading that anchors the section"
                  />
                  <Text as="p">
                    Supporting copy that introduces the topic. Set's Text
                    component handles the type scale and measure so this
                    paragraph reads well at any viewport.
                  </Text>
                  <Button appearance="solid" label="Get started" size="lg" />
                </Stack>
              </GridItem>
            </Grid>
          </Box>
        </Container>
      </Page>
    </Root>
  );
}
```

## What's compositional here

- **Root** wraps the app, emitting the `.set` scoping class every component's CSS targets. `appRoot` marks this as the owning app root.
- **Page** owns the shell layout. Header is sticky.
- **Container** bounds the header, main, and footer. The header / footer use a wider `gutter` and `maxInlineSize`; main keeps the default reading width.
- **Box** carries vertical padding rhythm — `sm` for header, `2xl` for main, `md` for footer.
- **Inline** lays out the logo and nav with `justify="between"`.
- **Nav** is a structural component that handles collapse / expander wiring at narrow viewports.
- **Grid** + **GridItem** lay the main content on the 12-column responsive system. The item spans 6 columns at the default container threshold and falls back to all 12 at narrow viewports — the breakpoint behavior is built into the primitive.
- **Stack** stacks the heading, copy, and CTA inside the grid item with a consistent `gap`. No margins.
- **Heading**, **Text**, **Button**, **Logo**, **Divider** are content leaves.

Main content runs the canonical chassis — **Root → Page → Container → Grid → GridItem → Stack → leaves** — with **Box** providing the section padding around the Grid (Box is a flexible primitive, applied wherever padding / background / border is needed; it has no fixed position in the chain). Site furniture (header, footer) rarely needs the column system, so it nests more simply: **Container → Inline → leaves**, again with Box where padding rhythm is needed.

No custom CSS.
