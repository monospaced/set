import { buildBaseContext, matchesScope } from "../resolve-context-tree.mjs";
import { isObject } from "./json.mjs";

/**
 * Context enumeration and classification helpers shared by the consumer
 * output stages (`prepare-json-output.mjs`, `prepare-react-native-output.mjs`).
 *
 * Both stages fully resolve every relevant context permutation and then
 * ask, per token, which modifier axes its value actually depends on. The
 * enumeration mirrors the CSS pipeline so no output has missing or extra
 * contexts.
 */

/**
 * Computes the cartesian product of modifier-context tuples.
 *
 * @param {Array<Array<Record<string, string>>>} groups
 * @returns {Array<Record<string, string>>}
 */
export function cartesianProduct(groups) {
  return groups.reduce(
    (acc, group) =>
      acc.flatMap((combo) => group.map((value) => ({ ...combo, ...value }))),
    [{}],
  );
}

/**
 * Enumerates the relevant context tuples to resolve for the consumer artifact.
 *
 * Base axes (no scope) cartesian-multiply normally. State axes (with scope)
 * only emit non-default values where the scope predicate matches. This mirrors
 * the same enumeration the CSS pipeline does, ensuring no missing or extra
 * context entries in the consumer JSON.
 *
 * @param {string[]} modifierOrder
 * @param {Record<string, unknown>} modifiers
 * @param {Record<string, unknown>} modifierBuildDefs
 * @returns {Array<Record<string, string>>}
 */
export function enumerateContexts(modifierOrder, modifiers, modifierBuildDefs) {
  const baseAxes = [];
  const stateAxes = [];

  for (const name of modifierOrder) {
    const modifierDef = modifierBuildDefs?.[name] ?? {};

    if (isObject(modifierDef.scope)) stateAxes.push(name);
    else baseAxes.push(name);
  }

  const baseGroups = baseAxes.map((axisName) => {
    const contexts = Object.keys(modifiers[axisName]?.contexts ?? {});

    if (contexts.length === 0) {
      throw new Error(`Modifier "${axisName}" has no contexts.`);
    }

    return contexts.map((ctx) => ({ [axisName]: ctx }));
  });

  const baseCombos = cartesianProduct(baseGroups);
  const out = [];

  for (const baseCombo of baseCombos) {
    out.push(buildBaseContext(modifierOrder, modifiers, baseCombo));

    for (const stateAxis of stateAxes) {
      const stateModifier = modifiers[stateAxis];
      const stateContexts = Object.keys(stateModifier?.contexts ?? {});
      const defaultState = stateModifier?.default ?? stateContexts[0];
      const stateModifierDef = modifierBuildDefs?.[stateAxis] ?? {};

      if (!matchesScope(baseCombo, stateModifierDef.scope)) continue;

      for (const stateContext of stateContexts) {
        if (stateContext === defaultState) continue;

        out.push(
          buildBaseContext(modifierOrder, modifiers, {
            ...baseCombo,
            [stateAxis]: stateContext,
          }),
        );
      }
    }
  }

  return out;
}

/**
 * Strips internal-only `$extensions` namespaces before emission.
 *
 * Keeps any third-party `$extensions` the source declares; removes
 * Set-internal bridge / build metadata that consumers shouldn't depend
 * on.
 *
 * @param {unknown} node
 * @returns {unknown}
 */
export function stripInternalExtensions(node) {
  if (!isObject(node)) return node;

  const out = {};

  for (const [key, value] of Object.entries(node)) {
    if (key === "$extensions" && isObject(value)) {
      const filtered = {};

      for (const [extKey, extValue] of Object.entries(value)) {
        if (extKey.startsWith("co.monospaced.set")) continue;
        filtered[extKey] = extValue;
      }

      if (Object.keys(filtered).length > 0) out[key] = filtered;
      continue;
    }

    out[key] = value;
  }

  return out;
}

/**
 * Parses a context tuple identifier (positional values joined by `-`, e.g.
 * `"baseline-lightDefault-off"`) into an axis-keyed object using the
 * modifier order from the resolver.
 *
 * @param {string} ctxId
 * @param {string[]} modifierOrder
 * @returns {Record<string, string>}
 */
export function parseCtxId(ctxId, modifierOrder) {
  const out = {};

  if (!ctxId) return out;

  const parts = ctxId.split("-");

  for (let i = 0; i < modifierOrder.length && i < parts.length; i += 1) {
    out[modifierOrder[i]] = parts[i];
  }

  return out;
}

/**
 * Tests whether the token value is fully determined by a given subset of
 * modifier axes. Groups every observed context by its projection onto `axes`
 * and returns false if any group contains differing values.
 *
 * @param {string[]} axes
 * @param {Record<string, { $value: unknown, $extensions?: unknown }>} valueByCtx
 * @returns {boolean}
 */
export function valueOnlyDependsOn(axes, valueByCtx, modifierOrder) {
  const groups = new Map();

  for (const [ctxId, value] of Object.entries(valueByCtx)) {
    const parsed = parseCtxId(ctxId, modifierOrder);
    const key = axes.map((a) => `${a}=${parsed[a] ?? ""}`).join(",");
    const valueKey = JSON.stringify(value);

    if (groups.has(key)) {
      if (groups.get(key) !== valueKey) return false;
    } else {
      groups.set(key, valueKey);
    }
  }

  return true;
}

/**
 * Identifies which modifier axes the token's value actually depends on.
 *
 * An axis is varying iff fixing every other axis still leaves the value
 * indeterminate — i.e., projecting the contexts onto `modifierOrder \ {axis}`
 * yields a group with mismatched values.
 *
 * @param {Record<string, { $value: unknown, $extensions?: unknown }>} valueByCtx
 * @param {string[]} modifierOrder
 * @returns {string[]}
 */
export function findVaryingModifiers(valueByCtx, modifierOrder) {
  const varying = [];

  for (const axis of modifierOrder) {
    const otherAxes = modifierOrder.filter((a) => a !== axis);

    if (!valueOnlyDependsOn(otherAxes, valueByCtx, modifierOrder)) {
      varying.push(axis);
    }
  }

  return varying;
}

/**
 * Capitalises the first character of a string for `by<Axis>` field naming.
 *
 * @param {string} s
 * @returns {string}
 */
export function capitalize(s) {
  return s.length === 0 ? s : `${s[0].toUpperCase()}${s.slice(1)}`;
}

/**
 * Normalises one token path segment to the same kebab-case form used by CSS
 * custom property output.
 *
 * @param {string} segment
 * @returns {string}
 */
export function toKebab(segment) {
  return segment
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/([A-Z]+)([A-Z][a-z0-9]+)/g, "$1-$2")
    .replace(/[^A-Za-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();
}
