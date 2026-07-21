import type { SetComponentSpec } from "@measured/set-core";

/**
 * Content-shape classification for a SPEC. Framework-agnostic — used by
 * every adapter's emitter to pick the matching template.
 *
 * - `pass-through`: `content.kind` is `none`, `text`, or `structured`.
 *   Scalar props flow to `buildSet*` unchanged; no slot substitution.
 * - `slotted`: `content.kind` is `html` (one slot) or `slots` (multiple,
 *   with per-slot `text` or `html` kinds). The slotted template handles
 *   the substitution.
 *
 * Custom-element registration and event wiring are orthogonal concerns
 * layered on top of the archetype by separate contributors.
 */
export type Archetype = "pass-through" | "slotted";

export function classify(spec: SetComponentSpec): Archetype {
  switch (spec.content.kind) {
    case "none":
    case "text":
    case "structured":
      return "pass-through";
    case "html":
    case "slots":
      return "slotted";
    default: {
      const exhaustive: never = spec.content;
      throw new Error(
        `classify: unhandled content kind for "${spec.name}": ${JSON.stringify(exhaustive)}`,
      );
    }
  }
}

/** PascalCase a kebab/lower component name for type + function identifiers. */
export function pascalCase(name: string): string {
  return name
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((part) => part[0]!.toUpperCase() + part.slice(1))
    .join("");
}

/** SCREAMING_SNAKE_CASE a kebab/lower name for slot sentinel constants. */
export function screamingSnake(name: string): string {
  return name.replace(/[-\s]+/g, "_").toUpperCase();
}
