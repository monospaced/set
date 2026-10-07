/**
 * Initials derivation, after core's `avatar/get-initials.ts`. Kept as a
 * copy rather than an import so this package has no dependency on core;
 * the rules are the system's, the code is per platform.
 */

const collapseWhitespace = (value: string | undefined): string =>
  (value ?? "").trim().replace(/\s+/g, " ");

const isLatin = (char: string | undefined): boolean =>
  Boolean(char) && /[A-Za-z]/.test(char as string);

const leadingInitial = (token: string): string | undefined =>
  isLatin(token.charAt(0)) ? token.charAt(0) : undefined;

/**
 * Derives avatar initials from a full name.
 *
 * - Empty input, or a leading non-Latin token, yields `undefined`.
 * - Single word: one initial. Two or three words: one per word.
 *   Four or more: first and last.
 * - A lowercase surname particle (`da`, `de`, `van`) wins: first initial
 *   plus the particle's.
 * - A hyphenated second word in a two-word name contributes both parts.
 */
export function getInitials(name: string | undefined): string | undefined {
  const normalized = collapseWhitespace(name);

  if (!normalized) return undefined;

  const words = normalized.split(" ");
  const first = leadingInitial(words[0] ?? "");

  if (!first) return undefined;

  const initials = [first.toUpperCase()];

  if (words.length === 1) return initials[0];

  const particle = words.slice(1).find((w) => /^[a-z]/.test(w));

  if (particle) {
    const particleInitial = leadingInitial(particle);

    return particleInitial ? `${initials[0]}${particleInitial}` : undefined;
  }

  if (words.length === 2) {
    const second = leadingInitial(words[1] ?? "");

    if (!second) return undefined;
    initials.push(second);

    const hyphenParts = (words[1] ?? "").split("-").filter(Boolean);

    if (hyphenParts.length === 2) {
      const part = leadingInitial(hyphenParts[1] ?? "");

      if (part) initials.push(part);
    }

    return initials.slice(0, 3).join("");
  }

  if (words.length === 3) {
    const second = leadingInitial(words[1] ?? "");
    const third = leadingInitial(words[2] ?? "");

    if (!second || !third) return undefined;
    initials.push(second, third);

    return initials.slice(0, 3).join("");
  }

  const last = leadingInitial(words.at(-1) ?? "");

  if (!last) return undefined;
  initials.push(last);

  return initials.slice(0, 3).join("");
}
