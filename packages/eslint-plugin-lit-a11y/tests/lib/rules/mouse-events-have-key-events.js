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
    { code: 'html`<div @mouseover=${foo} @focus=${foo} />;`' }, // eslint-disable-line
    {
      code: 'html`<div @mouseover=${foo} @focus=${foo} />;`', // eslint-disable-line
    },
    { code: 'html`<div @mouseover=${handleMouseOver} @focus=${handleFocus} />`' }, // eslint-disable-line
    {
      code: 'html`<div @mouseover=${handleMouseOver} @focus=${handleFocus} />`', // eslint-disable-line
    },
    { code: 'html`<div />;`' },
    { code: 'html`<div @blur=${() => {}} />`' }, // eslint-disable-line
    { code: 'html`<div @focus=${() => {}} />`' }, // eslint-disable-line
    { code: 'html`<div @mouseout=${foo} @blur=${foo} />`' }, // eslint-disable-line
    { code: 'html`<div @mouseout=${foo} @blur=${foo} />`' }, // eslint-disable-line
    { code: 'html`<div @mouseout=${handleMouseOut} @blur=${handleOnBlur} />`' }, // eslint-disable-line
    { code: 'html`<div @mouseout=${handleMouseOut} @blur=${handleOnBlur} />`' }, // eslint-disable-line
  ],

  invalid: [
    {
      // eslint-disable-next-line
      code: 'html`<div @mouseover=${foo} />;`',
      errors: ['@mouseover must be accompanied by @focus for accessibility.'],
    },
    {
      // eslint-disable-next-line
      code: 'html`<div @mouseout=${foo} />`',
      errors: ['@mouseout must be accompanied by @blur for accessibility.'],
    },
    {
      code: 'html`<div @mouseover=${foo} />`', // eslint-disable-line
      errors: ['@mouseover must be accompanied by @focus for accessibility.'],
    },
    {
      code: 'html`<div @mouseout=${foo} />`', // eslint-disable-line
      errors: ['@mouseout must be accompanied by @blur for accessibility.'],
    },
  ],
});
