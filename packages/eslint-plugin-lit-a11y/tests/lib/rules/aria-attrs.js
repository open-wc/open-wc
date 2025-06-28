/**
 * @fileoverview Elements cannot use an invalid ARIA attribute.
 * @author passle
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

import { RuleTester } from 'eslint';
import rule from '../../../lib/rules/aria-attrs.js';

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  settings: { litHtmlSources: false },
  languageOptions: {
    parserOptions: {
      sourceType: 'module',
      ecmaVersion: 2015,
    },
  },
});

ruleTester.run('aria-attrs', rule, {
  valid: [
    {
      code: "html`<div aria-labelledby='foo'></div>`",
    },
    // give me some code that won't trigger a warning
  ],

  invalid: [
    {
      code: "html`<div aria-foo=''></div>`",
      errors: [
        {
          message: 'Invalid ARIA attribute "aria-foo".',
        },
      ],
    },
  ],
});
