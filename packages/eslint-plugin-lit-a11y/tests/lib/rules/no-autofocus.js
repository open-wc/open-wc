/**
 * @fileoverview Enforce that autofocus prop is not used on elements.
 * @author open-wc
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const { RuleTester } = require('eslint');
const rule = require('../../../lib/rules/no-autofocus');
const { prependLitHtmlImport } = require('../../../lib/utils/utils.js');

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2015,
  },
});
ruleTester.run('no-autofocus', rule, {
  valid: [
    { code: 'html`<div></div>`' },
    // give me some code that won't trigger a warning
  ].map(prependLitHtmlImport),

  invalid: [
    {
      code: 'html`<div autofocus></div>`',
      errors: [
        {
          message: 'The autofocus attribute is not allowed.',
        },
      ],
    },
    {
      code: "html`<div autofocus='true'></div>`",
      errors: [
        {
          message: 'The autofocus attribute is not allowed.',
        },
      ],
    },
    {
      code: "html`<div autofocus='false'></div>`",
      errors: [
        {
          message: 'The autofocus attribute is not allowed.',
        },
      ],
    },
    {
      code: 'html`<div autofocus=${foo}></div>`',
      errors: [
        {
          message: 'The autofocus attribute is not allowed.',
        },
      ],
    },
  ].map(prependLitHtmlImport),
});
