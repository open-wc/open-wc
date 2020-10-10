const getTabIndex = tabIndexAttrValue => {
  // String and number values.
  if (['string', 'number'].indexOf(typeof tabIndexAttrValue) > -1) {
    // Empty string will convert to zero, so check for it explicity.
    if (typeof tabIndexAttrValue === 'string' && tabIndexAttrValue.length === 0) {
      return undefined;
    }
    const value = Number(tabIndexAttrValue);
    if (Number.isNaN(value)) {
      return undefined;
    }

    return Number.isInteger(value) ? value : undefined;
  }

  // Booleans are not valid values, return undefined.
  if (tabIndexAttrValue === true || tabIndexAttrValue === false) {
    return undefined;
  }

  return tabIndexAttrValue;
};

module.exports = {
  getTabIndex,
};
