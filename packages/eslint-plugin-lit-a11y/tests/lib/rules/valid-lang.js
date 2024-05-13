/**
 * @fileoverview Ensures the document has a valid `lang` attribute.
 * @author open-wc
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const { RuleTester } = require('eslint');
const rule = require('../../../lib/rules/valid-lang.js');

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
    {
      code: 'html`<html lang="${\'en\'}"></html>`',
    },
  ],
  invalid: [
    {
      code: 'html`<html></html>`',
      errors: [{ messageId: 'noLangPresent', column: 6 }],
    },
    {
      code: 'html`<html>\n<div></div>\n</html>`',
      errors: [{ messageId: 'noLangPresent', column: 6 }],
    },
    {
      code: "html`<html lang='invalid-lang'></html>`",
      errors: [{ messageId: 'invalidLang', column: 12 }],
    },
    {
      code: 'html`<html lang=${"foobar"}></html>`',
      errors: [{ messageId: 'invalidLang', column: 12 }],
    },
    {
      code: 'html`<html lang=${1}></html>`',
      errors: [{ messageId: 'invalidLang', column: 12 }],
    },
  ],
});
