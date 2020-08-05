/**
 * @fileoverview click-events-have-key-events
 * @author open-wc
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const { RuleTester } = require('eslint');
const rule = require('../../../lib/rules/click-events-have-key-events');

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2015,
  },
});

ruleTester.run('click-events-have-key-events', rule, {
  valid: [
    { code: 'html`<div @click=${foo} aria-hidden />`' }, // eslint-disable-line
    { code: 'html`<div @click=${foo} aria-hidden="true" />`' }, // eslint-disable-line
    { code: 'html`<div @click=${foo} aria-hidden=${true} />`' }, // eslint-disable-line
    { code: 'html`<div @click=${foo} aria-hidden=${false} @keydown=${foo} />`' }, // eslint-disable-line
    { code: 'html`<a @click=${foo} href="http://x.y.z" />`' }, // eslint-disable-line
    { code: 'html`<a @click=${foo} href="http://x.y.z" tabindex="0" />`' }, // eslint-disable-line
    { code: 'html`<div @click=${foo} @keydown=${foo}/>`' }, // eslint-disable-line
    { code: 'html`<div @click=${foo} @keyup=${foo} />`' }, // eslint-disable-line
    { code: 'html`<div @click=${foo} @keypress=${foo}/>`' }, // eslint-disable-line
    { code: 'html`<input @click=${foo} />`' }, // eslint-disable-line
    { code: 'html`<div @click=${foo} @keydown=${foo} />`' }, // eslint-disable-line
  ],

  invalid: [
    {
      code: 'html`<div @click=${foo}></div>`', // eslint-disable-line
      errors: [
        {
          message:
            'Clickable non-interactive elements must have at least 1 keyboard event listener',
        },
      ],
    },
    {
      // eslint-disable-next-line
      code: 'html`<div @click=${foo} ></div>`;',
      errors: [
        {
          message:
            'Clickable non-interactive elements must have at least 1 keyboard event listener',
        },
      ],
    },
    {
      // eslint-disable-next-line
      code: 'html`<section @click=${foo} ></section>`;',
      errors: [
        {
          message:
            'Clickable non-interactive elements must have at least 1 keyboard event listener',
        },
      ],
    },
    {
      // eslint-disable-next-line
      code: 'html`<main @click=${foo} ></main>`;',
      errors: [
        {
          message:
            'Clickable non-interactive elements must have at least 1 keyboard event listener',
        },
      ],
    },
    {
      // eslint-disable-next-line
      code: 'html`<article @click=${foo} ></article>`;',
      errors: [
        {
          message:
            'Clickable non-interactive elements must have at least 1 keyboard event listener',
        },
      ],
    },
    {
      // eslint-disable-next-line
      code: 'html`<header @click=${foo} ></header>`;',
      errors: [
        {
          message:
            'Clickable non-interactive elements must have at least 1 keyboard event listener',
        },
      ],
    },
    {
      // eslint-disable-next-line
      code: 'html`<footer @click=${foo} ></footer>`;',
      errors: [
        {
          message:
            'Clickable non-interactive elements must have at least 1 keyboard event listener',
        },
      ],
    },
    {
      // eslint-disable-next-line
      code: 'html`<a @click=${foo} ></a>`;',
      errors: [
        {
          message:
            'Clickable non-interactive elements must have at least 1 keyboard event listener',
        },
      ],
    },
  ],
});
