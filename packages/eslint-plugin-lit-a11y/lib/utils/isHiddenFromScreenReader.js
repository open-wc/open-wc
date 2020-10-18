/**
 * Do the parameters describe an element that's hidden from the screen-reader?
 * @param {string} type element tagName (e.g. element.name)
 * @param {*} attributes element attributes object (e.g. element.attribs)
 */
const isHiddenFromScreenReader = (type, attributes) => {
  if (type.toUpperCase() === 'INPUT') {
    const hidden = attributes.type;

    if (hidden && hidden.toUpperCase() === 'HIDDEN') {
      return true;
    }
  }

  const ariaHidden = attributes['aria-hidden'];
  return ariaHidden === 'true' || ariaHidden === '';
};

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
