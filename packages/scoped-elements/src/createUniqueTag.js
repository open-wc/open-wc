/**
 * Global counter to scope the custom elements
 *
 * @type {number}
 */
let counter = Math.round(Math.random() * 100000);

/**
 * Allowed tag name chars
 *
 * @type {string}
 */
const chars = `-|\\.|[0-9]|[a-z]`;

/**
 * Regular expression to check if a value is a valid tag name
 *
 * @type {RegExp}
 */
const tagRegExp = new RegExp(`[a-z](${chars})*-(${chars})*`);

/**
 * Checks if the tag name is valid
 *
 * @param {string} tag
 * @returns {boolean}
 */
const isValid = tag => tagRegExp.exec(tag) !== null;

/**
 * Checks if the tag is already registered
 *
 * @param {CustomElementRegistry} registry
 * @param {string} name
 * @returns {boolean}
 */
const isTagRegistered = (registry, name) => !!registry.get(name);

/**
 * Given a tag name scopes it with a number suffix
 *
 * @param {CustomElementRegistry} registry
 * @param {string} tagName
 * @returns {string} scoped tag name
 */
const incrementTagName = (registry, tagName) => {
  const newTagName = `${tagName}-${(counter += 1)}`;

  if (isTagRegistered(registry, newTagName)) {
    return incrementTagName(registry, tagName);
  }

  return newTagName;
};

/**
 * Creates a unique scoped tag name
 *
 * @exports
 * @param {CustomElementRegistry} registry
 * @param {string} tagName - tag name to scope
 * @returns {string} scoped tag name
 */
export function createUniqueTag(registry, tagName) {
  if (!isValid(tagName)) {
    throw new Error('tagName is invalid');
  }

  return incrementTagName(registry, tagName);
}
