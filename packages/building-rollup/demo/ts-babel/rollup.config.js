const createDefaultConfig = require('../../modern-and-legacy-config');

module.exports = createDefaultConfig({
  input: './demo/ts-babel/index.html',
  extensions: ['.js', '.ts'],
});
