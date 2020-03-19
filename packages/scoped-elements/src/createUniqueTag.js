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
 * @param {string} name
 * @param {CustomElementRegistry} registry
 * @returns {boolean}
 */
const isTagRegistered = (name, registry) => !!registry.get(name);

/**
 * Given a tag name scopes it with a number suffix
 *
 * @param {string} tagName
 * @param {CustomElementRegistry} registry
 * @returns {string} scoped tag name
 */
const incrementTagName = (tagName, registry) => {
  const newTagName = `${tagName}-${(counter += 1)}`;

  if (isTagRegistered(newTagName, registry)) {
    return incrementTagName(tagName, registry);
  }

  return newTagName;
};

/**
 * Creates a unique scoped tag name
 *
 * @exports
 * @param {string} tagName - tag name to scope
 * @param {CustomElementRegistry} registry
 * @returns {string} scoped tag name
 */
export function createUniqueTag(tagName, registry = customElements) {
  if (!isValid(tagName)) {
    throw new Error('tagName is invalid');
  }

  return incrementTagName(tagName, registry);
}
