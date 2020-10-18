/**
 * @fileoverview Images require alt text
 * @author open-wc
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const { RuleTester } = require('eslint');
const rule = require('../../../lib/rules/alt-text');

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2015,
  },
});
ruleTester.run('lit-html-imports', rule, {
  valid: [
    {
      code: "import {html} from 'ing-web'; html`<img alt=''/>`",
      settings: { litHtmlSources: ['ing-web'] },
    },
    {
      code: `
        import bar from 'foo';
        import * as foo from 'bar';
        import {baz} from 'baz';
        import {html} from 'ing-web';
        html\`<img alt=''/>\`
      `,
      settings: { litHtmlSources: ['ing-web'] },
    },
    {
      code: "import {html} from 'lit-html'; html`<img alt=''/>`",
      settings: { litHtmlSources: ['ing-web'] },
    },
    {
      code: "import {html} from 'lit-element'; html`<img alt=''/>`",
      settings: { litHtmlSources: ['ing-web'] },
    },
    { code: "import {html} from 'foo'; html`<img/>`", settings: { litHtmlSources: ['ing-web'] } }, // invalid, but no error because `foo` is not a valid lithtmlsource
    { code: "import html from 'foo'; html`<img/>`", settings: { litHtmlSources: ['ing-web'] } }, // invalid, but no error because default export html is not a valid lithtmlsource
  ],
  invalid: [],
});
