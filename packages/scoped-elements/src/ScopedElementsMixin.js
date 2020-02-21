/* eslint-disable no-use-before-define */
import { TemplateResult } from 'lit-element';
import { dedupeMixin } from '@open-wc/dedupe-mixin';
import { transform } from './transform.js';

/**
 * @typedef {import('lit-html/lib/shady-render').ShadyRenderOptions} ShadyRenderOptions
 * @typedef {function(TemplateResult, Element|DocumentFragment|ShadowRoot, ShadyRenderOptions): void} RenderFunction
 */

/**
 * Template cache
 *
 * @type {WeakMap<Function, Map<TemplateStringsArray, TemplateStringsArray>>}
 */
const templateCaches = new WeakMap();

/**
 * Transforms an array of TemplateResults or arrays into another one with resolved scoped elements
 *
 * @param {ReadonlyArray} items
 * @param {Object.<string, typeof HTMLElement>} scopedElements
 * @param {Map<TemplateStringsArray, TemplateStringsArray>} cache
 * @returns {ReadonlyArray}
 */
const transformArray = (items, scopedElements, cache) =>
  items.map(value => {
    if (value instanceof TemplateResult) {
      return transformTemplate(value, scopedElements, cache);
    }

    if (Array.isArray(value)) {
      return transformArray(value, scopedElements, cache);
    }

    return value;
  });

/**
 * Transforms a TemplateResult into another one with resolved scoped elements
 *
 * @param {TemplateResult} template
 * @param {Object.<string, typeof HTMLElement>} scopedElements
 * @param {Map<TemplateStringsArray, TemplateStringsArray>} cache
 * @returns {TemplateResult}
 */
const transformTemplate = (template, scopedElements, cache) =>
  new TemplateResult(
    transform(template.strings, scopedElements, cache),
    transformArray(template.values, scopedElements, cache),
    template.type,
    template.processor,
  );

export const ScopedElementsMixin = dedupeMixin(
  superclass =>
    // eslint-disable-next-line no-shadow
    class ScopedElementsMixin extends superclass {
      static get scopedElements() {
        return {};
      }

      static render(template, container, options) {
        let templateCache = templateCaches.get(this);
        if (!templateCache) {
          templateCache = new Map();
          templateCaches.set(this, templateCache);
        }
        const { scopedElements } = this;
        const transformedTemplate = transformTemplate(template, scopedElements, templateCache);

        // @ts-ignore
        return super.render(transformedTemplate, container, options);
      }
    },
);
