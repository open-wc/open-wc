/**
 * Is the element hidden from the screen-reader?
 * @param {import("parse5-htmlparser2-tree-adapter").Element} element
 * @return {boolean}
 */
function isHiddenFromScreenReader(element) {
  const type = element.name;
  const attributes = element.attribs;
  if (type.toUpperCase() === 'INPUT') {
    const hidden = attributes.type;

    if (hidden && hidden.toUpperCase() === 'HIDDEN') {
      return true;
    }
  }

  const ariaHidden = attributes['aria-hidden'];
  return ariaHidden === 'true' || ariaHidden === '';
}

/**
 * Is the element hidden from the screen-reader?
 * @param {import("parse5-htmlparser2-tree-adapter").Element} element
 * @return {boolean}
 */
function elementIsHiddenFromScreenReader(element) {
  return isHiddenFromScreenReader(element.type, element.attribs);
}

module.exports = {
  isHiddenFromScreenReader,
  elementIsHiddenFromScreenReader,
};
