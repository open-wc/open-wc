module.exports = {
  extends: ['./packages/eslint-config/index.js', require.resolve('eslint-config-prettier')],
  rules: {
    'lit/no-useless-template-literals': 'off',
  },
  overrides: [
    {
      files: ['**/test-node/**/*.js', '**/test-web/**/*.js', '**/*.config.js'],
      rules: {
        'lit/no-invalid-html': 'off',
        'lit/binding-positions': 'off',
        'no-console': 'off',
        'no-unused-expressions': 'off',
        'class-methods-use-this': 'off',
        'max-classes-per-file': 'off',
        'import/no-extraneous-dependencies': 'off', // we moved all devDependencies to root
      },
    },
    {
      files: ['packages/eslint-plugin-lit-a11y/tests/**/*.js'],
      rules: {
        'no-template-curly-in-string': 'off',
      },
    },
  ],
};
