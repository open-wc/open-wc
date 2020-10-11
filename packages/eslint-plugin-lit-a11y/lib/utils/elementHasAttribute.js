/**
 * Does the element have the attribute?
 * @param {import("parse5-htmlparser2-tree-adapter").Element} element
 * @param {string} attr
 */
function elementHasAttribute(element, attr) {
  return Object.keys(element.attribs).includes(attr);
}

module.exports = {
  elementHasAttribute,
};
