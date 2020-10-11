const { aria, roles } = require('aria-query');

/**
 * @param {string} string
 * @return {string is import("aria-query").ARIARoleDefintionKey}
 */
function isAriaRole(string) {
  // @ts-expect-error: we need to disambiguate from the string type here.
  return roles.get(string) !== undefined;
}

/**
 * @param {string} string
 * @return {string is import('aria-query').ARIAProperty}
 */
function isAriaPropertyName(string) {
  // @ts-expect-error: we need to disambiguate the string type here.
  return aria.get(string) !== undefined;
}

module.exports = {
  isAriaRole,
  isAriaPropertyName,
};
