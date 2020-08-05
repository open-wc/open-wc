/**
 * @fileoverview template
 * @author open-wc
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const { RuleTester } = require('eslint');
const rule = require('../../../lib/rules/template');

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2015,
  },
});

ruleTester.run('template', rule, {
  valid: [
    // { code: "html``" }
  ],

  invalid: [
    // {
    //   code: "html``",
    //   errors: [{
    //     message: "template"
    //   }]
    // }
  ],
});
