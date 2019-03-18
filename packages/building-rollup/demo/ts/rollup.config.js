const typescript = require('rollup-plugin-typescript2');
const createDefaultConfig = require('../../modern-and-legacy-config');

const configs = createDefaultConfig({
  input: './demo/ts/index.html',
});

module.exports = configs.map(config => ({
  ...config,
  plugins: [
    ...config.plugins,
    typescript({
      tsconfig: './demo/ts/tsconfig.json',
    }),
  ],
}));
