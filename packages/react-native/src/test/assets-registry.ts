/**
 * Stand-in for `@react-native/assets-registry/registry` when React Native
 * libraries run on the web (tests, Storybook). The real module is Flow-typed
 * and only resolves bundled image assets by numeric id, which Set never
 * passes; react-native-svg's web backend imports it unconditionally.
 */
export function getAssetByID(): undefined {
  return undefined;
}
