const cpy = require('rollup-plugin-cpy');
const createDefaultConfig = require('../../modern-and-legacy-config');

const config = createDefaultConfig({
  input: './demo/js/index.html',
});

module.exports = [
  {
    ...config[0],
    plugins: [
      ...config[0].plugins,
      cpy({
        files: ['**/*.txt'],
        dest: 'dist',
        options: {
          parents: true,
        },
      }),
    ],
  },
  config[1],
];
