/**
 * @fileoverview Enforce scope prop is only used on &lt;th&gt; elements.
 * @author open-wc
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

import { RuleTester } from 'eslint';
import rule from '../../../lib/rules/scope.js';

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  settings: { litHtmlSources: false },
  languageOptions: {
    parserOptions: {
      sourceType: 'module',
      ecmaVersion: 2015,
    },
  },
});

ruleTester.run('scope', rule, {
  valid: [
    { code: "html`<th scope='col'></th>`" },
    { code: "html`<th scope='row'></th>`" },
    { code: "html`<th scope='${ true ? 'row' : 'col' }'></th>`" },
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
            '"column" is not a valid value for the scope attribute. The valid values are: col, row, rowgroup, colgroup.',
        },
      ],
    },
    {
      code: "html`<th scope='foo'></th>`",
      errors: [
        {
          message:
            '"foo" is not a valid value for the scope attribute. The valid values are: col, row, rowgroup, colgroup.',
        },
      ],
    },
  ],
});
