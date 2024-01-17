/**
 * The new eslint v9 alpha version which has breaking changes
 * This version has deprecated context.getSourceCode() instead context.sourceCode should be used
 * The getContextSourceCode() checks backward compatiblity and returns context.sourceCode
 * This method can be removed once v9 is released
 */
function getContextSourceCode(context) {
  try {
    if (context.getSourceCode()) {
      return context.getSourceCode();
    }
  } catch (e) {
    return context.sourceCode;
  }
}

module.exports = {
  getContextSourceCode,
};
