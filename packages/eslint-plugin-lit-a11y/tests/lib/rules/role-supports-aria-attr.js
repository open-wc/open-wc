/**
 * @fileoverview Enforce that elements with a defined role contain only supported ARIA attributes for that role.
 * @author open-wc
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const { RuleTester } = require('eslint');
const rule = require('../../../lib/rules/role-supports-aria-attr');

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2015,
  },
});
ruleTester.run('role-supports-aria-attr', rule, {
  valid: [
    { code: "html`<div role='checkbox' aria-checked='true'></div>`" },
    { code: "html`<div role='presentation'></div>`" },
  ],

  invalid: [
    {
      code: "html`<li aria-required role='radio' aria-checked='false'>Rainbow Trout</li>`",
      errors: [
        {
          message: "Role 'radio' does not support usage of the 'aria-required' ARIA attribute.'",
        },
      ],
    },
    {
      code: "html`<div role='combobox' aria-checked='true'></div>`",
      errors: [
        {
          message: "Role 'combobox' does not support usage of the 'aria-checked' ARIA attribute.'",
        },
      ],
    },
  ],
});
