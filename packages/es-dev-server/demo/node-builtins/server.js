const path = require('path');

module.exports = {
  rootDir: path.resolve(__dirname, '../../../../'),
  appIndex: 'packages/es-dev-server/demo/node-builtins/index.html',
  nodeResolve: {
    customResolveOptions: {

    }
  },
};
