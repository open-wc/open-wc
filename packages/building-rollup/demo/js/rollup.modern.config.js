const cpy = require('rollup-plugin-cpy');
const createDefaultConfig = require('../../modern-config');

const config = createDefaultConfig({
  input: './demo/js/index.html',
});

module.exports = {
  ...config,
  plugins: [
    ...config.plugins,
    cpy({
      files: ['**/*.txt'],
      dest: 'dist',
      options: {
        parents: true,
      },
    }),
  ],
};
