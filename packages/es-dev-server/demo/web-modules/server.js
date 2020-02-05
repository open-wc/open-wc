const path = require('path');
console.log('adfasdfadsfasdf')
console.log(__dirname);
module.exports = {
  rootDir: path.resolve(__dirname, '../../../../'),
  appIndex: 'packages/es-dev-server/demo/web-modules/index.html',
  nodeResolve: true,
};
