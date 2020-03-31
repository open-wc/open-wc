import { templateCaches } from 'lit-html/lib/template-factory.js';
import { marker, Template } from 'lit-html/lib/template.js';

const getTemplateCacheKey = (type, scopeName) => `${type}--${scopeName}`;

let compatibleShadyCSSVersion = true;

// @ts-ignore
const { ShadyCSS } = window;

if (typeof ShadyCSS === 'undefined') {
  compatibleShadyCSSVersion = false;
} else if (typeof ShadyCSS.prepareTemplateDom === 'undefined') {
  compatibleShadyCSSVersion = false;
}

/**
 * Template factory which scopes template DOM using ShadyCSS.
 * @param scopeName {string}
 */
export const shadyTemplateFactory = scopeName => result => {
  const cacheKey = getTemplateCacheKey(result.type, scopeName);
  let templateCache = templateCaches.get(cacheKey);
  if (templateCache === undefined) {
    templateCache = {
      stringsArray: new WeakMap(),
      keyString: new Map(),
    };
    templateCaches.set(cacheKey, templateCache);
  }
  let template = templateCache.stringsArray.get(result.strings);
  if (template !== undefined) {
    return template;
  }
  const key = result.strings.join(marker);
  template = templateCache.keyString.get(key);
  if (template === undefined) {
    const element = result.getTemplateElement();
    if (compatibleShadyCSSVersion) {
      ShadyCSS.prepareTemplateDom(element, scopeName);
    }
    template = new Template(result, element);
    templateCache.keyString.set(key, template);
  }
  templateCache.stringsArray.set(result.strings, template);
  return template;
};
