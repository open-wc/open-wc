/* eslint-disable no-use-before-define */
import { TemplateResult } from 'lit-html';
import { dedupeMixin } from '@open-wc/dedupe-mixin';
import { transform } from './transform.js';
import { defineScopedElement, registerElement } from './registerElement.js';
import { shadyTemplateFactory } from './shadyTemplateFactory.js';

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
 * Retrieves or creates a templateCache for a specific key
 * @param {Function} key
 * @returns {Map<TemplateStringsArray, TemplateStringsArray>}
 */
const getTemplateCache = key => {
  if (!templateCaches.has(key)) {
    templateCaches.set(key, new Map());
  }

  return templateCaches.get(key);
};

/**
 * Tags caches
 *
 * @type {WeakMap<object, Map<string, string>>}
 */
const tagsCaches = new WeakMap();

/**
 * Retrieves or creates a tagsCache for a specific key
 * @param {object} key
 * @returns {Map<string, string>}
 */
const getTagsCache = key => {
  if (!tagsCaches.has(key)) {
    tagsCaches.set(key, new Map());
  }

  return tagsCaches.get(key);
};

/**
 * Transforms an array of TemplateResults or arrays into another one with resolved scoped elements
 *
 * @param {ReadonlyArray} items
 * @param {Object.<string, typeof HTMLElement>} scopedElements
 * @param {Map<TemplateStringsArray, TemplateStringsArray>} templateCache
 * @param {Map<string, string>} tagsCache
 * @returns {ReadonlyArray}
 */
const transformArray = (items, scopedElements, templateCache, tagsCache) =>
  items.map(value => {
    if (value instanceof TemplateResult) {
      return transformTemplate(value, scopedElements, templateCache, tagsCache);
    }

    if (Array.isArray(value)) {
      return transformArray(value, scopedElements, templateCache, tagsCache);
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

const scopedElementsTemplateFactory = (
  scopeName,
  scopedElements,
  templateCache,
  tagsCache,
) => template => {
  const newTemplate = transformTemplate(template, scopedElements, templateCache, tagsCache);

  return shadyTemplateFactory(scopeName)(newTemplate);
};

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
        if (!options || typeof options !== 'object' || !options.scopeName) {
          throw new Error('The `scopeName` option is required.');
        }
        const { scopeName } = options;

        const templateCache = getTemplateCache(this);
        const tagsCache = getTagsCache(this);
        const { scopedElements } = this;

        // @ts-ignore
        return super.render(template, container, {
          ...options,
          templateFactory: scopedElementsTemplateFactory(
            scopeName,
            scopedElements,
            templateCache,
            tagsCache,
          ),
        });
      }

      /**
       * Defines a scoped element
       *
       * @param {string} tagName
       * @param {typeof HTMLElement} klass
       */
      defineScopedElement(tagName, klass) {
        return defineScopedElement(tagName, klass, getTagsCache(this.constructor));
      }

      /**
       * Returns a scoped tag name
       *
       * @param {string} tagName
       * @returns {string|undefined}
       */
      static getScopedTagName(tagName) {
        const klass = this.scopedElements[tagName];

        return klass
          ? registerElement(tagName, klass, getTagsCache(this))
          : getTagsCache(this).get(tagName);
      }
    },
);
