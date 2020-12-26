// @ts-nocheck

/**
 * el.outerHTML is not polyfilled so we need to recreate the tag + attributes and
 * combine it with el.innerHTML.
 *
 * @param {Element} el Element you want to get the out Html from
 * @returns {String} outer html
 */
export const getOuterHtml = el => {
  /* istanbul ignore next */
  if (window.ShadyCSS && window.ShadyCSS.nativeShadow === false) {
    const tagName = el.tagName.toLowerCase();
    let attributes = ' ';
    Array.prototype.slice.call(el.attributes).forEach(item => {
      attributes += `${item.name}="${item.value}" `;
    });
    // removes last ' ' or if there are no attributes makes it to equal ''
    attributes = attributes.slice(0, -1);
    return `<${tagName}${attributes}>${el.innerHTML}</${tagName}>`;
  }
  return el.outerHTML;
};

/**
 * For comparison we do not need the style scoping classes on polyfilled browsers
 * Rather naive approach for now - probably need to improve once we have failing cases.
 *
 * @param {Element} el Element you want to get the cleaned shadow dom
 * @returns {String} cleaned shadow dom
 */
export const getCleanedShadowDom = el => {
  /* istanbul ignore next */
  if (window.ShadyCSS && window.ShadyCSS.nativeShadow === false) {
    const tagName = el.tagName.toLowerCase();
    const regexTagName = new RegExp(tagName, 'g');
    let domString = el.shadowRoot.innerHTML;
    domString = domString.replace(/style-scope/g, ''); // remove style-scope class
    domString = domString.replace(regexTagName, ''); // remove scoped class name
    domString = domString.replace(/(class=".*?)(\s)*"/g, '$1"'); // remove trailing spaces in class=" "
    domString = domString.replace(/ class="\w?"/g, ''); // remove empty class attributes
    return domString;
  }
  return el.shadowRoot.innerHTML;
};

export function snapshotPath(rootNode) {
  const path = [];
  let node = rootNode;

  while (node && node.parent) {
    path.push(node.title);
    node = node.parent;
  }
  return path.reverse();
}
