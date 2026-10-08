import { createContext, type ReactNode, useContext, useMemo } from "react";
import { useColorScheme, useWindowDimensions, View } from "react-native";

import {
  resolveSetSizeContext,
  resolveSetTokens,
  type SetBrandTokens,
  type SetColorScheme,
  type SetSizeContext,
  type SetSurfaceVariant,
  type SetTokenContext,
  type SetTokens,
} from "./tokens";

interface SetContextValue extends SetTokenContext {
  readonly source: SetBrandTokens;
  readonly tokens: SetTokens;
}

const SetContext = createContext<SetContextValue | null>(null);

export interface SetProviderProps {
  /** Brand token module from `@monospaced/set-tokens/react-native/<brand>`. */
  readonly tokens: SetBrandTokens;
  /**
   * Colour scheme. `"system"` follows the OS appearance; `"light"` or
   * `"dark"` pins it (a stored user preference belongs here).
   * @default "system"
   */
  readonly colorScheme?: SetColorScheme | "system";
  /**
   * Size context. Omit to derive it from the window width against the
   * brand's breakpoints; set it to pin a layout size.
   */
  readonly size?: SetSizeContext;
  readonly children?: ReactNode;
}

/**
 * Resolves Set tokens for the current colour scheme and window size and
 * provides them to descendants. The web does this in the cascade; a React
 * Native app does it here.
 */
export function SetProvider({
  children,
  colorScheme = "system",
  size,
  tokens: source,
}: SetProviderProps): ReactNode {
  const systemScheme = useColorScheme();
  const { width } = useWindowDimensions();
  const resolvedScheme: SetColorScheme =
    colorScheme === "system"
      ? systemScheme === "dark"
        ? "dark"
        : "light"
      : colorScheme;
  const resolvedSize = size ?? resolveSetSizeContext(source, width);

  const value = useMemo<SetContextValue>(() => {
    const context: SetTokenContext = {
      colorScheme: resolvedScheme,
      size: resolvedSize,
      surface: "default",
    };

    return { ...context, source, tokens: resolveSetTokens(source, context) };
  }, [resolvedScheme, resolvedSize, source]);

  return <SetContext.Provider value={value}>{children}</SetContext.Provider>;
}

function useSetContext(): SetContextValue {
  const value = useContext(SetContext);

  if (!value) {
    throw new Error("Set components must be rendered inside <SetProvider>.");
  }

  return value;
}

/** The resolved tokens for the nearest provider or surface. */
export function useSetTokens(): SetTokens {
  return useSetContext().tokens;
}

/** The colour scheme, surface and size the nearest provider or surface resolved. */
export function useSetTokenContext(): SetTokenContext {
  const { colorScheme, size, surface } = useSetContext();

  return { colorScheme, size, surface };
}

export interface SurfaceProps {
  readonly children?: ReactNode;
  /**
   * Pins the colour scheme for everything inside, regardless of the
   * provider's scheme. For regions that must stay dark (or light), such as
   * content over imagery.
   */
  readonly contentTheme?: SetColorScheme;
  readonly testID?: string;
  /** Surface context. @default "default" */
  readonly variant?: SetSurfaceVariant;
}

/**
 * A region with its own surface context. Re-resolves tokens for the
 * variant (and optional pinned scheme) and paints the surface background.
 */
export function Surface({
  children,
  contentTheme,
  testID,
  variant = "default",
}: SurfaceProps): ReactNode {
  const parent = useSetContext();

  const value = useMemo<SetContextValue>(() => {
    const context: SetTokenContext = {
      colorScheme: contentTheme ?? parent.colorScheme,
      size: parent.size,
      surface: variant,
    };

    return {
      ...context,
      source: parent.source,
      tokens: resolveSetTokens(parent.source, context),
    };
  }, [contentTheme, parent.colorScheme, parent.size, parent.source, variant]);

  return (
    <SetContext.Provider value={value}>
      <View
        style={{ backgroundColor: value.tokens.color.background.default }}
        testID={testID}
      >
        {children}
      </View>
    </SetContext.Provider>
  );
}
