import type mnsp from "@monospaced/set-tokens/react-native/mnsp";
import type wrfr from "@monospaced/set-tokens/react-native/wrfr";

/**
 * A brand token module from `@monospaced/set-tokens/react-native/<brand>`.
 * Any brand Set publishes is accepted; components are typed against the
 * tokens every brand shares (see `SetTokens`).
 */
export type SetBrandTokens = typeof mnsp | typeof wrfr;

export type SetColorScheme = "light" | "dark";
export type SetSurfaceVariant = "default" | "brand";
export type SetSizeContext = keyof typeof mnsp.size;

// -----------------------------------------------------------------------------
// Types.
//
// A brand module is three partitions (static / size.<context> /
// theme.<scheme>.<surface>). The resolved token set for one context is their
// deep merge. Brands may publish different token sets (e.g. a data palette
// only one brand has), so the type components program against is the
// structural intersection of the brands' resolved shapes: a token is
// addressable only if every brand has it.
// -----------------------------------------------------------------------------

type Resolved<T extends SetBrandTokens> = T["static"] &
  T["size"][keyof T["size"]] &
  T["theme"]["light"]["default"];

/**
 * Widens a literal to its primitive when two brands disagree on a value, so
 * `SetTokens` stays truthful for whichever brand is loaded. Literal types
 * survive where every brand agrees (sizes, weights, radii), which is what
 * React Native's own style types want for `fontWeight`.
 */
type Widen<T> = T extends readonly [unknown, unknown, unknown, unknown]
  ? readonly [number, number, number, number]
  : T extends readonly unknown[]
    ? readonly number[]
    : T extends string
      ? string
      : T extends number
        ? number
        : T;

type Common<A, B> = {
  readonly [K in keyof A & keyof B]: A[K] extends readonly unknown[]
    ? A[K] extends B[K]
      ? A[K]
      : Widen<A[K]>
    : A[K] extends object
      ? B[K] extends object
        ? Common<A[K], B[K]>
        : never
      : A[K] extends B[K]
        ? A[K]
        : Widen<A[K]>;
};

/** Tokens resolved for one scheme × surface × size, common to every brand. */
export type SetTokens = Common<Resolved<typeof mnsp>, Resolved<typeof wrfr>>;

export interface SetTokenContext {
  readonly colorScheme: SetColorScheme;
  readonly size: SetSizeContext;
  readonly surface: SetSurfaceVariant;
}

// -----------------------------------------------------------------------------
// Resolution.
// -----------------------------------------------------------------------------

type Tree = Record<string, unknown>;

const isGroup = (value: unknown): value is Tree =>
  value !== null &&
  typeof value === "object" &&
  !Array.isArray(value) &&
  !("fontSize" in value) &&
  !("shadowColor" in value);

function merge(target: Tree, source: Tree): Tree {
  for (const [key, value] of Object.entries(source)) {
    const existing = target[key];

    target[key] =
      isGroup(value) && isGroup(existing)
        ? merge({ ...existing }, value)
        : value;
  }

  return target;
}

const cache = new WeakMap<SetBrandTokens, Map<string, SetTokens>>();

/**
 * Resolves a brand module to the token set for one context by deep-merging
 * `static`, the size slice and the theme × surface slice. Results are
 * memoised per module and context so components receive stable references.
 */
export function resolveSetTokens(
  source: SetBrandTokens,
  context: SetTokenContext,
): SetTokens {
  const key = `${context.size}|${context.colorScheme}|${context.surface}`;
  let perSource = cache.get(source);

  if (!perSource) {
    perSource = new Map();
    cache.set(source, perSource);
  }

  const cached = perSource.get(key);

  if (cached) return cached;

  const sizeSlice = (source.size as Record<string, Tree>)[context.size];
  const themeSlice = (
    source.theme as Record<SetColorScheme, Record<SetSurfaceVariant, Tree>>
  )[context.colorScheme][context.surface];

  if (!sizeSlice) {
    throw new Error(`Unknown size context "${context.size}".`);
  }
  if (!themeSlice) {
    throw new Error(
      `Unknown theme slice "${context.colorScheme}.${context.surface}".`,
    );
  }

  const resolved = merge(
    merge(merge({}, source.static as Tree), sizeSlice),
    themeSlice,
  ) as unknown as SetTokens;

  perSource.set(key, resolved);

  return resolved;
}

/**
 * Picks the size context for a viewport width, mirroring the CSS target's
 * `min-width` media queries against the brand's breakpoint tokens.
 */
export function resolveSetSizeContext(
  source: SetBrandTokens,
  width: number,
): SetSizeContext {
  const { breakpoint } = source.static;
  const contexts = Object.keys(source.size) as SetSizeContext[];
  const pick = (name: SetSizeContext): boolean =>
    contexts.includes(name) &&
    width >= breakpoint[name as keyof typeof breakpoint];

  if (pick("laptop")) return "laptop";
  if (pick("notebook")) return "notebook";
  if (pick("tablet")) return "tablet";

  return "baseline";
}
