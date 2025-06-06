/**
 * @fileoverview &lt;ing-checkbox&gt; requires an array-like syntax
 * @author open-wc
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

import { RuleTester } from 'eslint';
import rule from '../../../lib/rules/aria-role.js';

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

ruleTester.run('aria-role', rule, {
  valid: [
    { code: "html`<div role='alert'></div>`;" },
    { code: "html`<div role='progressbar'></div>`;" },
    { code: "html`<div role='navigation'></div>`;" },
    { code: 'html`<div role="navigation"></div>`;' },
    { code: "html`<div role=${'navigation'}></div>`;" },
    { code: 'html`<div role="${\'navigation\'}"></div>`;' },
    { code: 'html`<div role=\'${"navigation"}\'></div>`;' },
    { code: "html`<div role='${foo}'></div>`;" },
    { code: 'html`<div role=${foo}></div>`;' },
    { code: 'html`<div></div>`;' },
  ],

  invalid: [
    {
      code: "html`<div role='foo'>`;",
      errors: [{ messageId: 'invalidRole', data: { role: 'foo' } }],
    },
    {
      code: 'html`<div role="foo">`;',
      errors: [{ messageId: 'invalidRole', data: { role: 'foo' } }],
    },
    {
      code: 'html`<div role=\'${"foo"}\'>`;',
      errors: [{ messageId: 'invalidRole', data: { role: 'foo' } }],
    },
    {
      code: "html`<div role='${'foo'}'>`;",
      errors: [{ messageId: 'invalidRole', data: { role: 'foo' } }],
    },
    {
      code: 'html`<div role="${\'foo\'}">`;',
      errors: [{ messageId: 'invalidRole', data: { role: 'foo' } }],
    },
    {
      code: 'html`<div role=${"foo"}>`;',
      errors: [{ messageId: 'invalidRole', data: { role: 'foo' } }],
    },
    {
      code: "html`<div role=${'foo'}>`;",
      errors: [{ messageId: 'invalidRole', data: { role: 'foo' } }],
    },
  ],
});
