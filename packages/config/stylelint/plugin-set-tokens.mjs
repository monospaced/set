import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import stylelint from "stylelint";

// Validates `var(--*)` references against two gates: (1) the Set
// catalog (--set-* only), or (2) a definition in the same file. Cross-file
// custom-property references — including consumers' own organisation across
// CSS files — are rejected by default. Consumers who organise tokens across
// files can pass `allowCrossFile: true` to disable the same-file gate for
// non-set customs while keeping catalog enforcement for `--set-*`.

const ruleName = "set/set-known-tokens";

const messages = stylelint.utils.ruleMessages(ruleName, {
  unknownSet: (token) =>
    `Unknown Set token "${token}". Reference a published token (see @monospaced/set-config/set.catalog.css) or define it in this file.`,
  unknownCustom: (token) =>
    `Unknown custom property "${token}". Define it in this file — cross-file custom properties are not supported.`,
});

const catalogPath = fileURLToPath(
  new URL("../set.catalog.css", import.meta.url),
);

let canonicalCache = null;
const canonicalTokens = () => {
  if (canonicalCache) return canonicalCache;
  const css = readFileSync(catalogPath, "utf8");
  const set = new Set();
  for (const match of css.matchAll(/(--set-[\w-]+)\s*:/g)) {
    set.add(match[1]);
  }
  canonicalCache = set;
  return set;
};

const refPattern = /var\(\s*(--[\w-]+)/g;

const parseAllow = (entries) => {
  const literals = new Set();
  const patterns = [];
  for (const entry of entries) {
    if (typeof entry !== "string") continue;
    const re = entry.match(/^\/(.+)\/([gimsuy]*)$/);
    if (re) patterns.push(new RegExp(re[1], re[2]));
    else literals.add(entry);
  }
  return { literals, patterns };
};

const rule = (primary, secondary) => (root, result) => {
  const valid = stylelint.utils.validateOptions(
    result,
    ruleName,
    {
      actual: primary,
      possible: [true],
    },
    {
      actual: secondary,
      possible: {
        allow: [(v) => typeof v === "string"],
        allowCrossFile: [(v) => typeof v === "boolean"],
      },
      optional: true,
    },
  );
  if (!valid) return;

  const { literals: allowLiterals, patterns: allowPatterns } = parseAllow(
    secondary?.allow ?? [],
  );
  const allowCrossFile = secondary?.allowCrossFile === true;

  const localDefs = new Set();
  root.walkDecls(/^--/, (decl) => localDefs.add(decl.prop));

  const known = canonicalTokens();

  root.walkDecls((decl) => {
    for (const match of decl.value.matchAll(refPattern)) {
      const token = match[1];
      if (known.has(token) || localDefs.has(token)) continue;
      if (allowLiterals.has(token)) continue;
      if (allowPatterns.some((re) => re.test(token))) continue;
      const isSet = token.startsWith("--set-");
      if (!isSet && allowCrossFile) continue;
      stylelint.utils.report({
        message: isSet
          ? messages.unknownSet(token)
          : messages.unknownCustom(token),
        node: decl,
        result,
        ruleName,
        word: token,
      });
    }
  });
};

rule.ruleName = ruleName;
rule.messages = messages;

export default stylelint.createPlugin(ruleName, rule);
