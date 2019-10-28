module.exports = {
  extends: ['./packages/eslint-config/index.js', require.resolve('eslint-config-prettier')],
  plugins: ['no-only-tests'],
  rules: {
    'max-classes-per-file': 'off',
    'no-only-tests/no-only-tests': 'error',
  },
};
