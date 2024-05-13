/**
 * The new eslint v9 alpha version which has breaking changes
 * This version has deprecated context.getSourceCode() instead context.sourceCode should be used
 * The getContextSourceCode() checks backward compatiblity and returns context.sourceCode
 * This method can be removed once v9 is released
 */
function getContextSourceCode(context) {
  return context?.sourceCode ?? context.getSourceCode();
}

function getParserServices(context) {
  return context?.sourceCode?.parserServices ?? context.parserServices;
}

module.exports = {
  getContextSourceCode,
  getParserServices,
};
