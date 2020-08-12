/**
 * @fileoverview Enforce elements with aria-activedescendant are tabbable.
 * @author open-wc
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const { RuleTester } = require('eslint');
const rule = require('../../../lib/rules/aria-activedescendant-has-tabindex');

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2015,
  },
});

ruleTester.run('aria-activedescendant-has-tabindex', rule, {
  valid: [
    {
      code: 'html`<div aria-activedescendant="foo" tabindex="0" />;`', // eslint-disable-line
    },
    {
      code: 'html`<div aria-activedescendant=${someID} tabindex=${0} />;`', // eslint-disable-line
    },
    {
      code: 'html`<div aria-activedescendant=${someID} tabindex="0" />;`', // eslint-disable-line
    },
    {
      code: 'html`<div aria-activedescendant=${someID} tabindex=${1} />;`', // eslint-disable-line
    },
    {
      code: 'html`<input aria-activedescendant=${someID} />;`', // eslint-disable-line
    },
    {
      code: 'html`<input aria-activedescendant=${someID} tabindex=${1} />;`', // eslint-disable-line
    },
    {
      code: 'html`<input aria-activedescendant=${someID} tabindex=${0} />;`', // eslint-disable-line
    },
    {
      code: 'html`<input aria-activedescendant=${someID} tabindex=${-1} />;`', // eslint-disable-line
    },
    {
      code: 'html`<div aria-activedescendant=${someID} tabindex=${-1} />;`', // eslint-disable-line
    },
    {
      code: 'html`<div aria-activedescendant=${someID} tabindex="-1" />;`', // eslint-disable-line
    },
    {
      code: 'html`<input aria-activedescendant=${someID} tabindex=${-1} />;`', // eslint-disable-line
    },
  ],

  invalid: [
    {
      code: 'html`<div aria-activedescendant=${someID}></div>`;', // eslint-disable-line
      errors: [
        {
          message: 'Elements with aria-activedescendant must be tabbable.',
        },
      ],
    },
  ],
});
