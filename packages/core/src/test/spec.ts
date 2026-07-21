import { describe, expect, it } from "vitest";

import {
  type SetComponentSpec,
  type SetComponentSpecProp,
  type SetSpecAttributeRule,
  type SetSpecPropType,
  collectConditionProps,
  collectValueProps,
  evaluateSpecCondition,
  resolveSpecValue,
} from "../spec";

export interface SpecConsistencyConfig<Props> {
  readonly spec: SetComponentSpec;
  readonly renderer: (props: Props) => string;
  readonly baseProps: Props;
  /**
   * Extra props to merge when probing a specific prop, to satisfy cross-prop
   * constraints declared in the SPEC (for example a `requiredWhen` partner).
   * Keyed by the prop being probed.
   */
  readonly propOverrides?: Readonly<Record<string, Partial<Props>>>;
}

export function describeSpecConsistency<Props extends object>(
  config: SpecConsistencyConfig<Props>,
): void {
  const { spec, renderer, baseProps, propOverrides = {} } = config;

  describe(`${spec.name} SPEC consistency`, () => {
    for (const [name, prop] of Object.entries(spec.props)) {
      const overrides = propOverrides[name] ?? {};

      it(`declares a non-empty description for "${name}"`, () => {
        expect(prop.description?.trim()).toBeTruthy();
      });

      if (prop.default !== undefined) {
        it(`renderer default for "${name}" matches SPEC-declared default`, () => {
          const base = { ...baseProps, ...overrides };
          delete (base as Record<string, unknown>)[name];

          const omitted = renderer(base as Props);
          const explicit = renderer({
            ...base,
            [name]: prop.default,
          } as Props);

          expect(omitted).toBe(explicit);
        });
      }

      if (prop.type.kind === "enum") {
        for (const value of prop.type.values) {
          it(`renders without throwing when "${name}" is ${JSON.stringify(value)}`, () => {
            expect(() =>
              renderer({ ...baseProps, ...overrides, [name]: value } as Props),
            ).not.toThrow();
          });
        }
      }
    }

    for (const [name, event] of Object.entries(spec.events)) {
      it(`declares a non-empty description for event "${name}"`, () => {
        expect(event.description?.trim()).toBeTruthy();
      });

      it(`uses the set- prefix for event "${name}"`, () => {
        expect(name.startsWith("set-")).toBe(true);
      });
    }
  });

  describeRuleConsistency({ spec, renderer, baseProps, propOverrides });
}

// -----------------------------------------------------------------------------
// Rule consistency.
//
// For each attribute rule, probe a bounded cross-product over the props the
// rule references and assert the renderer's actual output on the target
// element matches what the rule declares.
// -----------------------------------------------------------------------------

const SAMPLE_STRING = "probe";
const SAMPLE_ICON = "X";

const probeValuesForType = (type: SetSpecPropType): ReadonlyArray<unknown> => {
  switch (type.kind) {
    case "boolean":
      return [true, false, undefined];
    case "enum":
      return [...type.values, undefined];
    case "number":
      return [type.min ?? 0, type.max ?? 1, undefined];
    case "string":
    case "text":
    case "html":
      return [SAMPLE_STRING, "", undefined];
    case "iconName":
      return [SAMPLE_ICON, "", undefined];
    case "array":
      return [[], undefined];
    case "union":
      return [
        ...new Set(
          type.variants.flatMap((variant) => probeValuesForType(variant)),
        ),
      ];
  }
};

const probeValues = (prop: SetComponentSpecProp): ReadonlyArray<unknown> => {
  const raw = probeValuesForType(prop.type);
  if (!prop.required) return raw;
  return raw.filter((value) => value !== undefined && value !== "");
};

const cartesian = <T>(lists: ReadonlyArray<ReadonlyArray<T>>): T[][] => {
  if (lists.length === 0) return [[]];
  const [head, ...rest] = lists;
  const tail = cartesian(rest);
  return head.flatMap((value) => tail.map((combo) => [value, ...combo]));
};

const resolveHostElement = (html: string): Element => {
  document.body.innerHTML = html;
  const host = document.body.firstElementChild;
  if (!host) throw new Error("Renderer produced no root element.");
  return host;
};

const resolveTargetElement = (
  rule: SetSpecAttributeRule,
  html: string,
): Element | null => {
  const host = resolveHostElement(html);
  if (rule.target.on === "host") return host;
  return host.querySelector(rule.target.selector);
};

const formatProbe = (probe: Readonly<Record<string, unknown>>): string =>
  Object.entries(probe)
    .map(([k, v]) => `${k}=${JSON.stringify(v)}`)
    .join(", ") || "(baseline)";

interface RuleConsistencyConfig<Props> {
  readonly spec: SetComponentSpec;
  readonly renderer: (props: Props) => string;
  readonly baseProps: Props;
  readonly propOverrides: Readonly<Record<string, Partial<Props>>>;
}

function describeRuleConsistency<Props extends object>(
  config: RuleConsistencyConfig<Props>,
): void {
  const { spec, renderer, baseProps, propOverrides } = config;

  describe(`${spec.name} rule consistency`, () => {
    const groups = new Map<string, SetSpecAttributeRule[]>();
    for (const rule of spec.rules.attributes) {
      const key =
        rule.target.on === "host"
          ? `host|${rule.attribute}`
          : `descendant:${rule.target.selector}|${rule.attribute}`;
      const list = groups.get(key) ?? [];
      list.push(rule);
      groups.set(key, list);
    }

    for (const rules of groups.values()) {
      const representative = rules[0];
      const referencedSet = new Set<string>();
      for (const rule of rules) {
        for (const p of collectConditionProps(rule.condition))
          referencedSet.add(p);
        for (const p of collectValueProps(rule.value)) referencedSet.add(p);
      }
      const referenced = [...referencedSet];

      const baselineOverrides: Record<string, unknown> = {};
      for (const propName of referenced) {
        Object.assign(baselineOverrides, propOverrides[propName] ?? {});
      }

      const valueLists = referenced.map((name) => {
        const prop = spec.props[name];
        return prop ? probeValues(prop) : [undefined];
      });

      const combos = cartesian(valueLists);
      const groupLabel = `[${representative.attribute}] on ${
        representative.target.on === "host"
          ? "host"
          : representative.target.selector
      }`;

      for (const combo of combos) {
        const probe: Record<string, unknown> = {
          ...(baseProps as unknown as Record<string, unknown>),
          ...baselineOverrides,
        };
        referenced.forEach((name, index) => {
          if (combo[index] === undefined) {
            delete probe[name];
          } else {
            probe[name] = combo[index];
          }
        });

        const firing = rules.filter((rule) =>
          evaluateSpecCondition(rule.condition, probe, spec),
        );
        const expectedFires = firing.length > 0;
        const expectedValue = expectedFires
          ? resolveSpecValue(firing[firing.length - 1].value, probe, spec)
          : undefined;

        it(`${groupLabel} with ${formatProbe(
          Object.fromEntries(referenced.map((n, i) => [n, combo[i]])),
        )}`, () => {
          const html = renderer(probe as Props);
          const target = resolveTargetElement(representative, html);

          if (!target) {
            expect(expectedFires).toBe(false);
            return;
          }

          if (!expectedFires) {
            expect(target.hasAttribute(representative.attribute)).toBe(false);
            return;
          }

          expect(target.hasAttribute(representative.attribute)).toBe(true);
          if (expectedValue?.kind === "value") {
            expect(target.getAttribute(representative.attribute)).toBe(
              expectedValue.text,
            );
          }
        });
      }
    }
  });
}
