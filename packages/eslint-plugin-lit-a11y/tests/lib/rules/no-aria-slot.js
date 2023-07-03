/**
 * @fileoverview <TODO>
 * @author Cory Laviska & Konnor Rogers
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const { RuleTester } = require('eslint');
const rule = require('../../../lib/rules/no-aria-slot.js');

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

ruleTester.run('no-aria-slot', rule, {
  valid: [{ code: '<TODO>' }],
  invalid: [
    {
      code: '<TODO>',
      errors: [{ messageId: 'TODO' }],
    },
  ],
});
