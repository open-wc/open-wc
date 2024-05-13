import { ScopedElementsMixin } from '@open-wc/scoped-elements/html-element.js';
import { LitElement } from 'lit';

/** @typedef {import('@open-wc/scoped-elements/html-element.js').ScopedElementsMap} ScopedElementsMap */
/** @typedef {import('lit/html.js').TemplateResult} TemplateResult */

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

  constructor(scopedElement, template) {
    super();

    /** @type {ScopedElementsMap} */
    this.scopedElements = scopedElement;

    /** @type {import('./renderable.js').LitHTMLRenderable} */
    this.template = template;
  }

  firstUpdated(_changed) {
    super.firstUpdated(_changed);

    Object.keys(this.scopedElements).forEach(key =>
      // @ts-ignore
      this.registry.define(key, this.scopedElements[key]),
    );
  }

  render() {
    return this.template;
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

/**
 * Wraps the template inside a scopedElements component
 *
 * @param {import('./renderable.js').LitHTMLRenderable} template
 * @param {ScopedElementsMap} scopedElements
 * @return {HTMLElement}
 */
export function getScopedElementsTemplate(template, scopedElements) {
  const wrapperTagName = getWrapperUniqueName();
  class Scope extends ScopedElementsTestWrapper {}

  // @ts-ignore
  customElements.define(wrapperTagName, Scope);

  /** @type {ScopedElementsTestWrapper} */
  const scope = new Scope(scopedElements, template);

  return scope;
}

/** @typedef {typeof getScopedElementsTemplate} ScopedElementsTemplateGetter */
