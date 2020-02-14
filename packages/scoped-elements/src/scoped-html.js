/* eslint-disable prefer-spread */
import { html } from 'lit-html';
import { transform } from './transform.js';
import { registerElement } from './scoped-elements.js';

/** @typedef {import('lit-html').TemplateResult} TemplateResult */

/**
 * Creates an elements scope.
 * @param tags Map with tag names and element classes to be scoped.
 * @returns {{html(strings: TemplateStringsArray, ...values: unknown[]): TemplateResult, createElement(tagName: string, options?: ElementCreationOptions): Element}}
 */
export const createScope = tags => ({
  // eslint-disable-next-line func-names
  html() {
    // eslint-disable-next-line prefer-rest-params
    const args = Array.apply(null, arguments);
    const strings = args[0];
    const values = args.slice(1);

    return html.apply(null, [].concat([transform(strings, tags)], values));
  },
  createElement(tagName, options) {
    const klass = tags[tagName];

    if (klass) {
      return document.createElement(registerElement(tagName, klass), options);
    }

    return document.createElement(tagName, options);
  },
});

/**
 * @deprecated Use createScope instead
 */
export const createScopedHtml = tags => {
  const { html: scopedHtml } = createScope(tags);

  return scopedHtml;
};
