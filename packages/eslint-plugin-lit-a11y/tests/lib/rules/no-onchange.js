/**
 * @fileoverview Enforce usage of onBlur over onChange for accessibility.
 * @author open-wc
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const { RuleTester } = require('eslint');
const rule = require('../../../lib/rules/no-onchange');

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2015,
  },
});
ruleTester.run('no-onchange', rule, {
  valid: [
    { code: 'html`<select @blur=${foo}></select>`' }, // eslint-disable-line
    { code: 'html`<div></div>`' },
  ],

  invalid: [
    {
      code: 'html`<select @change=${foo}></select>`', // eslint-disable-line
      errors: [
        {
          message:
            '@blur must be used instead of @change, unless absolutely necessary and it causes no negative consequences for keyboard only or screen reader users.',
        },
      ],
    },
    {
      code: 'html`<option @change=${foo}></option>`', // eslint-disable-line
      errors: [
        {
          message:
            '@blur must be used instead of @change, unless absolutely necessary and it causes no negative consequences for keyboard only or screen reader users.',
        },
      ],
    },
  ],
});
