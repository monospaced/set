import {
  Alert,
  Banner,
  Box,
  Button,
  Checkbox,
  Container,
  Divider,
  Grid,
  GridItem,
  Heading,
  Inline,
  Input,
  Link,
  Logo,
  Menu,
  Page,
  Radios,
  Range,
  Root,
  Sidebar,
  Stack,
  Surface,
  Switch,
  Text,
  Textarea,
} from "@monospaced/set-react";
import { useCallback, useEffect, useRef, useState } from "react";

function useLiveAnnouncer() {
  const [message, setMessage] = useState("");
  const timeoutRef = useRef<number | null>(null);

  const announce = useCallback((next: string) => {
    if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current);
    setMessage("");
    timeoutRef.current = window.setTimeout(() => {
      setMessage(next);
      timeoutRef.current = null;
    }, 10);
  }, []);

  useEffect(
    () => () => {
      if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current);
    },
    [],
  );

  return { announce, message };
}

const simpleIcons = {
  gitHub: `<svg aria-hidden="true" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" fill="currentColor"/></svg>`,
};

function RawSvg({ html }: { html: string }) {
  return <span dangerouslySetInnerHTML={{ __html: html }} />;
}

function Header({ announce }: { announce: (message: string) => void }) {
  return (
    <Container gutter="narrow" maxInlineSize="none">
      <Box paddingBlock="xs" paddingInline="none">
        <Inline gap="sm" justify="between">
          <Inline gap="xs">
            <Sidebar
              aboveNotebook="overlay"
              id="sidebar"
              header={
                <Box background="panel" paddingBlock="none" paddingInline="sm">
                  <Heading size="lg" text="Playground." />
                </Box>
              }
              footer={
                <Box background="panel" paddingBlock="none" paddingInline="sm">
                  Footer
                </Box>
              }
            >
              <Box background="panel" paddingBlock="xs" paddingInline="xs">
                <Box
                  background="panel"
                  border
                  radius="sm"
                  paddingBlock="xs"
                  paddingInline="xs"
                >
                  Content
                </Box>
              </Box>
            </Sidebar>
            <a href="/">
              <Heading size="lg" text="Playground." />
            </a>
          </Inline>
          <Inline align="end" gap="xs">
            <Menu
              align="end"
              id="exportMenu"
              items={[
                { id: "hi-res", label: "Hi-res" },
                { id: "vector", label: "Vector" },
                { id: "web", label: "Web" },
              ]}
              triggerIcon="download"
              triggerLabel="Export"
              triggerLabelVisibility="hiddenBelowTablet"
              size="sm"
              onChoose={(event) =>
                announce(`Export: ${event.detail.label} chosen`)
              }
            />
            <Button
              label="16:9"
              size="sm"
              tone="neutral"
              onClick={() => announce("Aspect ratio clicked")}
            />
            <Button
              icon="shuffle"
              appearance="solid"
              label="Shuffle"
              labelVisibility="hiddenBelowTablet"
              size="sm"
              onClick={() => announce("Shuffle clicked")}
            />
            <Button
              icon="dice5"
              appearance="solid"
              label="Randomise"
              labelVisibility="hiddenBelowTablet"
              size="sm"
              onClick={() => announce("Randomise clicked")}
            />
          </Inline>
        </Inline>
      </Box>
    </Container>
  );
}

function Footer() {
  return (
    <Container gutter="narrow" maxInlineSize="none">
      <Box paddingBlock="xs" paddingInline="none">
        <Inline align="end" gap="xs" justify="between">
          <a
            href="/"
            style={{ marginBlockEnd: "var(--set-spacing-vertical-400)" }}
          >
            <Logo
              label="Monospaced"
              size="sm"
              tone="neutral"
              variant="graphic"
            />
          </a>
          <Inline align="end" as="ul" gap="sm">
            <li>
              <Link
                href="#"
                icon={<RawSvg html={simpleIcons.gitHub} />}
                label="View source"
                size="sm"
                tone="neutral"
              />
            </li>
            <li>
              <Link href="/" label="About" size="sm" tone="neutral" />
            </li>
            <li>
              <Link href="/" label="Monospaced" size="sm" tone="neutral" />
            </li>
          </Inline>
        </Inline>
      </Box>
    </Container>
  );
}

export function App() {
  const { announce, message } = useLiveAnnouncer();
  const [email, setEmail] = useState("person@example.com");
  const [spam, setSpam] = useState(60);
  const [updates, setUpdates] = useState(false);
  const [urgentNotifications, setUrgentNotifications] = useState(false);
  const [contactMethod, setContactMethod] = useState("email");
  const [messageDraft, setMessageDraft] = useState(
    "Hi team, I need help with my account settings.",
  );

  return (
    <Root appOverscrollBehavior="none" appRoot>
      <Surface>
        <Page
          centerMain
          header={<Header announce={announce} />}
          headerSize="md"
          footer={<Footer />}
          banner={
            <Banner
              actionHref="/"
              actionLabel="Action"
              message="Message."
              onDismiss={() => announce("Banner dismissed")}
            />
          }
        >
          <Container gutter="narrow">
            <Box paddingBlock="2xl" paddingInline="none">
              <Grid>
                <GridItem
                  colSpan={4}
                  colStart={5}
                  colSpanNarrow={6}
                  colStartNarrow={4}
                >
                  <Stack gap="sm">
                    <Text size="sm">
                      <Alert
                        message={message || "Waiting for events…"}
                        size="sm"
                        tone="info"
                      />
                    </Text>
                    <Divider />
                    <Heading size="xl" text="Form" />
                    <Input
                      description="We'll only use this for account updates."
                      id="playground-email"
                      label="Email"
                      name="email"
                      onChange={(event) => {
                        if (event.target instanceof HTMLInputElement) {
                          setEmail(event.target.value);
                        }
                      }}
                      size="sm"
                      type="email"
                      value={email}
                    />
                    <Range
                      description="Set your spam tolerance level."
                      id="playground-spam"
                      label="Spam"
                      max={100}
                      min={0}
                      name="volume"
                      onChange={(event) => {
                        if (event.target instanceof HTMLInputElement) {
                          setSpam(Number(event.target.value));
                        }
                      }}
                      size="sm"
                      value={spam}
                    />
                    <Checkbox
                      checked={updates}
                      description="You can unsubscribe at any time."
                      id="playground-updates"
                      label="Send me product updates"
                      name="updates"
                      onChange={(event) => {
                        if (event.target instanceof HTMLInputElement) {
                          setUpdates(event.target.checked);
                        }
                      }}
                      size="sm"
                      value="yes"
                    />
                    <Switch
                      checked={urgentNotifications}
                      description="Enable this to receive urgent notifications."
                      id="playground-notifications"
                      label="Urgent notifications"
                      name="urgentNotifications"
                      onChange={(event) => {
                        if (event.target instanceof HTMLInputElement) {
                          setUrgentNotifications(event.target.checked);
                        }
                      }}
                      size="sm"
                      value="yes"
                    />
                    <Radios
                      description="Choose one contact method."
                      id="playground-contact-method"
                      legend="Contact Method"
                      name="contactMethod"
                      onChange={(event) => {
                        if (event.target instanceof HTMLInputElement) {
                          setContactMethod(event.target.value);
                        }
                      }}
                      radios={[
                        { label: "Email", value: "email" },
                        { label: "SMS", value: "sms" },
                      ]}
                      size="sm"
                      value={contactMethod}
                    />
                    <Textarea
                      description="Add any context that will help our support team."
                      id="playground-message"
                      label="Message"
                      name="message"
                      onChange={(event) => {
                        if (event.target instanceof HTMLTextAreaElement) {
                          setMessageDraft(event.target.value);
                        }
                      }}
                      rows={2}
                      size="sm"
                      value={messageDraft}
                    />
                    <Inline gap="sm">
                      <Button
                        appearance="solid"
                        label="Continue"
                        size="sm"
                        tone="default"
                        type="button"
                        onClick={() => announce("Continue clicked")}
                      />
                      <Button
                        appearance="outline"
                        label="Back"
                        size="sm"
                        tone="neutral"
                        type="button"
                        onClick={() => announce("Back clicked")}
                      />
                    </Inline>
                  </Stack>
                </GridItem>
              </Grid>
            </Box>
          </Container>
        </Page>
      </Surface>
    </Root>
  );
}
