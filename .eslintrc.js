module.exports = {
  extends: ['./packages/eslint-config/index.js', require.resolve('eslint-config-prettier')],
  rules: {
    'max-classes-per-file': 'off',
  },
};
