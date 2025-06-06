/**
 * @fileoverview Images require alt text
 * @author open-wc
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

import { RuleTester } from 'eslint';
import rule from '../../../lib/rules/alt-text.js';

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  settings: { litHtmlSources: false },
  languageOptions: {
    parserOptions: {
      sourceType: 'module',
      ecmaVersion: 2015,
    },
  },
});

const roleImgAttrs = 'aria-label or aria-labelledby';

ruleTester.run('alt-text', rule, {
  valid: [
    { code: "html`<input type='image' alt=''/>`" },
    { code: "html`<input type='image' alt='hello'/>`" },
    { code: "html`<img alt=''/>`" },
    { code: 'html`<img aria-hidden="true"/>`' },
    { code: "html`<img alt='foo'/>`" },
    { code: "html`<img alt='${foo}'/>`" },
    { code: "html`<div role='img' aria-label='foo'></div>`" },
    { code: 'html`<div role=\'img\' aria-hidden="true"></div>`' },
    { code: "html`<label id=\"foo\">foo</label><div role='img' aria-labelledby='foo'></div>`" },
    { code: "html`<img role='presentation'/>`" },
  ],

  invalid: [
    {
      code: "html`<input type='image'/>`",
      errors: [
        {
          messageId: 'imgAttrs',
        },
      ],
    },
    {
      code: "html`<img src='./myimg.png'/>`",
      errors: [
        {
          messageId: 'imgAttrs',
        },
      ],
    },
    {
      code: "html`<div role='img'></div>`",
      errors: [
        {
          messageId: 'roleImgAttrs',
          data: {
            role: 'img',
            attrs: roleImgAttrs,
          },
        },
      ],
    },
    {
      code: "html`<div role='img' alt='foo'></div>`",
      errors: [
        {
          messageId: 'roleImgAttrs',
          data: {
            role: 'img',
            attrs: roleImgAttrs,
          },
        },
      ],
    },
  ],
});
