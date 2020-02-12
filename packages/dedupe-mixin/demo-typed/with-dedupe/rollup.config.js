const { createCompatibilityConfig } = require('@open-wc/building-rollup');

const configs = createCompatibilityConfig({
  input: './demo-typed/with-dedupe/index.html',
});

module.exports = configs.map(config => ({
  ...config,
  output: {
    ...config.output,
    dir: '../../_site/dedupe-mixin/demo/with-dedupe',
  },
}));
