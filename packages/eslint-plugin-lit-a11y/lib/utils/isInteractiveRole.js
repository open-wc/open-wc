const { dom, roles: rolesMap } = require('aria-query');
const { getAttrVal } = require('./getAttrVal');

const domKeys = [...dom.keys()];
const roles = [...rolesMap.keys()];
const interactiveRoles = roles
  .filter(name => !rolesMap.get(name).abstract)
  .filter(name => rolesMap.get(name).superClass.some(klasses => klasses.includes('widget')));

// 'toolbar' does not descend from widget, but it does support
// aria-activedescendant, thus in practice we treat it as a widget.
interactiveRoles.push('toolbar');
/**
 * Returns boolean indicating whether the given element has a role
 * that is associated with an interactive component. Used when an element
 * has a dynamic handler on it and we need to discern whether or not
 * its intention is to be interacted with in the DOM.
 */
const isInteractiveRole = attributes => {
  const value = getAttrVal(attributes.role);

  // If value is undefined, then the role attribute will be dropped in the DOM.
  // If value is null, then getLiteralAttributeValue is telling us that the
  // value isn't in the form of a literal
  if (value === undefined || value === null) {
    return false;
  }

  let isInteractive = false;
  const normalizedValues = String(value).toLowerCase().split(' ');
  const validRoles = normalizedValues.reduce((accumulator, name) => {
    if (roles.includes(name)) {
      accumulator.push(name);
    }
    return accumulator;
  }, []);
  if (validRoles.length > 0) {
    // The first role value is a series takes precedence.
    isInteractive = interactiveRoles.includes(validRoles[0]);
  }

  return isInteractive;
};

const nonInteractiveRoles = roles
  .filter(name => !rolesMap.get(name).abstract)
  .filter(name => !rolesMap.get(name).superClass.some(klasses => klasses.includes('widget')));

/**
 * Returns boolean indicating whether the given element has a role
 * that is associated with a non-interactive component. Non-interactive roles
 * include `listitem`, `article`, or `dialog`. These are roles that indicate
 * for the most part containers.
 *
 * Elements with these roles should not respond or handle user interactions.
 * For example, an `onClick` handler should not be assigned to an element with
 * the role `listitem`. An element inside the `listitem`, like a button or a
 * link, should handle the click.
 *
 * This utility returns true for elements that are assigned a non-interactive
 * role. It will return false for elements that do not have a role. So whereas
 * a `div` might be considered non-interactive, for the purpose of this utility,
 * it is considered neither interactive nor non-interactive -- a determination
 * cannot be made in this case and false is returned.
 */

const isNonInteractiveRole = (tagName, attributes) => {
  // Do not test higher level JSX components, as we do not know what
  // low-level DOM element this maps to.
  if (!domKeys.includes(tagName)) {
    return false;
  }

  const value = getAttrVal(attributes.role);

  let isNonInteractive = false;
  const normalizedValues = String(value).toLowerCase().split(' ');
  const validRoles = normalizedValues.reduce((accumulator, name) => {
    if (roles.includes(name)) {
      accumulator.push(name);
    }
    return accumulator;
  }, []);
  if (validRoles.length > 0) {
    // The first role value is a series takes precedence.
    isNonInteractive = nonInteractiveRoles.includes(validRoles[0]);
  }

  return isNonInteractive;
};

module.exports = {
  isInteractiveRole,
  isNonInteractiveRole,
};
