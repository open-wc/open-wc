import { defineConfig } from 'eslint/config';

import wcExportPlugin from 'eslint-plugin-wc';
import litA11yPlugin from 'eslint-plugin-lit-a11y';
import litPlugin from 'eslint-plugin-lit';
import htmlPlugin from 'eslint-plugin-html';
import noOnlyTestsPlugin from 'eslint-plugin-no-only-tests';
import importPlugin from 'eslint-plugin-import-x';
import globals from 'globals';

export default defineConfig([
  {
    languageOptions: {
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        requireConfigFile: false,
      },
      globals: {
        ...globals.browser,
        ...globals.mocha,
      },
    },

    plugins: {
      lit: litPlugin,
      html: htmlPlugin,
      'no-only-tests': noOnlyTestsPlugin,
      'import-x': importPlugin,
      'lit-a11y': litA11yPlugin,
      'wc-export': wcExportPlugin,
    },

    rules: {
      'arrow-parens': ['error', 'as-needed', { requireForBlockBody: true }],
      'no-underscore-dangle': 'off',

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
      'import-x/no-unresolved': 'error',
      'import-x/extensions': ['error', 'always', { ignorePackages: true }],
      'import-x/no-extraneous-dependencies': [
        'error',
        {
          devDependencies: [
            '**/test/**/*.{html,js,mjs,ts}',
            '**/stories/**/*.{html,js,mjs,ts}',
            '**/demo/**/*.{html,js,mjs,ts}',
            '**/*.config.{html,js,mjs,ts}',
            '**/*.conf.{html,js,mjs,ts}',
            '**/.storybook/*.{html,js,mjs,cjs,ts}',
          ],
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

      'lit/no-template-bind': 'error',
      'lit/no-duplicate-template-bindings': 'error',
      'lit/no-useless-template-literals': 'error',
      'lit/attribute-value-entities': 'error',
      'lit/binding-positions': 'error',
      'lit/no-invalid-html': 'error',
      'lit/no-value-attribute': 'error',
      'lit/no-invalid-escape-sequences': 'error',
      'lit/no-legacy-template-syntax': 'error',
      'lit/no-private-properties': 'error',
      'lit/no-native-attributes': 'error',
      'lit/no-classfield-shadowing': 'error',
      'lit/lifecycle-super': 'error',

      ...litA11yPlugin.configs.recommended.rules,
    },
  },

  {
    files: [
      '**/test/**/*.{html,js,mjs,ts}',
      '**/demo/**/*.{html,js,mjs,ts}',
      '**/stories/**/*.{html,js,mjs,ts}',
    ],
    rules: {
      'no-console': 'off',
      'no-unused-expressions': 'off',
      'class-methods-use-this': 'off',

      // loosen templating restrictions in tests and demos
      'lit/no-template-bind': 'off',
      'lit/no-duplicate-template-bindings': 'off',
      'lit/no-useless-template-literals': 'off',
      'lit/binding-positions': 'off',
      'lit/no-invalid-html': 'off',
      'lit/no-private-properties': 'off',
    },
  },
]);
