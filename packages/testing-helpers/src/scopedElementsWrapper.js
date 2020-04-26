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
    // eslint-disable-next-line babel/no-unused-expressions
    this.template;
  }

  firstUpdated(_changed) {
    super.firstUpdated(_changed);

    Object.keys(this.scopedElements).forEach(key =>
      this.defineScopedElement(key, this.scopedElements[key]),
    );
  }

  render() {
    return transform(this.template);
  }
}

customElements.define('scoped-elements-test-wrapper', ScopedElementsTestWrapper);

/**
 * Wraps the template inside a scopedElements component
 *
 * @param {import('./litFixture').LitHTMLRenderable} template
 * @param {ScopedElementsMap} scopedElements
 * @returns {TemplateResult}
 */
export function getScopedElementsTemplate(template, scopedElements) {
  return html`
    <scoped-elements-test-wrapper
      .scopedElements="${scopedElements}"
      .template="${template}"
    ></scoped-elements-test-wrapper>
  `;
}
