/**
 * @fileoverview Elements cannot use an invalid ARIA attribute.
 * @author passle
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const { RuleTester } = require('eslint');
const rule = require('../../../lib/rules/aria-props');

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2015,
  },
});
ruleTester.run('aria-props', rule, {
  valid: [
    {
      code: "html`<div aria-labelledby='foo'></div>`",
    },
    // give me some code that won't trigger a warning
  ],

  invalid: [
    {
      code: "html`<div aria-foo=''></div>`",
      errors: [
        {
          message: 'Elements cannot use an invalid ARIA attribute.',
        },
      ],
    },
  ],
});
