module.exports = {
  extends: [
    'eslint-config-airbnb-base',
  ].map(require.resolve),
  env: {
    browser: true,
  },
  rules: {
    'import/extensions': 'off',
    'no-underscore-dangle': 'off',
    'import/prefer-default-export': 'off',
    "import/no-extraneous-dependencies": ["error", {
      "devDependencies": [
        "**/*.test.js",
        "**/*.spec.js",
        "**/*.stories.js",
        "**/*.stories.options.js"
      ]
    }]
  },
  settings: {
    'import/resolver': {
      'node': {
        'moduleDirectory': ['node_modules', 'bower_components']
      }
    }
  },
  plugins: ['html']
};
