/**
 * @fileoverview Enforce anchor elements to contain accessible content.
 * @author open-wc
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const { RuleTester } = require('eslint');
const rule = require('../../../lib/rules/anchor-has-content');

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2015,
  },
});
ruleTester.run('anchor-has-content', rule, {
  valid: [
    { code: "html`<a href='#'>foo</a>`" },
    { code: "html`<a href='#'><div>asdf</div></a>`" },
    // give me some code that won't trigger a warning
  ],

  invalid: [
    // {
    //     code: "html`<a></a>`",
    //     errors: [{
    //         message: "Fill me in.",
    //         type: "Me too"
    //     }]
    // }
  ],
});
