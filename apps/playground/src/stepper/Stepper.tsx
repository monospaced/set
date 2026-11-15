import "./Stepper.css";

import { Icon } from "@monospaced/set-react";

type Step = { label: string; number: number };
type StepState = "current" | "done" | "upcoming";

export const steps: Step[] = [
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

export function Stepper({ currentStep }: { currentStep: number }) {
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
