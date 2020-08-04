/**
 * @fileoverview Enforce explicit role property is not the same as implicit/default role property on element.
 * @author open-wc
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const { RuleTester } = require('eslint');
const rule = require('../../../lib/rules/no-redundant-role');

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2015,
  },
});
ruleTester.run('no-redundant-role', rule, {
  valid: [{ code: 'html`<button></button>`' }],

  invalid: [
    {
      code: "html`<button role='button'></button>`",
      errors: [
        {
          message:
            'Enforce explicit role property is not the same as implicit/default role property on element',
        },
      ],
    },
    {
      code: "html`<a href='foo' role='link'></a>`",
      errors: [
        {
          message:
            'Enforce explicit role property is not the same as implicit/default role property on element',
        },
      ],
    },
    {
      code: "html`<area href='foo' role='link'></area>`",
      errors: [
        {
          message:
            'Enforce explicit role property is not the same as implicit/default role property on element',
        },
      ],
    },
    {
      code: "html`<article role='article'></article>`",
      errors: [
        {
          message:
            'Enforce explicit role property is not the same as implicit/default role property on element',
        },
      ],
    },
    {
      code: "html`<aside role='complementary'></aside>`",
      errors: [
        {
          message:
            'Enforce explicit role property is not the same as implicit/default role property on element',
        },
      ],
    },
    {
      code: "html`<datalist role='listbox'></datalist>`",
      errors: [
        {
          message:
            'Enforce explicit role property is not the same as implicit/default role property on element',
        },
      ],
    },
    {
      code: "html`<details role='group'></details>`",
      errors: [
        {
          message:
            'Enforce explicit role property is not the same as implicit/default role property on element',
        },
      ],
    },
    {
      code: "html`<dialog role='dialog'></dialog>`",
      errors: [
        {
          message:
            'Enforce explicit role property is not the same as implicit/default role property on element',
        },
      ],
    },
    {
      code: "html`<dl role='list'></dl>`",
      errors: [
        {
          message:
            'Enforce explicit role property is not the same as implicit/default role property on element',
        },
      ],
    },
    {
      code: "html`<h1 role='heading'></h1>`",
      errors: [
        {
          message:
            'Enforce explicit role property is not the same as implicit/default role property on element',
        },
      ],
    },
    {
      code: "html`<hr role='separator'></hr>`",
      errors: [
        {
          message:
            'Enforce explicit role property is not the same as implicit/default role property on element',
        },
      ],
    },
    {
      code: "html`<img alt='foo' role='img'></img>`",
      errors: [
        {
          message:
            'Enforce explicit role property is not the same as implicit/default role property on element',
        },
      ],
    },
    {
      code: "html`<img role='img'></img>`",
      errors: [
        {
          message:
            'Enforce explicit role property is not the same as implicit/default role property on element',
        },
      ],
    },
  ],
});
