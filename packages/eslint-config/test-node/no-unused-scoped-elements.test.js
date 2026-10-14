/**
 * @fileoverview Tests for no-unused-scoped-elements.
 * @author open-wc
 */

import { RuleTester } from 'eslint';
import rule from '../rules/no-unused-scoped-elements.js';

const ruleTester = new RuleTester({
  languageOptions: { ecmaVersion: 2024, sourceType: 'module' },
});

const unused = tag => ({ messageId: 'unused', data: { tag } });

/** Expect `tag` reported, with a suggestion whose output is `code` minus `removed`. */
const unusedIn = (code, tag, removed) => {
  if (!code.includes(removed)) throw new Error(`test setup: ${removed} not in code`);
  return {
    ...unused(tag),
    suggestions: [{ messageId: 'remove', data: { tag }, output: code.replace(removed, '') }],
  };
};

const withErrors = (code, ...expected) => ({
  code,
  errors: expected.map(([tag, removed]) => unusedIn(code, tag, removed)),
});

ruleTester.run('no-unused-scoped-elements', rule, {
  valid: [
    // Basic usage
    `class A extends ScopedElementsMixin(LitElement) {
      static scopedElements = { 'my-button': MyButton };
      render() { return html\`<my-button>Click</my-button>\`; }
    }`,

    // Used via a module-level variable referenced in render()
    `const variable = html\`<foo-button></foo-button>\`;
    class A extends ScopedElementsMixin(LitElement) {
      static scopedElements = { 'my-button': MyButton, 'foo-button': FooButton };
      render() { return html\`<my-button>Click</my-button>\${variable}\`; }
    }`,

    // Used in another method of the class
    `class A extends ScopedElementsMixin(LitElement) {
      static scopedElements = { 'my-button': MyButton, 'foo-button': FooButton };
      render() { return html\`<my-button></my-button>\${this.renderThing()}\`; }
      renderThing() { return html\`<foo-button></foo-button>\`; }
    }`,

    // Static getter form, incl. spread of super
    `class A extends ScopedElementsMixin(LitElement) {
      static get scopedElements() {
        return { ...super.scopedElements, 'my-button': MyButton };
      }
      render() { return html\`<my-button></my-button>\`; }
    }`,

    // Used through a module-level helper function, transitively
    `function inner() { return html\`<deep-el></deep-el>\`; }
    function helper() { return html\`<my-button></my-button>\${inner()}\`; }
    class A extends ScopedElementsMixin(LitElement) {
      static scopedElements = { 'my-button': MyButton, 'deep-el': DeepEl };
      render() { return helper(); }
    }`,

    // Imperative creation
    `class A extends ScopedElementsMixin(LitElement) {
      static scopedElements = { 'my-button': MyButton, 'lazy-el': LazyEl };
      render() { return html\`<my-button></my-button>\`; }
      firstUpdated() { this.shadowRoot.createElement('lazy-el'); }
    }`,

    // Template defined in a local superclass's render()
    `class Base extends ScopedElementsMixin(LitElement) {
      render() { return html\`<my-button></my-button>\`; }
    }
    class Child extends Base {
      static scopedElements = { 'my-button': MyButton };
    }`,

    // No templates reachable (render inherited from an import): stay quiet
    `class Child extends ImportedBase {
      static scopedElements = { 'my-button': MyButton };
    }`,

    // Dynamic tag name: can't tell, stay quiet
    `class A extends ScopedElementsMixin(LitElement) {
      static scopedElements = { 'my-button': MyButton, 'foo-button': FooButton };
      render() { return html\`<\${this.tag}></\${this.tag}>\`; }
    }`,

    // Ignore option
    {
      code: `class A extends ScopedElementsMixin(LitElement) {
        static scopedElements = { 'my-button': MyButton, 'foo-button': FooButton };
        render() { return html\`<my-button></my-button>\`; }
      }`,
      options: [{ ignore: ['foo-button'] }],
    },

    // Custom template tag names
    {
      code: `class A extends ScopedElementsMixin(LitElement) {
        static scopedElements = { 'my-button': MyButton };
        render() { return staticHtml\`<my-button></my-button>\`; }
      }`,
      options: [{ templateTags: ['html', 'staticHtml'] }],
    },

    // Classes without scopedElements are ignored
    `class A extends LitElement { render() { return html\`<x-y></x-y>\`; } }`,
  ],

  invalid: [
    // The example from the request
    {
      code: `class MyCard extends ScopedElementsMixin(LitElement) {
  static scopedElements = { 'my-button': MyButton, "foo-button": FooButton };
  render() {
    return html\`<my-button>Click</my-button>\`;
  }
}`,
      errors: [
        {
          ...unused('foo-button'),
          suggestions: [
            {
              messageId: 'remove',
              data: { tag: 'foo-button' },
              output: `class MyCard extends ScopedElementsMixin(LitElement) {
  static scopedElements = { 'my-button': MyButton };
  render() {
    return html\`<my-button>Click</my-button>\`;
  }
}`,
            },
          ],
        },
      ],
    },

    // Outer variable + extra method, but one entry still unused
    withErrors(
      `const variable = html\`<my-button></my-button>\`;
      class MyCard extends ScopedElementsMixin(LitElement) {
        static scopedElements = { 'my-button': MyButton, "foo-button": FooButton };
        render() { return html\`<my-button>Click</my-button>\${variable}\`; }
        renderThing() { return html\`<my-button></my-button>\`; }
      }`,
      ['foo-button', `, "foo-button": FooButton`],
    ),

    // Static getter form
    withErrors(
      `class MyCard extends ScopedElementsMixin(LitElement) {
        static get scopedElements() {
          return { 'my-button': MyButton, 'foo-button': FooButton };
        }
        render() { return html\`<my-button></my-button>\`; }
      }`,
      ['foo-button', `, 'foo-button': FooButton`],
    ),

    // Class expression returned from a function
    {
      code: `function foo() {
  return class Foo extends ScopedElementsMixin(Bar) {
    static scopedElements = {
      'foo-el': FooEl,
      'bar-el': BarEl, // err
    }
    render() {
      return html\`<foo-el></foo-el>\`
    }
  }
}`,
      errors: [
        {
          ...unused('bar-el'),
          line: 5,
          suggestions: [
            {
              messageId: 'remove',
              data: { tag: 'bar-el' },
              output: `function foo() {
  return class Foo extends ScopedElementsMixin(Bar) {
    static scopedElements = {
      'foo-el': FooEl,
      // err
    }
    render() {
      return html\`<foo-el></foo-el>\`
    }
  }
}`,
            },
          ],
        },
      ],
    },

    // Another class in the same file using the tag must not mask it
    withErrors(
      `class Other extends ScopedElementsMixin(LitElement) {
        static scopedElements = { 'bar-el': BarEl };
        render() { return html\`<bar-el></bar-el>\`; }
      }
      class A extends ScopedElementsMixin(LitElement) {
        static scopedElements = { 'foo-el': FooEl, 'bar-el': BarEl };
        render() { return html\`<foo-el></foo-el>\`; }
      }`,
      ['bar-el', `, 'bar-el': BarEl`],
    ),

    // Nested class with its own registry doesn't count towards the outer one
    withErrors(
      `class Outer extends ScopedElementsMixin(LitElement) {
        static scopedElements = { 'foo-el': FooEl, 'inner-only': InnerOnly };
        render() {
          const Inner = class extends ScopedElementsMixin(LitElement) {
            static scopedElements = { 'inner-only': InnerOnly };
            render() { return html\`<inner-only></inner-only>\`; }
          };
          return html\`<foo-el></foo-el>\`;
        }
      }`,
      ['inner-only', `, 'inner-only': InnerOnly`],
    ),

    // A tag mentioned only as text, not as an element, doesn't count
    withErrors(
      `class A extends ScopedElementsMixin(LitElement) {
        static scopedElements = { 'foo-el': FooEl, 'bar-el': BarEl };
        render() { return html\`<foo-el>use bar-el here</foo-el>\`; }
      }`,
      ['bar-el', `, 'bar-el': BarEl`],
    ),

    // Multiple unused entries
    withErrors(
      `class A extends ScopedElementsMixin(LitElement) {
        static scopedElements = { 'a-el': A, 'b-el': B, 'c-el': C };
        render() { return html\`<b-el></b-el>\`; }
      }`,
      ['a-el', `'a-el': A, `],
      ['c-el', `, 'c-el': C`],
    ),
  ],
});
