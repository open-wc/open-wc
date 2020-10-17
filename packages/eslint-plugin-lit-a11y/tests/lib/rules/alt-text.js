/**
 * @fileoverview Images require alt text
 * @author open-wc
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const { RuleTester } = require('eslint');
const rule = require('../../../lib/rules/alt-text');

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2015,
  },
});
ruleTester.run('alt-text', rule, {
  valid: [
    { code: "html`<img alt=''/>`" },
    { code: "html`<img alt='foo'/>`" },
    { code: "html`<img alt='${foo}'/>`" },
    { code: "html`<div role='img' alt='foo'></div>`" },
    { code: "html`<div role='img' aria-label='foo'></div>`" },
    { code: "html`<label id=\"foo\">foo</label><div role='img' aria-labelledby='foo'></div>`" },
    { code: "html`<img role='presentation'/>`" },
  ],

  invalid: [
    {
      code: "html`<img src='./myimg.png'/>`",
      errors: [
        {
          message: '<img> elements must have an alt attribute.',
        },
      ],
    },
    {
      code: "html`<div role='img'></div>`",
      errors: [
        {
          message:
            "elements with role 'img' must have an alt, aria-label, or aria-labelledby attribute.",
        },
      ],
    },
  ],
});
