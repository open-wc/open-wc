/**
 * @fileoverview Elements with an interactive role and interaction handlers (mouse or key press) must be focusable.
 * @author open-wc
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const { RuleTester } = require('eslint');
const rule = require('../../../lib/rules/interactive-supports-focus');
const { parserOptionsMapper } = require('../utils/parserOptionsMapper');
const { ruleOptionsMapperFactory } = require('../utils/ruleOptionsMapperFactory');

const recommendedOptions = {
  tabbable: ['button', 'checkbox', 'link', 'searchbox', 'spinbutton', 'switch', 'textbox'],
};

const strictOptions = {
  tabbable: [
    'button',
    'checkbox',
    'link',
    'progressbar',
    'searchbox',
    'slider',
    'spinbutton',
    'switch',
    'textbox',
  ],
};

const alwaysValid = [
  { code: 'html`<div></div>`' },
  { code: 'html`<div aria-hidden @click=${() => void 0} />`' },
  { code: 'html`<div aria-hidden=${true == true} @click=${() => void 0} />`' },
  { code: 'html`<div aria-hidden=${true === true} @click=${() => void 0} />`' },
  { code: 'html`<div aria-hidden=${hidden !== false} @click=${() => void 0} />`' },
  { code: 'html`<div aria-hidden=${hidden != false} @click=${() => void 0} />`' },
  { code: 'html`<div aria-hidden=${1 < 2} @click=${() => void 0} />`' },
  { code: 'html`<div aria-hidden=${1 <= 2} @click=${() => void 0} />`' },
  { code: 'html`<div aria-hidden=${2 > 1} @click=${() => void 0} />`' },
  { code: 'html`<div aria-hidden=${2 >= 1} @click=${() => void 0} />`' },
  { code: 'html`<div @click=${() => void 0} />`' },
  { code: 'html`<div @click=${() => void 0} tabindex=${undefined} />`' },
  { code: 'html`<div @click=${() => void 0} tabindex="bad" />`' },
  { code: 'html`<div @click=${() => void 0} role=${undefined} />`' },
  { code: 'html`<div role="section" @click=${() => void 0} />`' },
  { code: 'html`<div @click=${() => void 0} aria-hidden=${false} />`' },
  { code: 'html`<input type="text" @click=${() => void 0} />`' },
  { code: 'html`<input type="hidden" @click=${() => void 0} tabindex="-1" />`' },
  { code: 'html`<input type="hidden" @click=${() => void 0} tabindex=${-1} />`' },
  { code: 'html`<input @click=${() => void 0} />`' },
  { code: 'html`<input @click=${() => void 0} role="combobox" />`' },
  { code: 'html`<button @click=${() => void 0} className="foo" />`' },
  { code: 'html`<option @click=${() => void 0} className="foo" />`' },
  { code: 'html`<select @click=${() => void 0} className="foo" />`' },
  { code: 'html`<area href="#" @click=${() => void 0} className="foo" />`' },
  { code: 'html`<area @click=${() => void 0} className="foo" />`' },
  { code: 'html`<summary @click=${() => void 0} />`' },
  { code: 'html`<textarea @click=${() => void 0} className="foo" />`' },
  { code: 'html`<a @click="${showNextPage()}">Next page</a>`' },
  { code: 'html`<a @click="${showNextPage()}" tabindex=${undefined}>Next page</a>`' },
  { code: 'html`<a @click="${showNextPage()}" tabindex="bad">Next page</a>`' },
  { code: 'html`<a @click=${() => void 0} />`' },
  { code: 'html`<a tabindex="0" @click=${() => void 0} />`' },
  { code: 'html`<a tabindex=${dynamictabindex} @click=${() => void 0} />`' },
  { code: 'html`<a tabindex=${0} @click=${() => void 0} />`' },
  { code: 'html`<a role="button" href="#" @click=${() => void 0} />`' },
  { code: 'html`<a @click=${() => void 0} href="http://x.y.z" />`' },
  { code: 'html`<a @click=${() => void 0} href="http://x.y.z" tabindex="0" />`' },
  { code: 'html`<a @click=${() => void 0} href="http://x.y.z" tabindex=${0} />`' },
  { code: 'html`<a @click=${() => void 0} href="http://x.y.z" role="button" />`' },
  { code: 'html`<foo-bar @click=${doFoo}><foo-bar/>`' },
  { code: 'html`<input @click=${() => void 0} type="hidden" />`' },
  { code: 'html`<span @click="${submitForm()}">Submit</span>`' },
  { code: 'html`<span @click="${submitForm()}" tabindex=${undefined}>Submit</span>`' },
  { code: 'html`<span @click="${submitForm()}" tabindex="bad">Submit</span>`' },
  { code: 'html`<span @click="${doSomething()}" tabindex="0">Click me!</span>`' },
  { code: 'html`<span @click="${doSomething()}" tabindex=${0}>Click me!</span>`' },
  { code: 'html`<span @click="${doSomething()}" tabindex="-1">Click me too!</span>`' },
  {
    code: 'html`<a href="javascript:void(0);" @click="${doSomething()}">Click ALL the things!</a>`',
  },
  { code: 'html`<section @click=${() => void 0} />`' },
  { code: 'html`<main @click=${() => void 0} />`' },
  { code: 'html`<article @click=${() => void 0} />`' },
  { code: 'html`<header @click=${() => void 0} />`' },
  { code: 'html`<footer @click=${() => void 0} />`' },
  { code: 'html`<div role="button" tabindex="0" @click=${() => void 0} />`' },
  { code: 'html`<div role="checkbox" tabindex="0" @click=${() => void 0} />`' },
  { code: 'html`<div role="link" tabindex="0" @click=${() => void 0} />`' },
  { code: 'html`<div role="menuitem" tabindex="0" @click=${() => void 0} />`' },
  { code: 'html`<div role="menuitemcheckbox" tabindex="0" @click=${() => void 0} />`' },
  { code: 'html`<div role="menuitemradio" tabindex="0" @click=${() => void 0} />`' },
  { code: 'html`<div role="option" tabindex="0" @click=${() => void 0} />`' },
  { code: 'html`<div role="radio" tabindex="0" @click=${() => void 0} />`' },
  { code: 'html`<div role="spinbutton" tabindex="0" @click=${() => void 0} />`' },
  { code: 'html`<div role="switch" tabindex="0" @click=${() => void 0} />`' },
  { code: 'html`<div role="tablist" tabindex="0" @click=${() => void 0} />`' },
  { code: 'html`<div role="tab" tabindex="0" @click=${() => void 0} />`' },
  { code: 'html`<div role="textbox" tabindex="0" @click=${() => void 0} />`' },
  { code: 'html`<div role="textbox" aria-disabled="true" @click=${() => void 0} />`' },
  { code: 'html`<foo-bar @click=${() => void 0} aria-hidden=${false}><foo-bar/>`' },
  { code: 'html`<input @click=${() => void 0} type="hidden" />`' },
];

const alwaysFail = [
  {
    code: 'html`<span @click="${submitForm()}" role="button">Submit</span>`', // eslint-disable-line
    errors: [
      {
        messageId: 'elementWithRoleMustBe',
        data: {
          role: 'button',
          type: 'focusable',
        },
      },
    ],
  },
  {
    code: 'html`<a @click="${showNextPage()}" role="button">Next page</a>`', // eslint-disable-line
    errors: [
      {
        messageId: 'elementWithRoleMustBe',
        data: {
          role: 'button',
          type: 'focusable',
        },
      },
    ],
  },
];

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();
ruleTester.run('interactive-supports-focus:recommended', rule, {
  valid: [...alwaysValid]
    .map(ruleOptionsMapperFactory(recommendedOptions))
    .map(parserOptionsMapper),

  invalid: [...alwaysFail]
    .map(ruleOptionsMapperFactory(recommendedOptions))
    .map(parserOptionsMapper),
});

ruleTester.run('interactive-supports-focus:strict', rule, {
  valid: [...alwaysValid].map(ruleOptionsMapperFactory(strictOptions)).map(parserOptionsMapper),

  invalid: [...alwaysFail].map(ruleOptionsMapperFactory(strictOptions)).map(parserOptionsMapper),
});
