import { ScopedElementsMixin } from '@open-wc/scoped-elements';
import { html, LitElement, TemplateResult } from 'lit-element';
import { isIterable } from './lib.js';

/** @typedef {import('@open-wc/scoped-elements').ScopedElementsMap} ScopedElementsMap */

const transform = template => {
  if (isIterable(template)) {
    return [...template].map(v => transform(v));
  }

  if (template instanceof TemplateResult) {
    return html(template.strings, ...template.values);
  }

  return template;
};

/**
 * Regarding the @ts-expect-error, it is caused by having '& typeof ScopedElementsHost' on ScopedElementsMixin.
 * This type intersection is necessary though, in order to access static props of the mixin. For example:
 *
 * static get scopedElements() {
 *   return {
 *     ...super.scopedElements, // <-- this will error without '& typeof ScopedElementsHost'
 *   }
 * }
 *
 * However, a new type error is created --> Base constructors must all have the same return type.ts(2510)
 * But this can be ignored, and then at least you do get the super static props typed properly.
 */
// @ts-ignore https://github.com/microsoft/TypeScript/issues/40110 , not using expect-error, because in some TS versions it does not throw
class ScopedElementsTestWrapper extends ScopedElementsMixin(LitElement) {
  static get properties() {
    return {
      scopedElements: { type: Object },
      template: { type: Object },
    };
  }

  constructor() {
    super();

    /** @type {ScopedElementsMap} */
    this.scopedElements = {};

    /** @type {import('./litFixture').LitHTMLRenderable} */
    // eslint-disable-next-line no-unused-expressions
    this.template;
  }

  firstUpdated(_changed) {
    super.firstUpdated(_changed);

    Object.keys(this.scopedElements).forEach(key =>
      // @ts-ignore
      this.defineScopedElement(key, this.scopedElements[key]),
    );
  }

  render() {
    return transform(this.template);
  }
}

/**
 * Obtains a unique tag name for the test wrapper
 * @param {number} [counter=0]
 * @returns {string}
 */
const getWrapperUniqueName = (counter = 0) => {
  const tag = `scoped-elements-test-wrapper-${counter}`;

  if (customElements.get(tag) !== undefined) {
    return getWrapperUniqueName(counter + 1);
  }

  return tag;
};

const wrapperTagName = getWrapperUniqueName();

// @ts-ignore
customElements.define(wrapperTagName, ScopedElementsTestWrapper);

/**
 * Wraps the template inside a scopedElements component
 *
 * @param {import('./litFixture').LitHTMLRenderable} template
 * @param {ScopedElementsMap} scopedElements
 * @returns {TemplateResult}
 */
export function getScopedElementsTemplate(template, scopedElements) {
  const strings = [
    `<${wrapperTagName} .scopedElements="`,
    '" .template="',
    `"></${wrapperTagName}>`,
  ];

  // @ts-ignore
  return html(strings, scopedElements, template);
}
