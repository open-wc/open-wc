/**
 * @fileoverview Enforce tabIndex value is not greater than zero.
 * @author open-wc
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const { RuleTester } = require('eslint');
const rule = require('../../../lib/rules/tabindex-no-positive');

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2015,
  },
});
ruleTester.run('tabindex-no-positive', rule, {
  valid: [
    {
      code: "html`<div tabindex='0'></div>`",
    },
    {
      code: "html`<div tabindex='${'0'}'></div>`",
    },
    {
      code: "html`<div tabindex='${0}'></div>`",
    },
    {
      code: "html`<div tabindex='-1'></div>`",
    },
    {
      code: 'html`<div tabindex=${foo}></div>`',
    },
  ],

  invalid: [
    {
      code: "html`<div tabindex='foo'></div>`",
      errors: [{ messageId: 'tabindexNoPositive', data: { val: 'foo' } }],
    },
    {
      code: "html`<div tabindex=${'bar'}></div>`",
      errors: [{ messageId: 'tabindexNoPositive', data: { val: 'bar' } }],
    },
    {
      code: 'html`<div tabindex=${true}></div>`',
      errors: [{ messageId: 'tabindexNoPositive', data: { val: 'true' } }],
    },
    {
      code: 'html`<div tabindex=${undefined}></div>`',
      errors: [{ messageId: 'tabindexNoPositive', data: { val: 'undefined' } }],
    },
    {
      code: 'html`<div tabindex=${null}></div>`',
      errors: [{ messageId: 'tabindexNoPositive', data: { val: 'null' } }],
    },
    {
      code: 'html`<div tabindex=${1}></div>`',
      errors: [{ messageId: 'avoidPositiveTabindex' }],
    },
    {
      code: "html`<div tabindex=${'1'}></div>`",
      errors: [{ messageId: 'avoidPositiveTabindex' }],
    },
    {
      code: "html`<div tabindex='1'></div>`",
      errors: [{ messageId: 'avoidPositiveTabindex' }],
    },
    {
      code: "html`<div tabindex='2'></div>`",
      errors: [{ messageId: 'avoidPositiveTabindex' }],
    },
  ],
});
