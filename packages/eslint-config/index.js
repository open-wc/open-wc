module.exports = {
  extends: [
    require.resolve('eslint-config-airbnb-base'),
    require.resolve('./src/eslint-plugin-wc-export'),
  ],
  parser: 'babel-eslint',
  env: {
    browser: true,
    mocha: true,
  },
  plugins: ['html', 'no-only-tests'],
  rules: {
    'arrow-parens': ['error', 'as-needed', { requireForBlockBody: true }],
    'no-underscore-dangle': 'off',
    // air bnb restricts for of loops, which we want to allow. we can't cherry pick it out, so we have to copy over the existing rules
    'no-restricted-syntax': [
      'error',
      {
        selector: 'ForInStatement',
        message:
          'for..in loops iterate over the entire prototype chain, which is virtually never what you want. Use Object.{keys,values,entries}, and iterate over the resulting array.',
      },
      {
        selector: 'LabeledStatement',
        message:
          'Labels are a form of GOTO; using them makes code confusing and hard to maintain and understand.',
      },
      {
        selector: 'WithStatement',
        message:
          '`with` is disallowed in strict mode because it makes code impossible to predict and optimize.',
      },
    ],
    'no-only-tests/no-only-tests': 'error',
    'import/extensions': ['error', 'always', { ignorePackages: true }],
    'import/prefer-default-export': 'off',
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: ['**/test/**/*.js', '**/stories/**/*.js', '**/*.config.js'],
      },
    ],
    'class-methods-use-this': [
      'error',
      {
        exceptMethods: [
          // web components life cycle
          'connectedCallback',
          'disconnectedCallback',

          // LitElement life cycle
          'performUpdate',
          'shouldUpdate',
          'firstUpdated',
          'update',
          'updated',
          'createRenderRoot',
          'render',
        ],
      },
    ],
  },
  overrides: [
    {
      files: ['**/test/**/*.js', '**/demo/**/*.js', '**/stories/**/*.js'],
      rules: {
        'no-console': 'off',
        'no-unused-expressions': 'off',
        'class-methods-use-this': 'off',
      },
    },
  ],
};
