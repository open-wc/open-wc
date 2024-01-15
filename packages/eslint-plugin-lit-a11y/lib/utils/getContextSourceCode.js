/**
 * Returns checks backward compatiblity and returns context.sourceCode
 *
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
