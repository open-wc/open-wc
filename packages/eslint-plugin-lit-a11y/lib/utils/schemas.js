/**
 * JSON schema to accept an array of unique strings
 */
const arraySchema = {
  type: 'array',
  items: {
    type: 'string',
  },
  uniqueItems: true,
  additionalItems: false,
};

/**
 * JSON schema to accept an array of unique strings from an enumerated list.
 */
const enumArraySchema = (enumeratedList = [], minItems = 0) => ({
  ...arraySchema,
  items: {
    type: 'string',
    enum: enumeratedList,
  },
  minItems,
});

/**
 * Factory function to generate an object schema
 * with specified properties object
 */
// eslint-disable-next-line default-param-last
const generateObjSchema = (properties = {}, required) => ({
  type: 'object',
  properties,
  required,
});

module.exports = {
  generateObjSchema,
  enumArraySchema,
  arraySchema,
};
