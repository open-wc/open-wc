const createDefaultConfig = require('../../modern-config');

module.exports = createDefaultConfig({
  input: './demo/ts-babel/index.html',
  extensions: ['.js', '.mjs', '.ts'],
});
