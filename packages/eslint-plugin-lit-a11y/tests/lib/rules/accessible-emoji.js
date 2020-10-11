/**
 * @fileoverview accessible-emoji
 * @author open-wc
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const { RuleTester } = require('eslint');
const rule = require('../../../lib/rules/accessible-emoji');

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2015,
  },
});

ruleTester.run('accessible-emoji', rule, {
  valid: [
    { code: 'html`<div></div>`' },
    { code: 'html`<div>asdf</div>`' },
    { code: 'html`<span></span>`' },
    { code: 'html`<span>No emoji here!</span>`' },
    { code: 'html`<span role="img" aria-label="Panda face">🐼</span>`' },
    { code: 'html`<span role="img" aria-label="Snowman">&#9731;</span>`' },
    { code: 'html`<span role="img" aria-labelledby="id1">🐼</span>`' },
    { code: 'html`<span role="img" aria-labelledby="id1">&#9731;</span>`' },
    { code: 'html`<span role="img" aria-labelledby="id1" aria-label="Snowman">&#9731;</span>`' },
    { code: 'html`<span>${foo}</span>`' },
    { code: 'html`<span aria-hidden>${foo}</span>`' },
    { code: 'html`<span aria-hidden="true">🐼</span>`' },
    { code: 'html`<span aria-hidden>🐼</span>`' },
    { code: 'html`<div aria-hidden="true">🐼</div>`' },
  ],

  invalid: [
    {
      code: 'html`<span>🐼</span>`',
      errors: [
        {
          message:
            'Emojis must either be wrapped in <span role="img"> with a label, or hidden from the AOM.',
        },
      ],
    },
    {
      code: 'html`<span>foo🐼bar</span>`',
      errors: [
        {
          message:
            'Emojis must either be wrapped in <span role="img"> with a label, or hidden from the AOM.',
        },
      ],
    },
    {
      code: 'html`<span>foo 🐼 bar</span>`',
      errors: [
        {
          message:
            'Emojis must either be wrapped in <span role="img"> with a label, or hidden from the AOM.',
        },
      ],
    },
    {
      code: 'html`<i role="img" aria-label="Panda face">🐼</i>`',
      errors: [
        {
          message:
            'Emojis must either be wrapped in <span role="img"> with a label, or hidden from the AOM.',
        },
      ],
    },
    {
      code: 'html`<i role="img" aria-labelledby="id1">🐼</i>`',
      errors: [
        {
          message:
            'Emojis must either be wrapped in <span role="img"> with a label, or hidden from the AOM.',
        },
      ],
    },
    {
      code: 'html`<span aria-hidden="false">🐼</span>`',
      errors: [
        {
          message:
            'Emojis must either be wrapped in <span role="img"> with a label, or hidden from the AOM.',
        },
      ],
    },
  ],
});
