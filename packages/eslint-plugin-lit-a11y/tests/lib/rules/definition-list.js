/**
 * @fileoverview Ensure all definition lists (defined by dl elements) contain only properly-ordered dt and dd groups, div, script, or template elements.
 * @author open-wc
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const { RuleTester } = require('eslint');
const rule = require('../../../lib/rules/definition-list.js');

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

ruleTester.run('definition-list', rule, {
  valid: [
    { code: 'html`<dl><dt></dt><dd></dd></dl>`' },
    { code: 'html`<dl><div></div></dl>`' },
    { code: 'html`<dl><script></script></dl>`' },
    { code: 'html`<dl><template></template></dl>`' },
    { code: 'html`<dl><dt></dt><dd></dd><div></div></dl>`' },
    { code: 'html`<dl><dt></dt><dd></dd><template></template><script></script></dl>`' },
    {
      code: `html\`
      <dl>
        <dt></dt>
        <dd></dd>
      </dl>\`
      `,
    },
  ],

  invalid: [
    {
      code: 'html`<dl><li></li></dl>`',
      errors: [{ messageId: 'list', data: { list: 'dl' } }],
    },
    {
      code: 'html`<dl><dt></dt><li></li></dl>`',
      errors: [{ messageId: 'list', data: { list: 'dl' } }],
    },
    {
      code: 'html`<dl><dt></dt><dd></dd><li></li></dl>`',
      errors: [{ messageId: 'list', data: { list: 'dl' } }],
    },
    {
      code: 'html`<dl><script></script><li></li></dl>`',
      errors: [{ messageId: 'list', data: { list: 'dl' } }],
    },
    {
      code: 'html`<dl><template></template><li></li></dl>`',
      errors: [{ messageId: 'list', data: { list: 'dl' } }],
    },
    {
      code: 'html`<dl><dt></dt><p></p></dl>`',
      errors: [{ messageId: 'list', data: { list: 'dl' } }],
    },
  ],
});
