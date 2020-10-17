const defaultParserOptions = {
  sourceType: 'module',
  ecmaVersion: 2015,
};

function parserOptionsMapper({ code, errors, options = [], parserOptions = {} }) {
  return {
    code,
    errors,
    options,
    parserOptions: {
      ...defaultParserOptions,
      ...parserOptions,
    },
  };
}

module.exports = {
  parserOptionsMapper,
};
