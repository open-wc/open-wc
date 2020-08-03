/**
 * @fileoverview Enforce that elements with ARIA roles must have all required attributes for that role.
 * @author open-wc
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const { RuleTester } = require('eslint');
const rule = require('../../../lib/rules/role-has-required-aria-attrs');

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2015,
  },
});
ruleTester.run('role-has-required-aria-attrs', rule, {
  valid: [
    {
      code: "html`<span role='alert' aria-atomic='foo' aria-live='foo'></span>`",
    },
    {
      code:
        'html`<span role="checkbox" aria-checked="false" aria-labelledby="foo" tabindex="0"></span>`',
    },
    { code: 'html`<span role="row"></span>`' },
    { code: 'html`<input type="checkbox" role="switch" aria-checked="true" />`' },
    { code: 'html`<div role="combobox" aria-controls="foo"  aria-expanded="foo"></div>`' },
  ],

  invalid: [
    {
      code: "html`<span role='checkbox'></span>`",
      errors: [
        {
          message: "Role 'checkbox' requires the following ARIA attribute(s): 'aria-checked'",
        },
      ],
    },
    {
      code: "html`<div role='combobox'></div>`",
      errors: [
        {
          message:
            "Role 'combobox' requires the following ARIA attribute(s): 'aria-controls, aria-expanded'",
        },
      ],
    },
    {
      code: 'html`<div role="slider" ></div>`',
      errors: [
        {
          message: "Role 'slider' requires the following ARIA attribute(s): 'aria-valuenow'",
        },
      ],
    },
  ],
});
