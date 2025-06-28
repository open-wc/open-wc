import baseConfig from './packages/eslint-config/index.js';
import prettier from 'eslint-config-prettier';

export default [
  {
    ignores: [
      'node_modules',
      'coverage/',
      'dist',
      'tsc-dist',
      'stats.html',
      'packages/**/test-node/**/snapshots',
      'packages/demoing-storybook/storybook-static/**/*',
      'packages/**/demo/**/*',
      'packages/**/demo-typed/**/*',
      'packages/dev-server-hmr/src/patches/**/*',
      'packages/testing/plugins/**/*',
      'packages/lit-helpers/src/spread.js',
      '_site/',
      '_site-dev',
      'docs/_merged_assets/',
      'docs/_merged_data/',
      'docs/_merged_includes/',
    ],
  },

  // Base configuration
  ...baseConfig,
  prettier,

  // Main rules
  {
    rules: {
      'lit/no-useless-template-literals': 'off',
      'consistent-return': 'off',
      'max-classes-per-file': 'off',
    },
  },

  // Override for test files and config files
  {
    files: ['**/test-node/**/*.js', '**/test-web/**/*.js', './scripts/**/*', '**/*.config.js'],
    rules: {
      'lit/no-invalid-html': 'off',
      'lit/binding-positions': 'off',
      'no-console': 'off',
      'no-unused-expressions': 'off',
      'class-methods-use-this': 'off',
      'max-classes-per-file': 'off',
      'import-x/no-extraneous-dependencies': 'off', // we moved all devDependencies to root
    },
  },

  // Override for lit-a11y plugin tests
  {
    files: ['packages/eslint-plugin-lit-a11y/tests/**/*.js'],
    rules: {
      'no-template-curly-in-string': 'off',
    },
  },
];
