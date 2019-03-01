module.exports = {
  extends: ['eslint-config-airbnb-base', 'plugin:wc/best-practices'].map(require.resolve),
  parser: 'babel-eslint',
  env: {
    browser: true,
    mocha: true,
  },
  plugins: ['html'],
  rules: {
    'no-underscore-dangle': 'off',
    'import/extensions': 'off',
    'import/prefer-default-export': 'off',
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: ['**/test/**/*.js', '**/stories/**/*.js', '**/*.config.js'],
      },
    ],
  },
  settings: {
    'import/resolver': {
      node: {
        moduleDirectory: ['node_modules'],
      },
    },
  },
};

