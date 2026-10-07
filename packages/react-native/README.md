# @monospaced/set-react-native

React Native components for Set. A sibling to the web library, not an adapter: it shares Set's tokens through `@monospaced/set-tokens` and adapts the system to native paradigms, using `@monospaced/set-core` as the reference for naming, intent and visual language. See [ADR-0002](../../docs/adr/0002-core-is-web-only-native-targets-share-tokens.md).

## Usage

```tsx
import mnsp from "@monospaced/set-tokens/react-native/mnsp";
import {
  Avatar,
  Button,
  SetProvider,
  Surface,
} from "@monospaced/set-react-native";

export function App() {
  return (
    <SetProvider tokens={mnsp}>
      <Surface>
        <Avatar name="Ada Lovelace" />
        <Button label="Save" onPress={save} />
      </Surface>
    </SetProvider>
  );
}
```

`SetProvider` resolves tokens for the OS colour scheme and the window width. Pass `colorScheme="dark"` or `"light"` to pin it (a stored user preference goes there) and `size` to pin a layout size. `Surface` opens a region with its own surface context (`default` or `brand`) and can pin a scheme for its contents with `contentTheme`.

`react-native-svg` is a peer dependency, for `Icon`. Components read tokens through `useSetTokens()`, which any custom component can use too. Fonts are the app's to load: `Berkeley Mono` must be registered (for example with `expo-font`) under the family name the tokens carry.

## Conventions

- React Native's own names win. Core's prop names are used where the concept is the same and React Native has no established name for it, so the two libraries read side by side without pretending their APIs match.
- Accessibility props use React Native's cross-platform `aria-*` and `role` names rather than the per-platform `accessibility*` family.
- Every component takes `testID`. None takes `style`: as on the web, Set is opinionated about styling and offers no arbitrary escape hatch. Layout belongs to layout components; wrapping a component in a plain `View` for one-off placement is the consumer's call, as wrapping in a `div` is on the web.
- `id` appears only where a component needs one (an accessibility relationship, for instance), not as a general escape hatch as on the web.

## Scope

Small on purpose, growing one component at a time:

- `Icon` — core's icon registry drawn with `react-native-svg`. The geometry is generated from core's icon lists by `pnpm icons:generate`, shared as platform-neutral data rather than imported from core.
- `Button` — appearance, size, tone and icon as core's `button`; no form attributes, disclosure state or activity indicator yet.
- `Avatar` — image, initials or entity icon, as core.

## Scripts

- `pnpm run build`
- `pnpm run test`
- `pnpm run typecheck`

Tests run through `react-native-web` in jsdom and assert behaviour and accessibility semantics. Stories run in `apps/react-native/storybook`.
