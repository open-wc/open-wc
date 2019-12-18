const path = require('path');

module.exports = {
  rootDir: path.resolve(__dirname, '../../../../'),
  appIndex: 'packages/es-dev-server/demo/dedupe/index.html',
  nodeResolve: true,
  dedupe: true,
};
