import "./Stepper.css";

import {
  Box,
  Button,
  Container,
  Grid,
  GridItem,
  Icon,
  Inline,
  Root,
  Stack,
} from "@monospaced/set-react";
import { useState } from "react";

type Step = { label: string; number: number };
type StepState = "current" | "done" | "upcoming";

const steps: Step[] = [
  { number: 1, label: "Plan" },
  { number: 2, label: "Build" },
  { number: 3, label: "Ship" },
];

function getStepState(index: number, currentStep: number): StepState {
  if (currentStep >= steps.length) return "done";
  if (index < currentStep) return "done";
  if (index === currentStep) return "current";
  return "upcoming";
}

function Stepper({ currentStep }: { currentStep: number }) {
  return (
    <ol className="app-stepper">
      {steps.map(({ number, label }, index) => {
        const state = getStepState(index, currentStep);

        return (
          <li
            key={number}
            className="step"
            data-state={state}
            {...(state === "current" ? { "aria-current": "step" } : {})}
          >
            <span className="bubble" aria-hidden="true">
              <span className="bubble-number">{number}</span>
              <span className="bubble-icon">
                <Icon name="check" size="xs" />
              </span>
            </span>
            <span className="label">
              {label}
              {state === "done" ? (
                <span className="visually-hidden">, completed</span>
              ) : null}
              {state === "current" ? (
                <span className="visually-hidden">, current step</span>
              ) : null}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

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
