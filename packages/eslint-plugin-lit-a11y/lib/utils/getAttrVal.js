/**
 * Gets the attribute value by stripping interpolation markers, except for interpolated variables.
 * @param {string} val
 */
function getAttrVal(val = '') {
  // is expression
  if (val.startsWith('{{')) {
    // is expression with a variable
    if (val.startsWith('{{{')) {
      // handles ${undefined}
      if (val.includes('undefined')) {
        return undefined;
      }
      // handles ${null}
      if (val.includes('null')) {
        return null;
      }

      // is variable of some kind - we can ignore
      return '{{}}';
    }

    // is a raw value, return without brackets
    return val.replace('{{', '').replace('}}', '');
  }
  // is regular attr, return val
  return val;
}

module.exports = {
  getAttrVal,
};
