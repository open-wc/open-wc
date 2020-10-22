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

const defaultLitHtmlSourcesRuleTester = new RuleTester({
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2015,
  },
});

defaultLitHtmlSourcesRuleTester.run('lit-html-imsdasdasdports', rule, {
  valid: [
    // CASE: importing named, aliased, and namespaced from bare lit-html specifier
    { code: "import {html} from 'lit-html'; html`<img alt=''/>`" },
    { code: "import {html as h} from 'lit-html'; h`<img alt=''/>`" },
    { code: "import * as Lit from 'lit-html'; Lit.html`<img alt=''/>`" },

    // CASE: importing named, aliased, and namespaced from qualified lit-html specifier
    { code: "import {html} from 'lit-html/lit-html.js'; html`<img alt=''/>`" },
    { code: "import {html as h} from 'lit-html/lit-html.js'; h`<img alt=''/>`" },
    { code: "import * as Lit from 'lit-html/lit-html.js'; Lit.html`<img alt=''/>`" },

    // CASE: importing named, aliased, and namespaced from bare lit-element specifier
    { code: "import {html} from 'lit-element'; html`<img alt=''/>`" },
    { code: "import {html as h} from 'lit-element'; h`<img alt=''/>`" },
    { code: "import * as Lit from 'lit-element'; Lit.html`<img alt=''/>`" },

    // invalid if it was lit-html, but no error because default export html is not a valid lithtmlsource
    { code: "import html from 'lit-html'; html`<img alt=''/>`" },

    // invalid if it was lit-html, but `html` is not imported
    { code: "import {html as h} from 'lit-html'; html`<img alt=''/>`" },

    // invalid if it was lit-html, but `html` is not imported
    { code: "import {html as h} from 'lit-element'; html`<img alt=''/>`" },

    // invalid if it was lit-html, but no error because default export html is not a valid lithtmlsource
    { code: "import html from 'foo'; html`<img alt=''/>`" },

    // invalid if it was lit-html, but `html` is not imported
    { code: "import {html as h} from 'foo'; h`<img alt=''/>`" },

    {
      code: `
        import bar from 'lit-html';
        import {html} from 'lit-html';
        import * as foo from 'bar';
        import {baz} from 'baz';
        html\`<img alt=''/>\`
      `,
    },
  ],

  invalid: [
    { code: "import {html} from 'foo'; html`<img/>`", errors: [{ messageId: 'imgAttrs' }] },
    { code: "import {html as h} from 'lit-html'; h`<img/>`", errors: [{ messageId: 'imgAttrs' }] },
    {
      code: "import * as Lit from 'lit-html'; Lit.html`<img/>`",
      errors: [{ messageId: 'imgAttrs' }],
    },

    {
      code: "import {html} from 'lit-html/lit-html.js'; html`<img/>`",
      errors: [{ messageId: 'imgAttrs' }],
    },
    {
      code: "import {html as h} from 'lit-html/lit-html.js'; h`<img/>`",
      errors: [{ messageId: 'imgAttrs' }],
    },
    {
      code: "import * as Lit from 'lit-html/lit-html.js'; Lit.html`<img/>`",
      errors: [{ messageId: 'imgAttrs' }],
    },

    { code: "import {html} from 'lit-element'; html`<img/>`", errors: [{ messageId: 'imgAttrs' }] },
    {
      code: "import {html as h} from 'lit-element'; h`<img/>`",
      errors: [{ messageId: 'imgAttrs' }],
    },
    {
      code: "import * as Lit from 'lit-element'; Lit.html`<img/>`",
      errors: [{ messageId: 'imgAttrs' }],
    },
  ],
});

const userLitHtmlSourcesRuleTester = new RuleTester({
  settings: { litHtmlSources: ['foo', '@bar/baz'] },
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2015,
  },
});

userLitHtmlSourcesRuleTester.run('lit-html-imports', rule, {
  valid: [
    // CASE: importing named, aliased, and namespaced from bare lit-html specifier
    { code: "import {html} from 'lit-html'; html`<img alt=''/>`" },
    { code: "import {html as h} from 'lit-html'; h`<img alt=''/>`" },
    { code: "import * as Lit from 'lit-html'; Lit.html`<img alt=''/>`" },

    // CASE: importing named, aliased, and namespaced from qualified lit-html specifier
    { code: "import {html} from 'lit-html/lit-html.js'; html`<img alt=''/>`" },
    { code: "import {html as h} from 'lit-html/lit-html.js'; h`<img alt=''/>`" },
    { code: "import * as Lit from 'lit-html/lit-html.js'; Lit.html`<img alt=''/>`" },

    // CASE: importing named, aliased, and namespaced from bare user specifier
    { code: "import {html} from 'foo'; html`<img alt=''/>`" },
    { code: "import {html as h} from 'foo'; h`<img alt=''/>`" },
    { code: "import * as Lit from 'foo'; Lit.html`<img alt=''/>`" },

    // CASE: importing named, aliased, and namespaced from qualified user specifier
    { code: "import {html} from 'foo/foo.js'; html`<img alt=''/>`" },
    { code: "import {html as h} from 'foo/foo.js'; h`<img alt=''/>`" },
    { code: "import * as Lit from 'foo/foo.js'; Lit.html`<img alt=''/>`" },

    // CASE: importing named, aliased, and namespaced from bare user specifier
    { code: "import {html} from '@bar/baz'; html`<img alt=''/>`" },
    { code: "import {html as h} from '@bar/baz'; h`<img alt=''/>`" },
    { code: "import * as Lit from '@bar/baz'; Lit.html`<img alt=''/>`" },

    // CASE: importing named, aliased, and namespaced from qualified user specifier
    { code: "import {html} from '@bar/baz/foo.js'; html`<img alt=''/>`" },
    { code: "import {html as h} from '@bar/baz/foo.js'; h`<img alt=''/>`" },
    { code: "import * as Lit from '@bar/baz/foo.js'; Lit.html`<img alt=''/>`" },

    // invalid if it was lit-html, but no error because `bar` is not a valid lithtmlsource
    { code: "import {html} from 'bar'; html`<img alt=''/>`" },

    // invalid, but no error because default export html is not a valid lithtmlsource
    { code: "import html from 'foo'; html`<img/>`" },

    // invalid if it was lit-html, but `html` is not imported
    { code: "import {html as h} from 'lit-html'; html`<img/>`" },

    // invalid if it was lit-html, but `html` is not imported
    { code: "import {html as h} from 'lit-element'; html`<img/>`" },

    {
      code: `
        import bar from 'lit-html';
        import {html} from 'lit-html';
        import * as foo from 'bar';
        import {baz} from 'baz';
        html\`<img alt=''/>\`
      `,
    },
  ],
  invalid: [
    { code: "import {html} from 'lit-html'; html`<img/>`", errors: [{ messageId: 'imgAttrs' }] },
    { code: "import {html as h} from 'lit-html'; h`<img/>`", errors: [{ messageId: 'imgAttrs' }] },
    {
      code: "import * as Lit from 'lit-html'; Lit.html`<img/>`",
      errors: [{ messageId: 'imgAttrs' }],
    },

    {
      code: "import {html} from 'lit-html/lit-html.js'; html`<img/>`",
      errors: [{ messageId: 'imgAttrs' }],
    },
    {
      code: "import {html as h} from 'lit-html/lit-html.js'; h`<img/>`",
      errors: [{ messageId: 'imgAttrs' }],
    },
    {
      code: "import * as Lit from 'lit-html/lit-html.js'; Lit.html`<img/>`",
      errors: [{ messageId: 'imgAttrs' }],
    },

    { code: "import {html} from 'lit-element'; html`<img/>`", errors: [{ messageId: 'imgAttrs' }] },
    {
      code: "import {html as h} from 'lit-element'; h`<img/>`",
      errors: [{ messageId: 'imgAttrs' }],
    },
    {
      code: "import * as Lit from 'lit-element'; Lit.html`<img/>`",
      errors: [{ messageId: 'imgAttrs' }],
    },

    { code: "import {html} from 'foo'; html`<img/>`", errors: [{ messageId: 'imgAttrs' }] },
    { code: "import {html as h} from 'foo'; h`<img/>`", errors: [{ messageId: 'imgAttrs' }] },
    { code: "import * as Lit from 'foo'; Lit.html`<img/>`", errors: [{ messageId: 'imgAttrs' }] },

    { code: "import {html} from 'foo/foo.js'; html`<img/>`", errors: [{ messageId: 'imgAttrs' }] },
    {
      code: "import {html as h} from 'foo/foo.js'; h`<img/>`",
      errors: [{ messageId: 'imgAttrs' }],
    },
    {
      code: "import * as Lit from 'foo/foo.js'; Lit.html`<img/>`",
      errors: [{ messageId: 'imgAttrs' }],
    },

    { code: "import {html} from '@bar/baz'; html`<img/>`", errors: [{ messageId: 'imgAttrs' }] },
    { code: "import {html as h} from '@bar/baz'; h`<img/>`", errors: [{ messageId: 'imgAttrs' }] },
    {
      code: "import * as Lit from '@bar/baz'; Lit.html`<img/>`",
      errors: [{ messageId: 'imgAttrs' }],
    },

    {
      code: "import {html} from '@bar/baz/foo.js'; html`<img/>`",
      errors: [{ messageId: 'imgAttrs' }],
    },
    {
      code: "import {html as h} from '@bar/baz/foo.js'; h`<img/>`",
      errors: [{ messageId: 'imgAttrs' }],
    },
    {
      code: "import * as Lit from '@bar/baz/foo.js'; Lit.html`<img/>`",
      errors: [{ messageId: 'imgAttrs' }],
    },
  ],
});

const litHtmlSourcesTrue = new RuleTester({
  settings: { litHtmlSources: true },
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2015,
  },
});

litHtmlSourcesTrue.run('lit-html-imports', rule, {
  valid: [
    // CASE: importing named, aliased, and namespaced from bare lit-html specifier
    { code: "import {html} from 'lit-html'; html`<img alt=''/>`" },
    // not reported because foo is not a valid lit-html source
    { code: "import {html} from 'foo'; html`<img/>`" },
    { code: "import {html} from 'bar'; html`<img/>`" },
  ],
  invalid: [],
});
