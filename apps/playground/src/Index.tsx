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
            <Heading
              level={1}
              opticalAlign={true}
              size="xl"
              text="Set playground"
            />
            <Stack as="ul" gap="xs">
              <li>
                <Link href="#app" label="Kitchen sink" />
              </li>
              <li>
                <Link href="#example" label="Skill: compose-first" />
              </li>
              <li>
                <Link href="#stepper" label="Skill: custom-with-tokens" />
              </li>
            </Stack>
          </Stack>
        </Box>
      </Container>
    </Root>
  );
}
