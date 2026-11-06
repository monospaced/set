/**
 * Set's Baseline availability target. One constant drives every preset that
 * encodes browser support: the browserslist query, the esbuild target, and
 * the ESLint and Stylelint Baseline rules, so they can never drift apart.
 *
 * "widely" means Baseline Widely available: supported in all core browsers
 * for at least 30 months. Switch to "newly" to adopt features sooner.
 *
 * @type {"widely" | "newly"}
 */
const baseline = "widely";

export default baseline;
