/**
 * The new eslint v9 alpha version which has breaking changes
 * This version has deprecated context.getSourceCode() instead context.sourceCode should be used
 * The getContextSourceCode() checks backward compatiblity and returns context.sourceCode
 * This method can be removed once v9 is released
 */
function getContextSourceCode(context) {
  return context?.sourceCode ?? context.getSourceCode();
}

/**
 * Shared metadata storage for ESLint/oxlint context objects
 * Uses WeakMap to avoid memory leaks and works with both extensible
 * (ESLint) and non-extensible (oxlint) objects
 */

const contextMetadata = new WeakMap();

/**
 * Get or create metadata for a given context
 * @param {import('eslint').Rule.RuleContext} context
 * @returns {object}
 */
function getContextMetadata(context) {
  if (!contextMetadata.has(context)) {
    contextMetadata.set(context, {});
  }
  return contextMetadata.get(context);
}

export { getContextSourceCode, getContextMetadata };
