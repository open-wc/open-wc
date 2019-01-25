/**
 * Web component polyfills loader, based on: https://github.com/webcomponents/webcomponentsjs/blob/master/webcomponents-loader.js
 *
 * Adapted to not load language polyfills and use dynamic imports
 */

function needsTemplatePolyfill() {
  // no real <template> because no `content` property (IE and older browsers)
  const template = document.createElement('template');
  if (!('content' in template)) {
    return true;
  }
  // broken doc fragment (older Edge)
  if (!(template.content.cloneNode() instanceof DocumentFragment)) {
    return true;
  }
  // broken <template> cloning (Edge up to at least version 17)
  const template2 = document.createElement('template');
  template2.content.appendChild(document.createElement('div'));
  template.content.appendChild(template2);
  const clone = template.cloneNode(true);
  return (
    clone.content.childNodes.length === 0 ||
    clone.content.firstChild.content.childNodes.length === 0
  );
}

/**
 * Loads web component polyfills if needed
 * @returns {Promise<void>} resolves when polyfills are loaded
 */
export default function loadPolyfills() {
  const polyfills = [];

  // URL is required by webcomponents polyfill
  // We can use URLSearchParams as a watermark for URL support
  if (!('URLSearchParams' in window)) {
    polyfills.push(import('url-polyfill'));
  }

  // template polyfill (IE11 and Edge)
  if (needsTemplatePolyfill()) {
    // no template means we also need to load general platform polyfills
    polyfills.push(import('@webcomponents/webcomponents-platform/webcomponents-platform.js'));
    polyfills.push(import('@webcomponents/template/template.js'));
  }

  // shadow dom polyfills
  if (
    !('attachShadow' in Element.prototype) ||
    !('getRootNode' in Element.prototype) ||
    (window.ShadyDOM && window.ShadyDOM.force)
  ) {
    polyfills.push(import('@webcomponents/shadydom/src/shadydom.js'));
    polyfills.push(import('@webcomponents/shadycss/entrypoints/scoping-shim.js'));
  }

  // custom element polyfills
  if (!window.customElements || window.customElements.forcePolyfill) {
    polyfills.push(import('@webcomponents/custom-elements/src/custom-elements.js'));
  }

  return Promise.all(polyfills);
}
