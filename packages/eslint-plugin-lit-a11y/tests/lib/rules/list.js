/**
 * @fileoverview Ensure all ordered and unordered lists (defined by ul or ol elements) contain only li content elements.
 * @author open-wc
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const { RuleTester } = require('eslint');
const rule = require('../../../lib/rules/list.js');

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

ruleTester.run('list', rule, {
  valid: [
    { code: 'html`<ul><li></li></ul>`' },
    { code: 'html`<ul><li><ul><li></li></ul></li></ul>`' },
    { code: 'html`<ul><template></template></ul>`' },
    { code: 'html`<ul><script></script></ul>`' },
    { code: 'html`<ul><li></li><script></script></ul>`' },
    { code: 'html`<ul><li></li><template></template><script></script></ul>`' },
    { code: 'html`<ol><li></li></ul>`' },
    { code: 'html`<ol><template></template></ul>`' },
    { code: 'html`<ol><script></script></ul>`' },
  ],

  invalid: [
    {
      code: 'html`<ul><div></div></ul>`',
      errors: [{ messageId: 'list', data: { list: 'ul' } }],
    },
    {
      code: 'html`<ul><li></li><div></div></ul>`',
      errors: [{ messageId: 'list', data: { list: 'ul' } }],
    },
    {
      code: 'html`<ol><div></div></ol>`',
      errors: [{ messageId: 'list', data: { list: 'ol' } }],
    },
    {
      code: 'html`<ol><li></li><div></div></ol>`',
      errors: [{ messageId: 'list', data: { list: 'ol' } }],
    },
    {
      code: 'html`<ol><script></script><div></div></ol>`',
      errors: [{ messageId: 'list', data: { list: 'ol' } }],
    },
    {
      code: 'html`<ol><template></template><div></div></ol>`',
      errors: [{ messageId: 'list', data: { list: 'ol' } }],
    },
  ],
});
