/**
 * @fileoverview Ensures the document has a valid `lang` attribute.
 * @author open-wc
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const { RuleTester } = require('eslint');
const rule = require('../../../lib/rules/valid-lang');

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

ruleTester.run('valid-lang', rule, {
  valid: [
    {
      code: "html`<html lang='en'></html>`",
    },
    {
      code: "html`<div lang='en'></div>`",
    },
  ],
  invalid: [
    {
      code: "html`<html lang='invalid-lang'></html>`",
      errors: [{ messageId: 'invalidLang' }],
    },
    {
      code: 'html`<html></html>`',
      errors: [{ messageId: 'noLangPresent' }],
    },
  ],
});
