module.exports = {
  extends: ['eslint-config-airbnb-base', 'plugin:wc/best-practice'],
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
  overrides: [
    {
      files: ['**/test/**/*.js', '**/stories/**/*.js'],
      rules: {
        'no-console': 'off',
        'no-unused-expressions': 'off',
        'class-methods-use-this': 'off',
      },
    },
  ],
};
