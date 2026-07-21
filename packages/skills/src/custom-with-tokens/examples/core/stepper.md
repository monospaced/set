# Stepper (core)

Multi-step process indicator (onboarding, checkout, multi-page form). A row of numbered steps with `done`, `current`, and `upcoming` visual states, connected by a baseline. Set doesn't ship one, so it's a clear gap to fill.

The example exercises the layered model end-to-end: a leaf component for the done-state checkmark, custom markup for the structural pattern, tokens for every design value (with one component-scoped custom property composed from tokens), and `@keyframes` driving state transitions through motion tokens.

```ts
import { renderSetIcon, renderSetRoot } from "@monospaced/set-core";

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

function renderStateLabel(state: StepState): string {
  if (state === "done")
    return '<span class="visually-hidden">, completed</span>';
  if (state === "current")
    return '<span class="visually-hidden">, current step</span>';
  return "";
}

function renderStepper({ currentStep }: { currentStep: number }): string {
  const items = steps
    .map(({ number, label }, index) => {
      const state = getStepState(index, currentStep);
      const ariaCurrent = state === "current" ? ' aria-current="step"' : "";

      return `
        <li class="step" data-state="${state}"${ariaCurrent}>
          <span class="bubble" aria-hidden="true">
            <span class="bubble-number">${number}</span>
            <span class="bubble-icon">${renderSetIcon({
              ariaHidden: true,
              name: "check",
              size: "xs",
            })}</span>
          </span>
          <span class="label">${label}${renderStateLabel(state)}</span>
        </li>
      `;
    })
    .join("");

  return `<ol class="app-stepper">${items}</ol>`;
}

// Render inside a Set Root — the `.set` ancestor scopes both system
// CSS and your `:where(.set) .app-stepper` selector.
const html = renderSetRoot({
  appRoot: true,
  children: renderStepper({ currentStep: 1 }),
});
```

```css
@keyframes app-stepper-check-in {
  from {
    opacity: 0;
    scale: 0.7;
  }

  to {
    opacity: 1;
    scale: 1;
  }
}

:where(.set) .app-stepper {
  --app-stepper-size: var(--set-spacing-vertical-800);

  display: flex;
  list-style: none;
  margin: 0;
  padding-inline: 0;

  .bubble {
    background-color: var(--set-color-background-subtle);
    block-size: var(--app-stepper-size);
    border-radius: calc(var(--app-stepper-size) * var(--set-radius-ratio-lg));
    color: var(--set-color-foreground-muted-text);
    display: grid;
    font: var(--set-typography-text-body-xs);
    font-variant-numeric: tabular-nums;
    font-weight: var(--set-typography-font-weight-bold);
    inline-size: var(--app-stepper-size);
    place-items: center;
    position: relative;
    transition:
      background-color var(--set-motion-duration-200)
        var(--set-motion-easing-ease-in-out),
      color var(--set-motion-duration-200) var(--set-motion-easing-ease-in-out);
  }

  .bubble-icon,
  .bubble-number {
    grid-area: 1 / 1;
  }

  .bubble-icon {
    opacity: 0;
    scale: 0.7;
  }

  .label {
    color: var(--set-color-foreground-muted-text);
    font: var(--set-typography-text-body-xs);
    font-weight: var(--set-typography-font-weight-medium);
  }

  .step {
    display: grid;
    flex: 1;
    gap: var(--set-spacing-vertical-400);
    isolation: isolate;
    justify-items: center;
    position: relative;
    text-align: center;

    &::after {
      background-color: var(--set-color-border-subtle);
      block-size: var(--set-layout-border-width-thick);
      content: "";
      inline-size: 100%;
      inset-block-start: calc(
        (var(--app-stepper-size) / 2) -
          (var(--set-layout-border-width-thick) / 2)
      );
      inset-inline-start: 50%;
      position: absolute;
      z-index: -1;
    }

    &:first-child {
      justify-items: start;
    }

    &:first-child::after {
      inline-size: calc(150% - (var(--app-stepper-size) / 2));
      inset-inline-start: calc(var(--app-stepper-size) / 2);
    }

    &:first-child .label {
      translate: calc((var(--app-stepper-size) - 100%) / 2) 0;
    }

    &:nth-last-child(2)::after {
      inline-size: calc(150% - (var(--app-stepper-size) / 2));
    }

    &:last-child {
      justify-items: end;
    }

    &:last-child::after {
      display: none;
    }

    &:last-child .label {
      translate: calc((100% - var(--app-stepper-size)) / 2) 0;
    }

    &[data-state="done"]::after {
      background-color: var(--set-color-foreground-default);
    }
  }

  .step[data-state="current"] .bubble,
  .step[data-state="done"] .bubble {
    background-color: var(--set-color-foreground-default);
    color: var(--set-color-foreground-contrast);
  }

  .step[data-state="done"] .bubble-icon {
    animation: app-stepper-check-in var(--set-motion-duration-200)
      var(--set-motion-easing-ease-out);
    opacity: 1;
    scale: 1;
  }

  .step[data-state="done"] .bubble-number {
    opacity: 0;
  }

  .step[data-state="current"] .label,
  .step[data-state="done"] .label {
    color: var(--set-color-foreground-default);
  }
}
```

What sits where:

- **Leaf component for the content node.** `renderSetIcon` for the done-state checkmark — Set handles its sizing, color inheritance, and a11y. The number and the icon both render unconditionally; CSS reveals the right one for the state via `opacity` + `@keyframes`.
- **Custom markup expresses the structural pattern.** The `<ol>` / `<li>` / `<span>` skeleton captures "row of state-driven circles connected by a baseline." `aria-current="step"` carries the active-step semantics for screen readers; the bubble is `aria-hidden` because state is conveyed by both `aria-current` and the `.visually-hidden` text appended to the label (`, completed` / `, current step`). `.visually-hidden` is a Set utility class shipped from Root — no need to redefine.
- **Why not `renderSetText` for numbers and labels?** Text's prop surface doesn't expose `font-weight` or `font-variant-numeric`, and the design needs specific weights (bold for numbers, medium for labels) and tabular figures for the bubble's number to align across states. This is exactly the second branch the skill names in "When this applies" — _the case wants a visual treatment outside any existing component's prop surface_. Drop to a plain `<span>` and reach for typography composites + targeted overrides instead.
- **Composite typography token + targeted overrides.** `font: var(--set-typography-text-body-xs)` carries the system's full body-xs spec (size, family, line-height) in one declaration. Specific properties then override only the deviations: `font-weight` switches per role (`bold` / `medium`); `font-variant-numeric: tabular-nums` is a CSS keyword (no token surface) that aligns digits across states. Reaching for the composite first keeps you on the system's typography path; overrides surface only the genuine deviations.
- **Custom CSS, structural.** `display: grid` / `display: flex`, `position: relative` / `absolute`, `place-items: center`, `isolation: isolate` (creates a stacking context so the connector line's `z-index: -1` doesn't escape), edge-aware `:first-child` / `:last-child` rules for row alignment, `border-radius` derived through `calc()`.
- **Tokens for every design value.** Spacing (`--set-spacing-vertical-{400,800}`), colors (`--set-color-{foreground,background,border}-*`), border (`--set-layout-border-width-thick`), radius via `--set-radius-ratio-lg` composed against the component-scoped size, typography (`--set-typography-text-body-xs` composite, `--set-typography-font-weight-{bold,medium}` overrides), motion (`--set-motion-duration-200`, `--set-motion-easing-ease-{in-out,out}`).
- **Component-scoped custom property.** `--app-stepper-size` is defined at the component-level selector and consumed by descendants in the same file. The same-file scope keeps it local to the component (the `set/set-known-tokens` lint rule accepts same-file definitions). Tokens still drive the value (`var(--set-spacing-vertical-800)`); the custom property just gives the component one knob to compose around.
- **Animation through motion tokens.** `@keyframes app-stepper-check-in` defines the entrance transition; `animation: app-stepper-check-in var(--set-motion-duration-200) var(--set-motion-easing-ease-out)` runs it with the system's motion timing.
- **CSS architecture.** Selector wrapped in `:where(.set)` so the root sits at `0,1,0` (matching system rules); top-level class is project-prefixed (`.app-stepper`); descendants are nested unprefixed.

The `data-state` attribute is the seam between markup and styling. State semantics live on the element; state visuals are CSS rules keyed off the attribute. Adding a fourth state (e.g. `error`) is one CSS block referencing `--set-color-status-error-*` and one new value in the data.
