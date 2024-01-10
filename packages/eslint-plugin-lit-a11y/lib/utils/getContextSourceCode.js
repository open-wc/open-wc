/**
 * Returns checks backward compatiblity and returns context.sourceCode
 *
 */
function getContextSourceCode(context) {
  if (typeof context.getSourceCode() === 'function') {
    return context.getSourceCode();
  }
  return context.sourceCode;
}

module.exports = {
    getContextSourceCode,
};
