/**
 * @fileoverview Enforce tabIndex value is not greater than zero.
 * @author open-wc
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const { RuleTester } = require('eslint');
const rule = require('../../../lib/rules/tabindex-no-positive');
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
    {
      code: 'html`<div .tabIndex=${0}></div>`',
    },
    {
      code: 'html`<div .tabIndex=${-1}></div>`',
    },
  ].map(prependLitHtmlImport),

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
      code: "html`<div tabindex='${'bar'}' .tabIndex=${'foo'}></div>`",
      errors: [
        { messageId: 'tabindexNoPositive', data: { val: 'bar' } },
        { messageId: 'tabindexNoPositive', data: { val: 'foo' } },
      ],
    },
    {
      code: 'html`<div tabindex="${true}" .tabIndex=${true}></div>`',
      errors: [
        { messageId: 'tabindexNoPositive', data: { val: 'true' } },
        { messageId: 'tabindexNoPositive', data: { val: 'true' } },
      ],
    },
    {
      code: 'html`<div tabindex="${null}" .tabIndex=${null}></div>`',
      errors: [
        { messageId: 'tabindexNoPositive', data: { val: 'null' } },
        { messageId: 'tabindexNoPositive', data: { val: 'null' } },
      ],
    },
    {
      code: 'html`<div tabindex="${1}" .tabIndex=${1}></div>`',
      errors: [{ messageId: 'avoidPositiveTabindex' }, { messageId: 'avoidPositiveTabindex' }],
    },
    {
      code: "html`<div tabindex='${'1'}' .tabIndex=${'1'}></div>`",
      errors: [{ messageId: 'avoidPositiveTabindex' }, { messageId: 'avoidPositiveTabindex' }],
    },
    {
      code: "html`<div tabindex=${'1'}></div>`",
      errors: [{ messageId: 'avoidPositiveTabindex' }],
    },
    {
      code: "html`<div tabindex='1'></div>`",
      errors: [{ messageId: 'avoidPositiveTabindex' }],
    },
  ].map(prependLitHtmlImport),
});
