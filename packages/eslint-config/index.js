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
  plugins: ['html'],
  rules: {
    'arrow-parens': ['error', 'as-needed', { requireForBlockBody: true }],
    'no-underscore-dangle': 'off',
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
