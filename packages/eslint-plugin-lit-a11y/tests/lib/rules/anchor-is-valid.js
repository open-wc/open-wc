/**
 * @fileoverview anchor-is-valid
 * @author open-wc
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const { RuleTester } = require('eslint');
const rule = require('../../../lib/rules/anchor-is-valid.js');

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2015,
  },
});

ruleTester.run('anchor-is-valid', rule, {
  valid: [
    { code: 'html`<a href="foo" />`' },
    { code: 'html`<a href=${foo} />`' },
    { code: 'html`<a href="/foo" />`' },
    { code: 'html`<a href="https://foo.bar.com" />`' },
    { code: 'html`<div href="foo" />`' },
    { code: 'html`<a href="javascript" />`' },
    { code: 'html`<a href="javascriptFoo" />`' },
    { code: 'html`<a href="#foo" />`' },
    { code: 'html`<a href="#javascript" />`' },
    { code: 'html`<a href="#javascriptFoo" />`' },

    { code: 'html`<a href="foo" @click=${foo} />`' },
    { code: 'html`<a href=${foo} @click=${foo} />`' },
    { code: 'html`<a href="/foo" @click=${foo} />`' },
    { code: 'html`<a href="https://foo.bar.com" @click=${foo} />`' },
    { code: 'html`<div href="foo" @click=${foo} />`' },
    { code: 'html`<a href=${`#foo`} @click=${foo} />`' },
    { code: 'html`<a href="#foo" @click=${foo} />`' },

    { code: 'html`<a href="" />;`', options: [{ aspects: ['preferButton'] }] },
    { code: 'html`<a href="#" />`', options: [{ aspects: ['preferButton'] }] },
    { code: 'html`<a href=${"#"} />`', options: [{ aspects: ['preferButton'] }] },
    { code: 'html`<a href="javascript:void(0)" />`', options: [{ aspects: ['preferButton'] }] },
    { code: 'html`<a href=${"javascript:void(0)"} />`', options: [{ aspects: ['preferButton'] }] },
    { code: 'html`<a href="" />;`', options: [{ aspects: ['noHref'] }] },
    { code: 'html`<a href="#" />`', options: [{ aspects: ['noHref'] }] },
    { code: 'html`<a href=${"#"} />`', options: [{ aspects: ['noHref'] }] },
    { code: 'html`<a href="javascript:void(0)" />`', options: [{ aspects: ['noHref'] }] },
    { code: 'html`<a href=${"javascript:void(0)"} />`', options: [{ aspects: ['noHref'] }] },
    { code: 'html`<a href="" />;`', options: [{ aspects: ['noHref', 'preferButton'] }] },
    { code: 'html`<a href="#" />`', options: [{ aspects: ['noHref', 'preferButton'] }] },
    { code: 'html`<a href=${"#"} />`', options: [{ aspects: ['noHref', 'preferButton'] }] },
    {
      code: 'html`<a href="javascript:void(0)" />`',
      options: [{ aspects: ['noHref', 'preferButton'] }],
    },
    {
      code: 'html`<a href=${"javascript:void(0)"} />`',
      options: [{ aspects: ['noHref', 'preferButton'] }],
    },

    { code: 'html`<a @click=${foo} />`', options: [{ aspects: ['invalidHref'] }] },
    { code: 'html`<a href="#" @click=${foo} />`', options: [{ aspects: ['noHref'] }] },
    {
      code: 'html`<a href="javascript:void(0)" @click=${foo} />`',
      options: [{ aspects: ['noHref'] }],
    },
    {
      code: 'html`<a href=${"javascript:void(0)"} @click=${foo} />`',
      options: [{ aspects: ['noHref'] }],
    },
  ],

  invalid: [
    { code: 'html`<a />`', errors: [{ messageId: 'noHrefErrorMessage' }] },
    // INVALID HREF
    { code: 'html`<a href="" />;`', errors: [{ messageId: 'invalidHrefErrorMessage' }] },
    { code: 'html`<a href="#" />`', errors: [{ messageId: 'invalidHrefErrorMessage' }] },
    {
      code: 'html`<a href="javascript:void(0)" />`',
      errors: [{ messageId: 'invalidHrefErrorMessage' }],
    },
    // SHOULD BE BUTTON
    { code: 'html`<a @click=${foo} />`', errors: [{ messageId: 'preferButtonErrorMessage' }] },
    {
      code: 'html`<a href="#" @click=${foo} />`',
      errors: [{ messageId: 'preferButtonErrorMessage' }],
    },
    {
      code: 'html`<a href="javascript:void(0)" @click=${foo} />`',
      errors: [{ messageId: 'preferButtonErrorMessage' }],
    },

    // WITH ASPECTS TESTS
    // NO HREF
    {
      code: 'html`<a />`',
      options: [{ aspects: ['noHref'] }],
      errors: [{ messageId: 'noHrefErrorMessage' }],
    },
    {
      code: 'html`<a />`',
      options: [{ aspects: ['noHref', 'preferButton'] }],
      errors: [{ messageId: 'noHrefErrorMessage' }],
    },
    {
      code: 'html`<a />`',
      options: [{ aspects: ['noHref', 'invalidHref'] }],
      errors: [{ messageId: 'noHrefErrorMessage' }],
    },

    // INVALID HREF
    {
      code: 'html`<a href="" />;`',
      options: [{ aspects: ['invalidHref'] }],
      errors: [{ messageId: 'invalidHrefErrorMessage' }],
    },
    {
      code: 'html`<a href="" />;`',
      options: [{ aspects: ['noHref', 'invalidHref'] }],
      errors: [{ messageId: 'invalidHrefErrorMessage' }],
    },
    {
      code: 'html`<a href="" />;`',
      options: [{ aspects: ['preferButton', 'invalidHref'] }],
      errors: [{ messageId: 'invalidHrefErrorMessage' }],
    },
    {
      code: 'html`<a href="#" />;`',
      options: [{ aspects: ['invalidHref'] }],
      errors: [{ messageId: 'invalidHrefErrorMessage' }],
    },
    {
      code: 'html`<a href="#" />;`',
      options: [{ aspects: ['noHref', 'invalidHref'] }],
      errors: [{ messageId: 'invalidHrefErrorMessage' }],
    },
    {
      code: 'html`<a href="#" />;`',
      options: [{ aspects: ['preferButton', 'invalidHref'] }],
      errors: [{ messageId: 'invalidHrefErrorMessage' }],
    },
    {
      code: 'html`<a href="javascript:void(0)" />;`',
      options: [{ aspects: ['invalidHref'] }],
      errors: [{ messageId: 'invalidHrefErrorMessage' }],
    },
    {
      code: 'html`<a href="javascript:void(0)" />;`',
      options: [{ aspects: ['noHref', 'invalidHref'] }],
      errors: [{ messageId: 'invalidHrefErrorMessage' }],
    },
    {
      code: 'html`<a href="javascript:void(0)" />;`',
      options: [{ aspects: ['preferButton', 'invalidHref'] }],
      errors: [{ messageId: 'invalidHrefErrorMessage' }],
    },

    // SHOULD BE BUTTON
    {
      code: 'html`<a @click=${foo} />`',
      options: [{ aspects: ['preferButton'] }],
      errors: [{ messageId: 'preferButtonErrorMessage' }],
    },
    {
      code: 'html`<a @click=${foo} />`',
      options: [{ aspects: ['preferButton', 'invalidHref'] }],
      errors: [{ messageId: 'preferButtonErrorMessage' }],
    },
    {
      code: 'html`<a @click=${foo} />`',
      options: [{ aspects: ['noHref', 'preferButton'] }],
      errors: [{ messageId: 'preferButtonErrorMessage' }],
    },
    {
      code: 'html`<a @click=${foo} />`',
      options: [{ aspects: ['noHref'] }],
      errors: [{ messageId: 'noHrefErrorMessage' }],
    },
    {
      code: 'html`<a @click=${foo} />`',
      options: [{ aspects: ['noHref', 'invalidHref'] }],
      errors: [{ messageId: 'noHrefErrorMessage' }],
    },
    {
      code: 'html`<a href="#" @click=${foo} />`',
      options: [{ aspects: ['preferButton'] }],
      errors: [{ messageId: 'preferButtonErrorMessage' }],
    },
    {
      code: 'html`<a href="#" @click=${foo} />`',
      options: [{ aspects: ['noHref', 'preferButton'] }],
      errors: [{ messageId: 'preferButtonErrorMessage' }],
    },
    {
      code: 'html`<a href="#" @click=${foo} />`',
      options: [{ aspects: ['preferButton', 'invalidHref'] }],
      errors: [{ messageId: 'preferButtonErrorMessage' }],
    },
    {
      code: 'html`<a href="#" @click=${foo} />`',
      options: [{ aspects: ['invalidHref'] }],
      errors: [{ messageId: 'invalidHrefErrorMessage' }],
    },
    {
      code: 'html`<a href="#" @click=${foo} />`',
      options: [{ aspects: ['noHref', 'invalidHref'] }],
      errors: [{ messageId: 'invalidHrefErrorMessage' }],
    },
    {
      code: 'html`<a href="javascript:void(0)" @click=${foo} />`',
      options: [{ aspects: ['preferButton'] }],
      errors: [{ messageId: 'preferButtonErrorMessage' }],
    },
    {
      code: 'html`<a href="javascript:void(0)" @click=${foo} />`',
      options: [{ aspects: ['noHref', 'preferButton'] }],
      errors: [{ messageId: 'preferButtonErrorMessage' }],
    },
    {
      code: 'html`<a href="javascript:void(0)" @click=${foo} />`',
      options: [{ aspects: ['preferButton', 'invalidHref'] }],
      errors: [{ messageId: 'preferButtonErrorMessage' }],
    },
    {
      code: 'html`<a href="javascript:void(0)" @click=${foo} />`',
      options: [{ aspects: ['invalidHref'] }],
      errors: [{ messageId: 'invalidHrefErrorMessage' }],
    },
    {
      code: 'html`<a href="javascript:void(0)" @click=${foo} />`',
      options: [{ aspects: ['noHref', 'invalidHref'] }],
      errors: [{ messageId: 'invalidHrefErrorMessage' }],
    },
  ],
});
