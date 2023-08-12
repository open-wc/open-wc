/**
 * @fileoverview Ensures that every object element has a text alternative
 * @author open-wc
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const { RuleTester } = require('eslint');
const rule = require('../../../lib/rules/obj-alt.js');

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

ruleTester.run('obj-alt', rule, {
  valid: [
    { code: 'html`<object data="path/to/content" title="This object has text"></object>`' },
    { code: 'html`<object data="path/to/content" aria-label="this object has text"></object>`' },
    { code: 'html`<object data="path/to/content" aria-labelledby="foo"></object>`' },
    { code: 'html`<object data="path/to/content" role="presentation"></object>`' },
    { code: 'html`<object data="path/to/content" role="none"></object>`' },
  ],

  invalid: [
    { code: 'html`<object data="path/to/content"></object>`', errors: [{ messageId: 'alt' }] },
    {
      code: 'html`<object data="path/to/content"><div> </div></object>`',
      errors: [{ messageId: 'alt' }],
    },
    {
      code: 'html`<object data="path/to/content">This object has no alternative text.</object>`',
      errors: [{ messageId: 'alt' }],
    },
  ],
});
