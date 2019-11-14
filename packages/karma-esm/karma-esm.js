const esmMiddlewareFactory = require('./src/esm-middleware.js');
const esmFramework = require('./src/esm-framework.js');

module.exports = {
  'framework:esm': ['factory', esmFramework],
  'middleware:esm': ['factory', esmMiddlewareFactory],
};
