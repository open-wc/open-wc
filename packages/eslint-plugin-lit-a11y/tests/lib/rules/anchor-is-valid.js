/**
 * @fileoverview anchor-is-valid
 * @author open-wc
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const { RuleTester } = require('eslint');
const rule = require('../../../lib/rules/anchor-is-valid.js');
const { prependLitHtmlImport } = require('../../../lib/utils/utils.js');

const preferButtonErrorMessage =
  'Anchor used as a button. Anchors are primarily expected to navigate. Use the button element instead. Learn more: https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/anchor-is-valid.md';

const noHrefErrorMessage =
  'The href attribute is required for an anchor to be keyboard accessible. Provide a valid, navigable address as the href value. If you cannot provide an href, but still need the element to resemble a link, use a button and change it with appropriate styles. Learn more: https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/anchor-is-valid.md';

const invalidHrefErrorMessage =
  'The href attribute requires a valid value to be accessible. Provide a valid, navigable address as the href value. If you cannot provide a valid href, but still need the element to resemble a link, use a button and change it with appropriate styles. Learn more: https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/anchor-is-valid.md';

const preferButtonexpectedError = {
  message: preferButtonErrorMessage,
};

const noHrefexpectedError = {
  message: noHrefErrorMessage,
};

const invalidHrefexpectedError = {
  message: invalidHrefErrorMessage,
};

const noHrefAspect = [
  {
    aspects: ['noHref'],
  },
];
const invalidHrefAspect = [
  {
    aspects: ['invalidHref'],
  },
];
const preferButtonAspect = [
  {
    aspects: ['preferButton'],
  },
];
const noHrefInvalidHrefAspect = [
  {
    aspects: ['noHref', 'invalidHref'],
  },
];
const noHrefPreferButtonAspect = [
  {
    aspects: ['noHref', 'preferButton'],
  },
];
const preferButtonInvalidHrefAspect = [
  {
    aspects: ['preferButton', 'invalidHref'],
  },
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

    { code: 'html`<a href="" />;`', options: preferButtonAspect },
    { code: 'html`<a href="#" />`', options: preferButtonAspect },
    { code: 'html`<a href=${"#"} />`', options: preferButtonAspect },
    { code: 'html`<a href="javascript:void(0)" />`', options: preferButtonAspect },
    { code: 'html`<a href=${"javascript:void(0)"} />`', options: preferButtonAspect },
    { code: 'html`<a href="" />;`', options: noHrefAspect },
    { code: 'html`<a href="#" />`', options: noHrefAspect },
    { code: 'html`<a href=${"#"} />`', options: noHrefAspect },
    { code: 'html`<a href="javascript:void(0)" />`', options: noHrefAspect },
    { code: 'html`<a href=${"javascript:void(0)"} />`', options: noHrefAspect },
    { code: 'html`<a href="" />;`', options: noHrefPreferButtonAspect },
    { code: 'html`<a href="#" />`', options: noHrefPreferButtonAspect },
    { code: 'html`<a href=${"#"} />`', options: noHrefPreferButtonAspect },
    { code: 'html`<a href="javascript:void(0)" />`', options: noHrefPreferButtonAspect },
    { code: 'html`<a href=${"javascript:void(0)"} />`', options: noHrefPreferButtonAspect },

    { code: 'html`<a @click=${foo} />`', options: invalidHrefAspect },
    { code: 'html`<a href="#" @click=${foo} />`', options: noHrefAspect },
    { code: 'html`<a href="javascript:void(0)" @click=${foo} />`', options: noHrefAspect },
    {
      code: 'html`<a href=${"javascript:void(0)"} @click=${foo} />`',
      options: noHrefAspect,
    },
  ].map(prependLitHtmlImport),

  invalid: [
    { code: 'html`<a />`', errors: [noHrefexpectedError] },
    // INVALID HREF
    { code: 'html`<a href="" />;`', errors: [invalidHrefexpectedError] },
    { code: 'html`<a href="#" />`', errors: [invalidHrefErrorMessage] },
    { code: 'html`<a href="javascript:void(0)" />`', errors: [invalidHrefexpectedError] },
    // SHOULD BE BUTTON
    { code: 'html`<a @click=${foo} />`', errors: [preferButtonexpectedError] },
    { code: 'html`<a href="#" @click=${foo} />`', errors: [preferButtonexpectedError] },
    {
      code: 'html`<a href="javascript:void(0)" @click=${foo} />`',
      errors: [preferButtonexpectedError],
    },

    // WITH ASPECTS TESTS
    // NO HREF
    { code: 'html`<a />`', options: noHrefAspect, errors: [noHrefErrorMessage] },
    { code: 'html`<a />`', options: noHrefPreferButtonAspect, errors: [noHrefErrorMessage] },
    { code: 'html`<a />`', options: noHrefInvalidHrefAspect, errors: [noHrefErrorMessage] },

    // INVALID HREF
    { code: 'html`<a href="" />;`', options: invalidHrefAspect, errors: [invalidHrefErrorMessage] },
    {
      code: 'html`<a href="" />;`',
      options: noHrefInvalidHrefAspect,
      errors: [invalidHrefErrorMessage],
    },
    {
      code: 'html`<a href="" />;`',
      options: preferButtonInvalidHrefAspect,
      errors: [invalidHrefErrorMessage],
    },
    {
      code: 'html`<a href="#" />;`',
      options: invalidHrefAspect,
      errors: [invalidHrefErrorMessage],
    },
    {
      code: 'html`<a href="#" />;`',
      options: noHrefInvalidHrefAspect,
      errors: [invalidHrefErrorMessage],
    },
    {
      code: 'html`<a href="#" />;`',
      options: preferButtonInvalidHrefAspect,
      errors: [invalidHrefErrorMessage],
    },
    {
      code: 'html`<a href="javascript:void(0)" />;`',
      options: invalidHrefAspect,
      errors: [invalidHrefErrorMessage],
    },
    {
      code: 'html`<a href="javascript:void(0)" />;`',
      options: noHrefInvalidHrefAspect,
      errors: [invalidHrefErrorMessage],
    },
    {
      code: 'html`<a href="javascript:void(0)" />;`',
      options: preferButtonInvalidHrefAspect,
      errors: [invalidHrefErrorMessage],
    },

    // SHOULD BE BUTTON
    {
      code: 'html`<a @click=${foo} />`',
      options: preferButtonAspect,
      errors: [preferButtonErrorMessage],
    },
    {
      code: 'html`<a @click=${foo} />`',
      options: preferButtonInvalidHrefAspect,
      errors: [preferButtonErrorMessage],
    },
    {
      code: 'html`<a @click=${foo} />`',
      options: noHrefPreferButtonAspect,
      errors: [preferButtonErrorMessage],
    },
    { code: 'html`<a @click=${foo} />`', options: noHrefAspect, errors: [noHrefErrorMessage] },
    {
      code: 'html`<a @click=${foo} />`',
      options: noHrefInvalidHrefAspect,
      errors: [noHrefErrorMessage],
    },
    {
      code: 'html`<a href="#" @click=${foo} />`',
      options: preferButtonAspect,
      errors: [preferButtonErrorMessage],
    },
    {
      code: 'html`<a href="#" @click=${foo} />`',
      options: noHrefPreferButtonAspect,
      errors: [preferButtonErrorMessage],
    },
    {
      code: 'html`<a href="#" @click=${foo} />`',
      options: preferButtonInvalidHrefAspect,
      errors: [preferButtonErrorMessage],
    },
    {
      code: 'html`<a href="#" @click=${foo} />`',
      options: invalidHrefAspect,
      errors: [invalidHrefErrorMessage],
    },
    {
      code: 'html`<a href="#" @click=${foo} />`',
      options: noHrefInvalidHrefAspect,
      errors: [invalidHrefErrorMessage],
    },
    {
      code: 'html`<a href="javascript:void(0)" @click=${foo} />`',
      options: preferButtonAspect,
      errors: [preferButtonErrorMessage],
    },
    {
      code: 'html`<a href="javascript:void(0)" @click=${foo} />`',
      options: noHrefPreferButtonAspect,
      errors: [preferButtonErrorMessage],
    },
    {
      code: 'html`<a href="javascript:void(0)" @click=${foo} />`',
      options: preferButtonInvalidHrefAspect,
      errors: [preferButtonErrorMessage],
    },
    {
      code: 'html`<a href="javascript:void(0)" @click=${foo} />`',
      options: invalidHrefAspect,
      errors: [invalidHrefErrorMessage],
    },
    {
      code: 'html`<a href="javascript:void(0)" @click=${foo} />`',
      options: noHrefInvalidHrefAspect,
      errors: [invalidHrefErrorMessage],
    },
  ].map(prependLitHtmlImport),
});
