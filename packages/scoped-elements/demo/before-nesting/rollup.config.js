const { createCompatibilityConfig } = require('@open-wc/building-rollup');

const configs = createCompatibilityConfig({
  input: './demo/before-nesting/index.html',
});

module.exports = configs.map(config => ({
  ...config,
  output: {
    ...config.output,
    dir: '../../_site/scoped-elements/demo/before-nesting',
  },
}));
