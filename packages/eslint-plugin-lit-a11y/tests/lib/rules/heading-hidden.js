/**
 * @fileoverview Headings must not be hidden from screenreaders
 * @author open-wc
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const { RuleTester } = require('eslint');
const rule = require('../../../lib/rules/heading-hidden.js');

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

ruleTester.run('heading-hidden', rule, {
  valid: [
    { code: 'html`<h1>hello</h1>`' },
    { code: 'html`<h2>hello</h2>`' },
    { code: 'html`<h3>hello</h3>`' },
    { code: 'html`<h4>hello</h4>`' },
    { code: 'html`<h5>hello</h5>`' },
    { code: 'html`<h6>hello</h6>`' },
  ],
  invalid: [
    {
      code: 'html`<h1 aria-hidden="true"></h1>`',
      errors: [{ messageId: 'hidden' }],
    },
    {
      code: 'html`<h2 aria-hidden="true"></h2>`',
      errors: [{ messageId: 'hidden' }],
    },
    {
      code: 'html`<h3 aria-hidden="true"></h3>`',
      errors: [{ messageId: 'hidden' }],
    },
    {
      code: 'html`<h4 aria-hidden="true"></h4>`',
      errors: [{ messageId: 'hidden' }],
    },
    {
      code: 'html`<h5 aria-hidden="true"></h5>`',
      errors: [{ messageId: 'hidden' }],
    },
    {
      code: 'html`<h6 aria-hidden="true"></h6>`',
      errors: [{ messageId: 'hidden' }],
    },
    {
      code: 'html`<custom-heading aria-hidden="true" level="1"></custom-heading>`',
      errors: [{ messageId: 'hidden' }],
      options: [
        {
          customHeadingElements: ['custom-heading'],
        },
      ],
    },
  ],
});
