/**
 * @fileoverview click-events-have-key-events
 * @author open-wc
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const { RuleTester } = require('eslint');
const rule = require('../../../lib/rules/click-events-have-key-events');
const { prependLitHtmlImport } = require('../../../lib/utils/utils.js');

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
    { code: 'html`<div @click=${foo} aria-hidden />`' },
    { code: 'html`<div @click=${foo} aria-hidden="true" />`' },
    { code: 'html`<div @click=${foo} aria-hidden=${true} />`' },
    { code: 'html`<div @click=${foo} aria-hidden=${false} @keydown=${foo} />`' },
    { code: 'html`<a @click=${foo} href="http://x.y.z" />`' },
    { code: 'html`<a @click=${foo} href="http://x.y.z" tabindex="0" />`' },
    { code: 'html`<div @click=${foo} @keydown=${foo}/>`' },
    { code: 'html`<div @click=${foo} @keyup=${foo} />`' },
    { code: 'html`<div @click=${foo} @keypress=${foo}/>`' },
    { code: 'html`<input @click=${foo} />`' },
    { code: 'html`<div @click=${foo} @keydown=${foo} />`' },
    { code: 'html`<custom-button @click=${foo} />`', options: [{ allowList: ['custom-button'] }] },
  ].map(prependLitHtmlImport),

  invalid: [
    {
      code: 'html`<div @click=${foo}></div>`',
      errors: [
        {
          message:
            'Clickable non-interactive elements must have at least 1 keyboard event listener',
        },
      ],
    },
    {
      code: 'html`<div @click=${foo} ></div>`;',
      errors: [
        {
          message:
            'Clickable non-interactive elements must have at least 1 keyboard event listener',
        },
      ],
    },
    {
      code: 'html`<section @click=${foo} ></section>`;',
      errors: [
        {
          message:
            'Clickable non-interactive elements must have at least 1 keyboard event listener',
        },
      ],
    },
    {
      code: 'html`<main @click=${foo} ></main>`;',
      errors: [
        {
          message:
            'Clickable non-interactive elements must have at least 1 keyboard event listener',
        },
      ],
    },
    {
      code: 'html`<article @click=${foo} ></article>`;',
      errors: [
        {
          message:
            'Clickable non-interactive elements must have at least 1 keyboard event listener',
        },
      ],
    },
    {
      code: 'html`<header @click=${foo} ></header>`;',
      errors: [
        {
          message:
            'Clickable non-interactive elements must have at least 1 keyboard event listener',
        },
      ],
    },
    {
      code: 'html`<footer @click=${foo} ></footer>`;',
      errors: [
        {
          message:
            'Clickable non-interactive elements must have at least 1 keyboard event listener',
        },
      ],
    },
    {
      code: 'html`<a @click=${foo} ></a>`;',
      errors: [
        {
          message:
            'Clickable non-interactive elements must have at least 1 keyboard event listener',
        },
      ],
    },
    {
      code: 'html`<custom-button @click=${foo} ></custom-button>`;',
      errors: [
        {
          message:
            'Clickable non-interactive elements must have at least 1 keyboard event listener',
        },
      ],
    },
    {
      code: 'html`<another-button @click=${foo} ></another-button>`;',
      errors: [
        {
          message:
            'Clickable non-interactive elements must have at least 1 keyboard event listener',
        },
      ],
    },
  ].map(prependLitHtmlImport),
});
