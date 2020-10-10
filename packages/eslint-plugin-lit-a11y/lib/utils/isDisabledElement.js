const { getAttrVal } = require('./getAttrVal');

const isDisabledElement = attributes => {
  if (Object.keys(attributes).includes('disabled')) {
    const disabledAttr = attributes.disabled;
    const disabledAttrValue = getAttrVal(disabledAttr);
    const isHTML5Disabled = disabledAttr && disabledAttrValue !== undefined;
    if (isHTML5Disabled) {
      return true;
    }
  }

  if (Object.keys(attributes).includes('aria-disabled')) {
    const ariaDisabledAttr = attributes['aria-disabled'];
    const ariaDisabledAttrValue = getAttrVal(ariaDisabledAttr);

    if (ariaDisabledAttr && ariaDisabledAttrValue !== undefined && ariaDisabledAttrValue === true) {
      return true;
    }
    return false;
  }

  return false;
};

module.exports = {
  isDisabledElement,
};
