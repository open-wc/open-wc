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
  const needsTemplate = needsTemplatePolyfill();
  const needsShadowDom =
    !('attachShadow' in Element.prototype) ||
    !('getRootNode' in Element.prototype) ||
    (window.ShadyDOM && window.ShadyDOM.force);
  const needsCustomElements = !window.customElements || window.customElements.forcePolyfill;

  // URL is required by webcomponents polyfill
  // We can use URLSearchParams as a watermark for URL support
  if (!('URLSearchParams' in window)) {
    polyfills.push(import('@bundled-es-modules/url-polyfill'));
  }

  if (needsTemplate) {
    // template is a watermark for requiring all polyfills (IE11 and Edge)
    polyfills.push(import('./src/webcomponents-all.js'));
  } else if (needsShadowDom || needsCustomElements) {
    // only chrome 53 supports shadow dom but not custom elements. this is an older browser, there is no need
    // for complicating the setup here. there is no harm in loading the polyfills there
    polyfills.push(import('./src/webcomponents-sd-ce.js'));
  }

  return Promise.all(polyfills);
}
