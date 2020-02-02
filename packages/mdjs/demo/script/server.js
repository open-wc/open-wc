const { mdjsTransformer } = require('../../index.js');

module.exports = {
  nodeResolve: true,
  open: 'packages/mdjs/demo/script/README.md',
  watch: true,
  responseTransformers: [mdjsTransformer],
};
