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
  settings: { litHtmlSources: false },
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
      code: "html`<div tabindex='2'></div>`",
      errors: [{ messageId: 'avoidPositiveTabindex' }],
    },
    {
      code: "html`<div tabindex='${'bar'}'></div>`",
      errors: [{ message: 'Invalid tabindex value bar.' }],
    },
    {
      code: 'html`<div tabindex="${true}"></div>`',
      errors: [{ message: 'Invalid tabindex value true.' }],
    },
    {
      code: 'html`<div tabindex="${null}"></div>`',
      errors: [{ message: 'Invalid tabindex value null.' }],
    },
    {
      code: 'html`<div tabindex="${1}"></div>`',
      errors: [{ message: 'Avoid positive tabindex.' }],
    },
    {
      code: "html`<div tabindex='${'1'}'></div>`",
      errors: [{ message: 'Avoid positive tabindex.' }],
    },
    {
      code: "html`<div tabindex=${'1'}></div>`",
      errors: [{ message: 'Avoid positive tabindex.' }],
    },
    {
      code: "html`<div tabindex='1'></div>`",
      errors: [{ message: 'Avoid positive tabindex.' }],
    },
  ],
});
