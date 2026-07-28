/** Validates whether a string is a safe HTML id token. */
export function isValidHtmlId(value: string): boolean {
  return /^[A-Za-z][\w:-]*$/.test(value);
}

/**
 * Normalises an optional consumer-provided id. Returns the trimmed id when
 * present and syntactically valid; returns `undefined` when the input is
 * absent, empty, or whitespace-only. Throws when a non-empty input fails
 * the HTML id syntax check.
 */
export function normalizeOptionalHtmlId(
  id: string | undefined,
): string | undefined {
  if (id === undefined) return undefined;

  const trimmed = id.trim();

  if (!trimmed) return undefined;

  if (!isValidHtmlId(trimmed)) {
    throw new Error(
      "id must start with a letter and contain only letters, numbers, '_', '-', or ':'.",
    );
  }

  return trimmed;
}

/** Trims and collapses internal whitespace; returns `undefined` for empty input. */
export function collapseWhitespace(
  value: string | undefined,
): string | undefined {
  if (value == null) return undefined;

  const normalized = value.trim().replace(/\s+/g, " ");

  return normalized || undefined;
}
