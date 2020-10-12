/**
 * @fileoverview mouse-events-have-key-events
 * @author open-wc
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const { RuleTester } = require('eslint');
const rule = require('../../../lib/rules/mouse-events-have-key-events.js');

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2015,
  },
});

ruleTester.run('mouse-events-have-key-events', rule, {
  valid: [
    { code: 'html`<div @mouseover=${foo} @focus=${foo} />;`' },
    { code: 'html`<div @mouseover=${foo} @focus=${foo} />;`' },
    { code: 'html`<div @mouseover=${handleMouseOver} @focus=${handleFocus} />`' },
    { code: 'html`<div @mouseover=${handleMouseOver} @focus=${handleFocus} />`' },
    { code: 'html`<div />;`' },
    { code: 'html`<div @blur=${() => {}} />`' },
    { code: 'html`<div @focus=${() => {}} />`' },
    { code: 'html`<div @mouseout=${foo} @blur=${foo} />`' },
    { code: 'html`<div @mouseout=${foo} @blur=${foo} />`' },
    { code: 'html`<div @mouseout=${handleMouseOut} @blur=${handleOnBlur} />`' },
    { code: 'html`<div @mouseout=${handleMouseOut} @blur=${handleOnBlur} />`' },
  ],

  invalid: [
    {
      code: 'html`<div @mouseover=${foo} />;`',
      errors: ['@mouseover must be accompanied by @focus.'],
    },
    {
      code: 'html`<div @mouseout=${foo} />`',
      errors: ['@mouseout must be accompanied by @blur.'],
    },
    {
      code: 'html`<div @mouseover=${foo} />`',
      errors: ['@mouseover must be accompanied by @focus.'],
    },
    {
      code: 'html`<div @mouseout=${foo} />`',
      errors: ['@mouseout must be accompanied by @blur.'],
    },
  ],
});
