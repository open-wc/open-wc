/**
 * @fileoverview Elements with an interactive role and interaction handlers (mouse or key press) must be focusable.
 * @author open-wc
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const { RuleTester } = require('eslint');
const rule = require('../../../lib/rules/interactive-supports-focus');

const alwaysValid = [
  { code: 'html`<div />`' },
  // { code: 'html`<div aria-hidden @click=${() => void 0} />`' },
  // { code: 'html`<div aria-hidden=${true == true} @click=${() => void 0} />`' },
  // { code: 'html`<div aria-hidden=${true === true} @click=${() => void 0} />`' },
  // { code: 'html`<div aria-hidden=${hidden !== false} @click=${() => void 0} />`' },
  // { code: 'html`<div aria-hidden=${hidden != false} @click=${() => void 0} />`' },
  // { code: 'html`<div aria-hidden=${1 < 2} @click=${() => void 0} />`' },
  // { code: 'html`<div aria-hidden=${1 <= 2} @click=${() => void 0} />`' },
  // { code: 'html`<div aria-hidden=${2 > 1} @click=${() => void 0} />`' },
  // { code: 'html`<div aria-hidden=${2 >= 1} @click=${() => void 0} />`' },
  // { code: 'html`<div @click=${() => void 0} />`' },
  // { code: 'html`<div @click=${() => void 0} tabIndex=${undefined} />`' },
  // { code: 'html`<div @click=${() => void 0} tabIndex="bad" />`' },
  // { code: 'html`<div @click=${() => void 0} role=${undefined} />`' },
  // { code: 'html`<div role="section" @click=${() => void 0} />`' },
  // { code: 'html`<div @click=${() => void 0} aria-hidden=${false} />`' },
  // { code: 'html`<div @click=${() => void 0} {...props} />`' },
  // { code: 'html`<input type="text" @click=${() => void 0} />`' },
  // { code: 'html`<input type="hidden" @click=${() => void 0} tabIndex="-1" />`' },
  // { code: 'html`<input type="hidden" @click=${() => void 0} tabIndex=${-1} />`' },
  // { code: 'html`<input @click=${() => void 0} />`' },
  // { code: 'html`<input @click=${() => void 0} role="combobox" />`' },
  // { code: 'html`<button @click=${() => void 0} className="foo" />`' },
  // { code: 'html`<option @click=${() => void 0} className="foo" />`' },
  // { code: 'html`<select @click=${() => void 0} className="foo" />`' },
  // { code: 'html`<area href="#" @click=${() => void 0} className="foo" />`' },
  // { code: 'html`<area @click=${() => void 0} className="foo" />`' },
  // { code: 'html`<summary @click=${() => void 0} />`' },
  // { code: 'html`<textarea @click=${() => void 0} className="foo" />`' },
  // { code: 'html`<a @click="${showNextPage()}">Next page</a>`' },
  // { code: 'html`<a @click="${showNextPage()}" tabIndex=${undefined}>Next page</a>`' },
  // { code: 'html`<a @click="${showNextPage()}" tabIndex="bad">Next page</a>`' },
  // { code: 'html`<a @click=${() => void 0} />`' },
  // { code: 'html`<a tabIndex="0" @click=${() => void 0} />`' },
  // { code: 'html`<a tabIndex=${dynamicTabIndex} @click=${() => void 0} />`' },
  // { code: 'html`<a tabIndex=${0} @click=${() => void 0} />`' },
  // { code: 'html`<a role="button" href="#" @click=${() => void 0} />`' },
  // { code: 'html`<a @click=${() => void 0} href="http://x.y.z" />`' },
  // { code: 'html`<a @click=${() => void 0} href="http://x.y.z" tabIndex="0" />`' },
  // { code: 'html`<a @click=${() => void 0} href="http://x.y.z" tabIndex=${0} />`' },
  // { code: 'html`<a @click=${() => void 0} href="http://x.y.z" role="button" />`' },
  // { code: 'html`<TestComponent @click=${doFoo} />`' },
  // { code: 'html`<input @click=${() => void 0} type="hidden" />`' },
  // { code: 'html`<span @click="${submitForm()}">Submit</span>`' },
  // { code: 'html`<span @click="${submitForm()}" tabIndex=${undefined}>Submit</span>`' },
  // { code: 'html`<span @click="${submitForm()}" tabIndex="bad">Submit</span>`' },
  // { code: 'html`<span @click="${doSomething()}" tabIndex="0">Click me!</span>`' },
  // { code: 'html`<span @click="${doSomething()}" tabIndex=${0}>Click me!</span>`' },
  // { code: 'html`<span @click="${doSomething()}" tabIndex="-1">Click me too!</span>`' },
  // {
  //   code: 'html`<a href="javascript:void(0);" @click="${doSomething()}">Click ALL the things!</`a>',
  // },
  // { code: 'html`<section @click=${() => void 0} />`' },
  // { code: 'html`<main @click=${() => void 0} />`' },
  // { code: 'html`<article @click=${() => void 0} />`' },
  // { code: 'html`<header @click=${() => void 0} />`' },
  // { code: 'html`<footer @click=${() => void 0} />`' },
  // { code: 'html`<div role="button" tabIndex="0" @click=${() => void 0} />`' },
  // { code: 'html`<div role="checkbox" tabIndex="0" @click=${() => void 0} />`' },
  // { code: 'html`<div role="link" tabIndex="0" @click=${() => void 0} />`' },
  // { code: 'html`<div role="menuitem" tabIndex="0" @click=${() => void 0} />`' },
  // { code: 'html`<div role="menuitemcheckbox" tabIndex="0" @click=${() => void 0} />`' },
  // { code: 'html`<div role="menuitemradio" tabIndex="0" @click=${() => void 0} />`' },
  // { code: 'html`<div role="option" tabIndex="0" @click=${() => void 0} />`' },
  // { code: 'html`<div role="radio" tabIndex="0" @click=${() => void 0} />`' },
  // { code: 'html`<div role="spinbutton" tabIndex="0" @click=${() => void 0} />`' },
  // { code: 'html`<div role="switch" tabIndex="0" @click=${() => void 0} />`' },
  // { code: 'html`<div role="tablist" tabIndex="0" @click=${() => void 0} />`' },
  // { code: 'html`<div role="tab" tabIndex="0" @click=${() => void 0} />`' },
  // { code: 'html`<div role="textbox" tabIndex="0" @click=${() => void 0} />`' },
  // { code: 'html`<div role="textbox" aria-disabled="true" @click=${() => void 0} />`' },
  // { code: 'html`<Foo.Bar @click=${() => void 0} aria-hidden=${false} />`' },
  // { code: 'html`<Input @click=${() => void 0} type="hidden" />`' },
];

const alwaysFail = [
  { code: 'html`<span @click="${submitForm()}" role="button">Submit</span>`' }, // eslint-disable-line
  { code: 'html`<a @click="${showNextPage()}" role="button">Next page</a>`' }, // eslint-disable-line
];

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2015,
  },
});
ruleTester.run('interactive-supports-focus', rule, {
  valid: [...alwaysValid],

  invalid: [...alwaysFail],
});
