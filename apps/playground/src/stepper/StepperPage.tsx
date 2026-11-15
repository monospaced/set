import {
  Box,
  Button,
  Container,
  Grid,
  GridItem,
  Inline,
  Root,
  Stack,
} from "@monospaced/set-react";
import { useState } from "react";

import { Stepper, steps } from "./Stepper";

export function StepperPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length;

  return (
    <Root appRoot>
      <Container gutter="narrow">
        <Box paddingBlock="2xl" paddingInline="none">
          <Grid>
            <GridItem
              colSpan={4}
              colSpanNarrow={6}
              colStart={5}
              colStartNarrow={4}
            >
              <Stack gap="md">
                <Stepper currentStep={currentStep} />
                <Inline gap="xs" justify="center">
                  <Button
                    appearance="solid"
                    disabled={isFirstStep}
                    label="Previous"
                    size="sm"
                    tone="neutral"
                    onClick={() =>
                      setCurrentStep((step) => Math.max(0, step - 1))
                    }
                  />
                  <Button
                    appearance="solid"
                    disabled={isLastStep}
                    label="Next"
                    size="sm"
                    tone="neutral"
                    onClick={() =>
                      setCurrentStep((step) => Math.min(steps.length, step + 1))
                    }
                  />
                </Inline>
              </Stack>
            </GridItem>
          </Grid>
        </Box>
      </Container>
    </Root>
  );
}
