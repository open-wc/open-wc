function getExpressionValue(analyzer, placeholder) {
  let val = analyzer.expressionValues.get(placeholder);

  if (typeof val === 'string') {
    val = val.replace(/"|'/g, '');
  }

  return val;
}

module.exports = {
  getExpressionValue,
};
