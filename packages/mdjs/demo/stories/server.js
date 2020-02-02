const { mdjsTransformer } = require('../../index.js');

module.exports = {
  nodeResolve: true,
  open: 'packages/mdjs/demo/stories/README.md',
  watch: true,
  responseTransformers: [mdjsTransformer],
};
