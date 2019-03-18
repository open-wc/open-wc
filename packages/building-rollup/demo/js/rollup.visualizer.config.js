const visualizer = require('rollup-plugin-visualizer');
const createDefaultConfig = require('../../modern-and-legacy-config');

const configs = createDefaultConfig({
  input: './demo/js/index.html',
});
const config = configs[0];

module.exports = {
  ...config,
  plugins: [
    ...config.plugins,
    visualizer({
      sourcemap: true,
    }),
  ],
};
