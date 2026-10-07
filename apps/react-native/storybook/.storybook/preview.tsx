import "@monospaced/set-assets/fonts.css";

import {
  type SetColorScheme,
  SetProvider,
  type SetSurfaceVariant,
  Surface,
} from "@monospaced/set-react-native";
import mnsp from "@monospaced/set-tokens/react-native/mnsp";
import wrfr from "@monospaced/set-tokens/react-native/wrfr";
import type { Preview } from "@storybook/react-native-web-vite";
import { useEffect, useState } from "react";
import { View } from "react-native";

const brands = { mnsp, wrfr } as const;

type Brand = keyof typeof brands;

/** Mirrors `useColorScheme()` for the preview chrome around the story. */
function useSystemScheme(): SetColorScheme {
  const query = "(prefers-color-scheme: dark)";
  const [scheme, setScheme] = useState<SetColorScheme>(() =>
    window.matchMedia(query).matches ? "dark" : "light",
  );

  useEffect(() => {
    const media = window.matchMedia(query);
    const onChange = () => setScheme(media.matches ? "dark" : "light");
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  return scheme;
}

const preview: Preview = {
  decorators: [
    (Story, context) => {
      const brand = (context.globals.brand as Brand) ?? "mnsp";
      const scheme =
        (context.globals.colorScheme as SetColorScheme | "system") ?? "system";
      const surface =
        (context.globals.surface as SetSurfaceVariant) ?? "default";
      const systemScheme = useSystemScheme();
      const resolved = scheme === "system" ? systemScheme : scheme;
      const tokens = brands[brand];
      const background =
        tokens.theme[resolved][surface].color.background.default;
      // As core: stories sit in a padded wrapper, overridable per story.
      const padding =
        typeof context.parameters.padding !== "undefined"
          ? context.parameters.padding
          : { paddingHorizontal: 20, paddingVertical: 28 };

      useEffect(() => {
        document.documentElement.style.backgroundColor = background;
        document.documentElement.style.colorScheme = resolved;
      }, [background, resolved]);

      return (
        <SetProvider colorScheme={scheme} tokens={tokens}>
          <Surface variant={surface}>
            <View style={padding}>
              <Story />
            </View>
          </Surface>
        </SetProvider>
      );
    },
  ],
  globalTypes: {
    brand: {
      description: "Brand",
      defaultValue: "mnsp",
      toolbar: {
        title: "Brand",
        icon: "paintbrush",
        items: [
          { title: "monospaced", value: "mnsp" },
          { title: "wireframe", value: "wrfr" },
        ],
      },
    },
    colorScheme: {
      description: "Colour scheme",
      defaultValue: "system",
      toolbar: {
        title: "Scheme",
        icon: "contrast",
        items: [
          { title: "system", value: "system" },
          { title: "light", value: "light" },
          { title: "dark", value: "dark" },
        ],
      },
    },
    surface: {
      description: "Surface",
      defaultValue: "default",
      toolbar: {
        title: "Surface",
        icon: "stacked",
        items: [
          { title: "default", value: "default" },
          { title: "brand", value: "brand" },
        ],
      },
    },
  },
  parameters: {
    a11y: { test: "error" },
    backgrounds: { disable: true },
    layout: "fullscreen",
    options: { storySort: { order: ["Introduction", "*"] } },
  },
  tags: ["autodocs"],
};

export default preview;
