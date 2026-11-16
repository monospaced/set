import {
  Box,
  Container,
  Heading,
  Link,
  Root,
  Stack,
} from "@monospaced/set-react";

export function Index() {
  return (
    <Root appOverscrollBehavior="none" appRoot>
      <Container>
        <Box paddingBlock="2xl" paddingInline="none">
          <Stack gap="md">
            <Heading level={1} size="xl">
              Set playground
            </Heading>
            <Stack as="ul" gap="xs">
              <li>
                <Link href="#app" label="Kitchen sink" />
              </li>
              <li>
                <Link href="#example" label="Example page" />
              </li>
              <li>
                <Link href="#stepper" label="Stepper (set-strict example)" />
              </li>
            </Stack>
          </Stack>
        </Box>
      </Container>
    </Root>
  );
}
