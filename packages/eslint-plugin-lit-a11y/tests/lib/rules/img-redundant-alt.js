/**
 * @fileoverview Enforce img alt attribute does not contain the word image, picture, or photo.
 * @author open-wc
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const { RuleTester } = require('eslint');
const rule = require('../../../lib/rules/img-redundant-alt');
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
ruleTester.run('img-redundant-alt', rule, {
  valid: [
    { code: 'html`<img src="foo" alt="Foo eating a sandwich." />`' },
    {
      code: 'html`<img src="bar" aria-hidden alt="Picture of me taking a photo of an image" /> `',
    },
    {
      code: 'html`<img src="baz" alt=${`Baz taking a ${photo}`} />`',
    },
    {
      code: 'html`<img src="baz" alt=${"foo"} />`',
    },
    // give me some code that won't trigger a warning
  ].map(prependLitHtmlImport),

  invalid: [
    {
      code: "html`<img src='foo' alt='Photo of foo being weird.' />`",
      errors: [
        {
          message:
            '<img> alt attribute must be descriptive; it cannot contain the banned word photo.',
        },
      ],
    },
    {
      code: 'html`<img src="baz" alt=${"photo of dog"} />`',
      errors: [
        {
          message:
            '<img> alt attribute must be descriptive; it cannot contain the banned word photo.',
        },
      ],
    },
    {
      code: "html`<img src='foo' alt='Image of me at a bar!' />`",
      errors: [
        {
          message:
            '<img> alt attribute must be descriptive; it cannot contain the banned word image.',
        },
      ],
    },
    {
      code: "html`<img src='foo' alt='Picture of baz fixing a bug.' />`",
      errors: [
        {
          message:
            '<img> alt attribute must be descriptive; it cannot contain the banned word picture.',
        },
      ],
    },
    {
      code: "html`<img src='foo' alt='baz foo bar.' />`",
      options: [{ keywords: ['foo'] }],
      errors: [
        {
          message:
            '<img> alt attribute must be descriptive; it cannot contain the banned word foo.',
        },
      ],
    },
    {
      code: "html`<img src='foo' alt='image of baz foo bar.' />`",
      options: [{ keywords: ['foo'] }],
      errors: [
        {
          message:
            '<img> alt attribute must be descriptive; it cannot contain the banned words image or foo.',
        },
      ],
    },
    {
      code: "html`<img src='foo' alt='image of picture baz foo bar.' />`",
      options: [{ keywords: ['foo'] }],
      errors: [
        {
          message:
            '<img> alt attribute must be descriptive; it cannot contain the banned words image, picture, or foo.',
        },
      ],
    },
  ].map(prependLitHtmlImport),
});
