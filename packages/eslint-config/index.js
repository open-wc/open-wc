module.exports = {
  extends: [
    'eslint-config-airbnb-base',
  ].map(require.resolve),
  parser: 'babel-eslint',
  env: {
    browser: true,
    mocha: true,
  },
  globals: {
    expect: true,
  },
  rules: {
    'import/extensions': 'off',
    'no-underscore-dangle': 'off',
    'import/prefer-default-export': 'off',
    'import/no-extraneous-dependencies': ['error', {
      devDependencies: [
        '**/test/*.js',
        '**/stories/*.js',
      ],
    }],
  },
  settings: {
    'import/resolver': {
      node: {
        moduleDirectory: ['node_modules', 'bower_components'],
      },
    },
  },
  plugins: ['html'],
};
