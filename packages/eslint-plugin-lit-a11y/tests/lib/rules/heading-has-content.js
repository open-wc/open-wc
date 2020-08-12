/**
 * @fileoverview Enforce heading (h1, h2, etc) elements contain accessible content.
 * @author open-wc
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const { RuleTester } = require('eslint');
const rule = require('../../../lib/rules/heading-has-content');

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2015,
  },
});
ruleTester.run('heading-has-content', rule, {
  valid: [
    { code: 'html`<h1>hello</h1>`' },
    { code: 'html`<h2>hello</h2>`' },
    { code: 'html`<h3>hello</h3>`' },
    { code: 'html`<h4>hello</h4>`' },
    { code: 'html`<h5>hello</h5>`' },
    { code: 'html`<h6>hello</h6>`' },
    { code: 'html`<h6>${"foo"}</h6>`' }, // eslint-disable-line
    { code: 'html`<h1>${foo}</h1>`' }, // eslint-disable-line
    { code: 'html`<h2>${foo}</h2>`' }, // eslint-disable-line
    { code: 'html`<h3>${foo}</h3>`' }, // eslint-disable-line
    { code: 'html`<h4>${foo}</h4>`' }, // eslint-disable-line
    { code: 'html`<h5>${foo}</h5>`' }, // eslint-disable-line
    { code: 'html`<h6>${foo}</h6>`' }, // eslint-disable-line
    { code: "html`<h1><div aria-hidden='true'>foo</div> foo</h1>`" },
  ],

  invalid: [
    {
      code: "html`<h1><div aria-hidden='true'>foo</div></h1>`",
      errors: [
        {
          message: 'Heading (h1, h2, etc) elements must contain accessible content.',
        },
      ],
    },
    {
      code: 'html`<h1></h1>`',
      errors: [
        {
          message: 'Heading (h1, h2, etc) elements must contain accessible content.',
        },
      ],
    },
  ],
});
