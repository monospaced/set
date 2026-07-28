/**
 * Checks whether a value is a non-array object.
 *
 * @param {unknown} value
 * @returns {boolean}
 */
export function isObject(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * Parses a JSON Pointer string into path segments.
 *
 * Accepts `#` as the document root and `#/...` for nested segments.
 *
 * @param {string} pointer
 * @returns {string[]}
 */
export function parseJsonPointer(pointer) {
  if (!pointer || pointer === "#") return [];
  if (!pointer.startsWith("#/")) {
    throw new Error(`Unsupported JSON pointer: ${pointer}`);
  }

  return pointer
    .slice(2)
    .split("/")
    .map((segment) => segment.replace(/~1/g, "/").replace(/~0/g, "~"));
}

/**
 * Checks whether a value is a token object (object with `$value` field).
 *
 * @param {unknown} value
 * @returns {boolean}
 */
export function isTokenObject(value) {
  return (
    isObject(value) && Object.prototype.hasOwnProperty.call(value, "$value")
  );
}

/**
 * Performs structural equality via JSON serialization for token values.
 *
 * @param {unknown} a
 * @param {unknown} b
 * @returns {boolean}
 */
export function deepEqual(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}
