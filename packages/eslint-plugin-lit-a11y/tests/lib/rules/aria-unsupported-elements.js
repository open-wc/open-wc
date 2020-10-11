/**
 * @fileoverview Certain reserved DOM elements do not support ARIA roles, states, or properties.
 * @author open-wc
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const { RuleTester } = require('eslint');
const rule = require('../../../lib/rules/aria-unsupported-elements');

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2015,
  },
});
ruleTester.run('aria-unsupported-elements', rule, {
  valid: [
    { code: "html`<script src='./foo.js'></script>`" },
    { code: "html`<meta charset='UTF-8'/>`" },
    { code: 'html`<style></style>`' },
    // give me some code that won't trigger a warning
  ],

  invalid: [
    {
      code: 'html`<meta charset="UTF-8" aria-hidden="false" />`',
      errors: [
        {
          message:
            'Certain reserved DOM elements do not support ARIA roles, states, or properties.',
        },
      ],
    },
    {
      code: "html`<script role='foo'></script>`",
      errors: [
        {
          message:
            'Certain reserved DOM elements do not support ARIA roles, states, or properties.',
        },
      ],
    },
    {
      code: "html`<style aria-hidden='foo'></style>`",
      errors: [
        {
          message:
            'Certain reserved DOM elements do not support ARIA roles, states, or properties.',
        },
      ],
    },
    {
      code: "html`<style role='foo' aria-hidden='foo'></style>`",
      errors: [
        {
          message:
            'Certain reserved DOM elements do not support ARIA roles, states, or properties.',
        },
        {
          message:
            'Certain reserved DOM elements do not support ARIA roles, states, or properties.',
        },
      ],
    },
  ],
});
