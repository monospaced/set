import { collapseWhitespace } from "../../helpers/string";

function isLatinChar(char: string | undefined): boolean {
  if (!char) return false;

  return /[A-Za-z]/.test(char);
}

function isLowercaseToken(token: string): boolean {
  return /^[a-z]/.test(token);
}

function leadingInitialFromToken(token: string): string | undefined {
  const leadingChar = token.charAt(0);

  return isLatinChar(leadingChar) ? leadingChar : undefined;
}

/**
 * Derives avatar initials from a full name.
 *
 * Rules:
 * - Empty/whitespace-only input returns `undefined`
 * - Leading non-Latin first token returns `undefined`
 * - First initial is always uppercased
 * - Single-word names return exactly one initial
 * - Two/three-word names return initials from each word
 * - Four+ words return first + last initials
 * - Lowercase surname particles (for example `da`, `de`, `van`) override
 *   multi-word fallback and produce first initial + particle initial
 * - Hyphenation in first token yields one first initial only
 * - In two-word names, a second-token two-part hyphen surname contributes a
 *   third initial (for example `Ocasio-Cortez` -> `OC`)
 */
export function getSetInitials(name: string | undefined): string | undefined {
  const normalizedName = collapseWhitespace(name);

  if (!normalizedName) return undefined;

  const words = normalizedName.split(" ");
  const firstTokenInitial = leadingInitialFromToken(words[0]);

  if (!firstTokenInitial) return undefined;

  const initials: string[] = [firstTokenInitial.toUpperCase()];

  if (words.length === 1) {
    return initials[0];
  }

  const lowercaseSurnameToken = words.slice(1).find(isLowercaseToken);

  if (lowercaseSurnameToken) {
    const particleInitial = leadingInitialFromToken(lowercaseSurnameToken);

    return particleInitial ? `${initials[0]}${particleInitial}` : undefined;
  }

  if (words.length === 2) {
    const secondInitial = leadingInitialFromToken(words[1]);

    if (!secondInitial) return undefined;

    initials.push(secondInitial);

    const hyphenParts = words[1].split("-").filter(Boolean);

    if (hyphenParts.length === 2) {
      const secondPartInitial = leadingInitialFromToken(hyphenParts[1]);

      if (secondPartInitial) initials.push(secondPartInitial);
    }

    return initials.slice(0, 3).join("");
  }

  if (words.length === 3) {
    const secondInitial = leadingInitialFromToken(words[1]);

    const thirdInitial = leadingInitialFromToken(words[2]);

    if (!secondInitial || !thirdInitial) return undefined;

    initials.push(secondInitial, thirdInitial);

    return initials.slice(0, 3).join("");
  }

  const lastTokenInitial = leadingInitialFromToken(words.at(-1) || "");

  if (!lastTokenInitial) return undefined;

  initials.push(lastTokenInitial);

  return initials.slice(0, 3).join("");
}
