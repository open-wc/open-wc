function ruleOptionsMapperFactory(ruleOptions = []) {
  // eslint-disable-next-line
  return ({ code, errors, options, parserOptions }) => {
    return {
      code,
      errors,
      // Flatten the array of objects in an array of one object.
      options: (options || []).concat(ruleOptions).reduce(
        (acc, item) => [
          {
            ...acc[0],
            ...item,
          },
        ],
        [{}],
      ),
      parserOptions,
    };
  };
}

module.exports = {
  ruleOptionsMapperFactory,
};
