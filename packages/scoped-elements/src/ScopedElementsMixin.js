/* eslint-disable no-use-before-define */
import { TemplateResult } from 'lit-element';
import { dedupeMixin } from '@open-wc/dedupe-mixin';
import { transform } from './transform.js';
import { defineScopedElement } from './registerElement.js';
import { getFromGlobalTagsCache } from './globalTagsCache.js';

/**
 * @typedef {import('lit-html/lib/shady-render').ShadyRenderOptions} ShadyRenderOptions
 * @typedef {function(TemplateResult, Element|DocumentFragment|ShadowRoot, ShadyRenderOptions): void} RenderFunction
 */

/**
 * Template caches
 *
 * @type {WeakMap<Function, Map<TemplateStringsArray, TemplateStringsArray>>}
 */
const templateCaches = new WeakMap();

/**
 * Tags caches
 *
 * @type {WeakMap<object, Map<string, string>>}
 */
const tagsCaches = new WeakMap();

/**
 * Transforms an array of TemplateResults or arrays into another one with resolved scoped elements
 *
 * @param {ReadonlyArray} items
 * @param {Object.<string, typeof HTMLElement>} scopedElements
 * @param {Map<TemplateStringsArray, TemplateStringsArray>} cache
 * @param {Map<string, string>} tagsCache
 * @returns {ReadonlyArray}
 */
const transformArray = (items, scopedElements, cache, tagsCache) =>
  items.map(value => {
    if (value instanceof TemplateResult) {
      return transformTemplate(value, scopedElements, cache, tagsCache);
    }

    if (Array.isArray(value)) {
      return transformArray(value, scopedElements, cache, tagsCache);
    }

    return value;
  });

/**
 * Transforms a TemplateResult into another one with resolved scoped elements
 *
 * @param {TemplateResult} template
 * @param {Object.<string, typeof HTMLElement>} scopedElements
 * @param {Map<TemplateStringsArray, TemplateStringsArray>} templateCache
 * @param {Map<string, string>} tagsCache
 * @returns {TemplateResult}
 */
const transformTemplate = (template, scopedElements, templateCache, tagsCache) =>
  new TemplateResult(
    transform(template.strings, scopedElements, templateCache, tagsCache),
    transformArray(template.values, scopedElements, templateCache, tagsCache),
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

      /**
       * @override
       */
      static render(template, container, options) {
        if (!templateCaches.has(this)) {
          templateCaches.set(this, new Map());
        }
        if (!tagsCaches.has(this)) {
          tagsCaches.set(this, new Map());
        }

        const templateCache = templateCaches.get(this);
        const tagsCache = tagsCaches.get(this);
        const { scopedElements } = this;
        const transformedTemplate = transformTemplate(
          template,
          scopedElements,
          templateCache,
          tagsCache,
        );

        // @ts-ignore
        return super.render(transformedTemplate, container, options);
      }

      /**
       * Defines a scoped element
       *
       * @param {string} tagName
       * @param {typeof HTMLElement} klass
       */
      defineScopedElement(tagName, klass) {
        return defineScopedElement(tagName, klass, tagsCaches.get(this.constructor));
      }

      /**
       * Returns a scoped tag name
       *
       * @param {string} tagName
       * @returns {string|undefined}
       */
      static getScopedTagName(tagName) {
        const klass = this.scopedElements[tagName];

        return klass ? getFromGlobalTagsCache(klass) : tagsCaches.get(this).get(tagName);
      }
    },
);
