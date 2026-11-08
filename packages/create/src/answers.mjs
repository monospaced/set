import { basename, resolve } from "node:path";

const PACKAGE_NAME = /^(@[a-z0-9-~][a-z0-9-._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/;

/** A package name derived from a directory: lowercase, separators as hyphens. */
export function toPackageName(dir) {
  const name = basename(resolve(dir))
    .toLowerCase()
    .replace(/[^a-z0-9._~-]+/g, "-")
    .replace(/^[-._]+|[-._]+$/g, "");

  return name || "set-app";
}

/** A site title derived from a package name: words capitalised, scope dropped. */
export function toTitle(name) {
  return name
    .replace(/^@[^/]+\//, "")
    .split(/[-._]+/)
    .filter(Boolean)
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");
}

export function toDescription(title) {
  return `${title}, built with Set.`;
}

/** Returns a message when `value` is not a valid npm package name. */
export function validatePackageName(value) {
  if (!PACKAGE_NAME.test(value)) {
    return "Use lowercase letters, digits, hyphens, dots or underscores, optionally scoped.";
  }
}
