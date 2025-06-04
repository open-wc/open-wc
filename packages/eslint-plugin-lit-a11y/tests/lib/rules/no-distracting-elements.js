/**
 * @fileoverview Enforce distracting elements are not used.
 * @author open-wc
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

import { RuleTester } from 'eslint';
import rule from '../../../lib/rules/no-distracting-elements.js';

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

ruleTester.run('no-distracting-elements', rule, {
  valid: [{ code: 'html`<div></div>`' }],

  invalid: [
    {
      code: 'html`<marquee></marquee>`',
      errors: [
        {
          message: '<marquee> elements are distracting and must not be used.',
        },
      ],
    },
    {
      code: 'html`<blink></blink>`',
      errors: [
        {
          message: '<blink> elements are distracting and must not be used.',
        },
      ],
    },
  ],
});
