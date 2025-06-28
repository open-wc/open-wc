/**
 * @fileoverview Enforce no accesskey attribute on element.
 * @author open-wc
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

import { RuleTester } from 'eslint';
import rule from '../../../lib/rules/no-access-key.js';

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

ruleTester.run('no-access-key', rule, {
  valid: [
    { code: 'html`<a></a>`' },
    // give me some code that won't trigger a warning
  ],

  invalid: [
    {
      code: "html`<a accesskey='j'></a>`",
      errors: [
        {
          message: 'Avoid using the accesskey attribute.',
        },
      ],
    },
    {
      code: "html`<a accesskey='${foo}'></a>`",
      errors: [
        {
          message: 'Avoid using the accesskey attribute.',
        },
      ],
    },
    {
      code: "html`<a accesskey='${'f'}'></a>`",
      errors: [
        {
          message: 'Avoid using the accesskey attribute.',
        },
      ],
    },
  ],
});
