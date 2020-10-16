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
  valid: [
    { code: "html`<th scope='col'></th>`" },
    { code: "html`<th scope='row'></th>`" },
    { code: "html`<th scope='rowgroup'></th>`" },
    { code: "html`<th scope='colgroup'></th>`" },
    { code: "html`<foo-bar scope='col'></foo-bar>`" },
    { code: "html`<foo-bar scope='foo'></foo-bar>`" },
  ],

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
    {
      code: "html`<th scope='column'></th>`",
      errors: [
        {
          message:
            'The scope attribute "column" informed is not valid. The valid values are: col, row, rowgroup, colgroup.',
        },
      ],
    },
    {
      code: "html`<th scope='foo'></th>`",
      errors: [
        {
          message:
            'The scope attribute "foo" informed is not valid. The valid values are: col, row, rowgroup, colgroup.',
        },
      ],
    },
  ],
});
