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
    { code: 'html`<h6>${"foo"}</h6>`' },
    { code: 'html`<h1>${foo}</h1>`' },
    { code: 'html`<h2>${foo}</h2>`' },
    { code: 'html`<h3>${foo}</h3>`' },
    { code: 'html`<h4>${foo}</h4>`' },
    { code: 'html`<h5>${foo}</h5>`' },
    { code: 'html`<h6>${foo}</h6>`' },
    { code: "html`<h1><div aria-hidden='true'>foo</div> foo</h1>`" },
    { code: 'html`<h1>${foo()}</h1>`' },
    { code: 'html`<h1>${foo("hello")}</h1>`' },
    { code: 'html`<h1>${foo(1)}</h1>`' },
    { code: 'html`<h1>${foo(true)}</h1>`' },
    { code: 'html`<h1>${foo(bar)}</h1>`' },
    { code: 'html`<h1>${foo(bar, "hello", 1, true)}</h1>`' },
    { code: 'html`<div aria-label="${this.foo("foo")}"></div>`' },
  ],

  invalid: [
    {
      code: "html`<h1><div aria-hidden='true'>foo</div></h1>`",
      errors: [{ message: '<h1> elements must have accessible content.' }],
    },
    {
      code: 'html`<h1></h1>`',
      errors: [{ message: '<h1> elements must have accessible content.' }],
    },
    {
      code: 'html`<h2></h2>`',
      errors: [{ message: '<h2> elements must have accessible content.' }],
    },
    {
      code: 'html`<h3></h3>`',
      errors: [{ message: '<h3> elements must have accessible content.' }],
    },
    {
      code: 'html`<h4></h4>`',
      errors: [{ message: '<h4> elements must have accessible content.' }],
    },
    {
      code: 'html`<h5></h5>`',
      errors: [{ message: '<h5> elements must have accessible content.' }],
    },
    {
      code: 'html`<h6></h6>`',
      errors: [{ message: '<h6> elements must have accessible content.' }],
    },
  ],
});
