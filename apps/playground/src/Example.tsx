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

export function Example() {
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
              <Text as="p" size="sm" tone="muted">
                © 2026 Monospaced
              </Text>
            </Box>
          </Container>
        }
      >
        <Container>
          <Box paddingBlock="2xl" paddingInline="none">
            <Grid>
              <GridItem colSpan={6} colSpanNarrow={12}>
                <Stack gap="lg" align="start">
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
