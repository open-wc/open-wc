const { createCompatibilityConfig } = require('@open-wc/building-rollup');

const configs = createCompatibilityConfig({
  input: './demo/no-scope/index.html',
});

module.exports = configs.map(config => ({
  ...config,
  output: {
    ...config.output,
    dir: '../../_site/scoped-elements/demo/no-scope',
  },
}));
