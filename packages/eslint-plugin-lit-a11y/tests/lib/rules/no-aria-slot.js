/**
 * @fileoverview Ensure that slots do not contain aria or role attributes.
 * @author Cory LaViska
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
  valid: [
    { code: 'html`<slot></slot>`' },
    { code: 'html`<slot name="test"></slot>`' },
    { code: 'html`<div role="button" aria-label="test"><slot></slot></div>`' },
  ],
  invalid: [
    {
      code: 'html`<slot role="button"></slot>`',
      errors: [{ messageId: 'noAriaSlot' }],
    },
    {
      code: 'html`<slot aria-label="test"></slot>`',
      errors: [{ messageId: 'noAriaSlot' }],
    },
  ],
});
