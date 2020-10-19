/**
 * Gets the attribute value by stripping interpolation markers, except for interpolated variables.
 * @param {string} val
 */
function getAttrVal(val) {
  return val;
}

function getExpressionValue(analyzer, placeholder) {
  let val = analyzer.expressionValues.get(placeholder);

  if(typeof val === 'string') {
    val = val.replace(/"|'/g, '');
  }

  return val;
}

module.exports = {
  getAttrVal,
  getExpressionValue
};
