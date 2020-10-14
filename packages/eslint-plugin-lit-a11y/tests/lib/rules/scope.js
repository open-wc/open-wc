/**
 * @fileoverview Enforce scope prop is only used on &lt;th&gt; elements.
 * @author open-wc
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const { RuleTester } = require('eslint');
const rule = require('../../../lib/rules/scope');

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2015,
  },
});

ruleTester.run('scope', rule, {
  valid: [{ code: "html`<th scope='col'></th>`" }],

  invalid: [
    {
      code: "html`<div scope='col'></div>`",
      errors: [
        {
          message: 'The scope attribute may only be used on <th> elements.',
        },
      ],
    },
    {
      code: "html`<td scope='row'></td>`",
      errors: [
        {
          message: 'The scope attribute may only be used on <th> elements.',
        },
      ],
    },
  ],
});
