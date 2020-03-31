/** @typedef {import('parse5').Document} Document */
/** @typedef {import('parse5').Node} Node */
/** @typedef {import('parse5').DefaultTreeElement} DefaultTreeElement */

const { isUri } = require('valid-url');
const {
  constructors,
  setAttribute,
  append,
  queryAll,
  predicates,
  getAttribute,
  hasAttribute,
} = require('./dom5-fork');

/**
 * @param {string} tag
 * @param {Record<string, string>} attributes
 * @returns {DefaultTreeElement}
 */
function createElement(tag, attributes) {
  const element = constructors.element(tag);
  if (attributes) {
    Object.keys(attributes).forEach(key => {
      if (attributes[key] != null) {
        setAttribute(element, key, attributes[key]);
      }
    });
  }
  return element;
}

/**
 * @param {Record<string, string | undefined>} attributes
 * @param {string} [code]
 * @returns {DefaultTreeElement}
 */
function createScript(attributes, code) {
  const script = createElement('script', attributes);
  if (code) {
    const scriptText = constructors.text(code);
    append(script, scriptText);
  }
  return script;
}

/**
 * @param {string} code
 * @returns {DefaultTreeElement}
 */
function createModuleScript(code) {
  return createScript({ type: 'module' }, code);
}

/**
 * @param {Document} document
 * @returns {{ inline: Node[], external: Node[]}}
 */
function findImportMapScripts(document) {
  /** @type {Node[]} */
  const allScripts = queryAll(document, predicates.hasTagName('script'));
  const scripts = allScripts.filter(script => getAttribute(script, 'type') === 'importmap');

  /** @type {Node[]} */
  const inline = [];
  /** @type {Node[]} */
  const external = [];
  scripts.forEach(script => {
    if (getAttribute(script, 'src')) {
      external.push(script);
    } else {
      inline.push(script);
    }
  });

  return { inline, external };
}

/** @param {Node} script */
function isDeferred(script) {
  return getAttribute(script, 'type') === 'module' || hasAttribute(script, 'defer');
}

/** @param {Node} script */
function isAsync(script) {
  return hasAttribute(script, 'async');
}

/**
 * @param {Node} a
 * @param {Node} b
 * @returns {number}
 */
function sortByLoadingPriority(a, b) {
  if (isAsync(a)) {
    return 0;
  }

  const aDeferred = isDeferred(a);
  const bDeferred = isDeferred(b);

  if (aDeferred && bDeferred) {
    return 0;
  }

  if (aDeferred) {
    return 1;
  }

  if (bDeferred) {
    return -1;
  }

  return 0;
}
/**
 * Finds all js scripts in a document, returns the scripts sorted by loading priority.
 * @param {Document} document
 * @param {{ jsScripts?: boolean, jsModules?: boolean, inlineJsScripts?: boolean, inlineJsModules?: boolean }} [exclude]
 * @returns {Node[]}
 */
function findJsScripts(document, exclude = {}) {
  /** @type {Node[]} */
  const allScripts = queryAll(document, predicates.hasTagName('script'));

  return allScripts
    .filter(script => {
      const inline = !hasAttribute(script, 'src');
      const type = getAttribute(script, 'type');

      // we don't handle scripts which import from a URL (ex. a CDN)
      if (!inline && isUri(getAttribute(script, 'src'))) {
        return false;
      }

      if (!type || ['application/javascript', 'text/javascript'].includes(type)) {
        return inline ? !exclude.inlineJsScripts : !exclude.jsScripts;
      }
      if (type === 'module') {
        return inline ? !exclude.inlineJsModules : !exclude.jsModules;
      }
      return false;
    })
    .sort(sortByLoadingPriority);
}

module.exports = {
  createElement,
  createScript,
  createModuleScript,
  findImportMapScripts,
  findJsScripts,
};
