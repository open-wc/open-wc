const { isHiddenFromScreenReader } = require('./isHiddenFromScreenReader.js');

function hasAccessibleChildren(element) {
  return element.children.some(
    el => el.type === 'text' || !isHiddenFromScreenReader(el.name, el.attribs),
  );
}

module.exports = {
  hasAccessibleChildren,
};
