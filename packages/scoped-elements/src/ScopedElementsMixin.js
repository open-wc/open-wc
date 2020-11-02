/* eslint-disable no-use-before-define */
import { TemplateResult } from 'lit-html';
import { dedupeMixin } from '@open-wc/dedupe-mixin';
import { Cache } from './Cache.js';
import { transform } from './transform.js';
import { defineScopedElement, registerElement } from './registerElement.js';
import { shadyTemplateFactory } from './shadyTemplateFactory.js';

/**
 * @typedef {import('./types').ScopedElementsMixin} ScopedElementsMixin
 * @typedef {import('./types').ScopedElementsMap} ScopedElementsMap
 * @typedef {import("lit-element").LitElement} LitElement
 * @typedef {import('lit-html/lib/shady-render').ShadyRenderOptions} ShadyRenderOptions
 * @typedef {function(TemplateResult, Element|DocumentFragment|ShadowRoot, ShadyRenderOptions): void} RenderFunction
 */

/**
 * Template caches
 *
 * @type {WeakMap<Function, Cache<TemplateStringsArray, TemplateStringsArray>>}
 */
const templateCaches = new WeakMap();

/**
 * Retrieves or creates a templateCache for a specific key
 *
 * @param {Function} key
 * @returns {Cache<TemplateStringsArray, TemplateStringsArray>}
 */
const getTemplateCache = key => {
  if (!templateCaches.has(key)) {
    // @ts-ignore
    templateCaches.set(key, new Cache(templateCaches.get(key.constructor)));
  }

  return templateCaches.get(key);
};

/**
 * Tags caches
 *
 * @type {WeakMap<object, Cache<string, string>>}
 */
const tagsCaches = new WeakMap();

/**
 * Retrieves or creates a tagsCache for a specific key
 * @param {object} key
 * @returns {Cache<string, string>}
 */
const getTagsCache = key => {
  if (!tagsCaches.has(key)) {
    tagsCaches.set(key, new Cache(tagsCaches.get(key.constructor)));
  }

  return tagsCaches.get(key);
};

/**
 * Transforms an array of TemplateResults or arrays into another one with resolved scoped elements
 *
 * @param {ReadonlyArray} items
 * @param {ScopedElementsMap} scopedElements
 * @param {Cache<TemplateStringsArray, TemplateStringsArray>} templateCache
 * @param {Cache<string, string>} tagsCache
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
 * @param {ScopedElementsMap} scopedElements
 * @param {Cache<TemplateStringsArray, TemplateStringsArray>} templateCache
 * @param {Cache<string, string>} tagsCache
 * @returns {TemplateResult}
 */
const transformTemplate = (template, scopedElements, templateCache, tagsCache) =>
  new TemplateResult(
    transform(template.strings, scopedElements, templateCache, tagsCache),
    transformArray(template.values, scopedElements, templateCache, tagsCache),
    template.type,
    template.processor,
  );

/**
 * Gets an instance of the ScopedElementsTemplateFactory
 *
 * @param {string} scopeName
 * @param {ScopedElementsMap} scopedElements
 * @param {Cache<TemplateStringsArray, TemplateStringsArray>} templateCache
 * @param {Cache<string, string>} tagsCache
 * @returns {function(any): any}
 */
const scopedElementsTemplateFactory = (
  scopeName,
  scopedElements,
  templateCache,
  tagsCache,
) => template => {
  const newTemplate = transformTemplate(template, scopedElements, templateCache, tagsCache);

  return shadyTemplateFactory(scopeName)(newTemplate);
};

/** @type {ScopedElementsMixin} */
const ScopedElementsMixinImplementation = superclass =>
  class ScopedElementsHost extends superclass {
    /**
     * Obtains the scoped elements definitions map
     *
     * @returns {ScopedElementsMap}
     */
    static get scopedElements() {
      return {};
    }

    /** @override */
    static render(template, container, options) {
      if (!options || typeof options !== 'object' || !options.scopeName) {
        throw new Error('The `scopeName` option is required.');
      }
      const { scopeName, eventContext } = options;

      const templateCache = getTemplateCache(eventContext);
      const tagsCache = getTagsCache(eventContext);
      const { scopedElements } = this;

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
      return defineScopedElement(tagName, klass, getTagsCache(this));
    }

    /**
     * Returns a scoped tag name
     *
     * @deprecated Please, use the instance method instead of the static one. This static method is not able to
     * obtain the tagName of lazy defined elements, while the instance one is.
     * @param {string} tagName
     * @returns {string|undefined}
     */
    static getScopedTagName(tagName) {
      // @ts-ignore
      const klass = this.scopedElements[tagName];

      return klass
        ? registerElement(tagName, klass, getTagsCache(this))
        : getTagsCache(this).get(tagName);
    }

    /**
     * Returns a scoped tag name
     *
     * @param {string} tagName
     * @returns {string|undefined}
     */
    getScopedTagName(tagName) {
      // @ts-ignore
      const klass = this.constructor.scopedElements[tagName];

      return klass
        ? registerElement(tagName, klass, getTagsCache(this))
        : getTagsCache(this).get(tagName);
    }
  };

export const ScopedElementsMixin = dedupeMixin(ScopedElementsMixinImplementation);
