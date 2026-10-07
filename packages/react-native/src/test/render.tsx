import mnsp from "@monospaced/set-tokens/react-native/mnsp";
import { act, type ReactNode } from "react";
import { createRoot, type Root } from "react-dom/client";

import { SetProvider, type SetProviderProps } from "../provider";

/**
 * Mounts a tree inside `SetProvider` via react-native-web and returns the
 * container plus an unmount. Tests read the DOM react-native-web renders.
 */
export function render(
  ui: ReactNode,
  provider: Partial<Omit<SetProviderProps, "children">> = {},
): { container: HTMLElement; unmount: () => void } {
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root: Root = createRoot(container);

  act(() => {
    root.render(
      <SetProvider
        colorScheme="light"
        size="baseline"
        tokens={mnsp}
        {...provider}
      >
        {ui}
      </SetProvider>,
    );
  });

  return {
    container,
    unmount: () => {
      act(() => root.unmount());
      container.remove();
    },
  };
}
