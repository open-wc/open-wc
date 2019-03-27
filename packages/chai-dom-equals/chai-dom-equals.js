import { getDiffableSemanticHTML } from '@open-wc/semantic-dom-diff';

/**
 * el.outerHTML is not polyfilled so we need to recreate the tag + attributes and
 * combine it with el.innerHTML.
 *
 * @param {Element} el Element you want to get the out Html from
 * @returns {String} outer html
 */
export const getOuterHtml = el => {
  // @ts-ignore
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
 * For comparision we do not need the style scoping classes on polyfilled browsers
 * Rather naive approach for now - probably need to improve once we have failing cases.
 *
 * @param {Element} el Element you want to get the cleaned shadow dom
 * @returns {String} cleaned shadow dom
 */
export const getCleanedShadowDom = el => {
  // @ts-ignore
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

/**
 * Setup the
 *
 * Note: can not be an arrow function as it gets rebound
 *
 * @param {any} chai
 * @param {any} utils
 */
export const chaiDomEquals = (chai, utils) => {
  chai.Assertion.addProperty('dom', function dom() {
    // @ts-ignore
    new chai.Assertion(this._obj.nodeType).to.equal(1);
    // @ts-ignore
    utils.flag(this, 'dom', true);
  });

  // can not be an arrow function as it gets rebound
  chai.Assertion.addProperty('shadowDom', function shadowDom() {
    // @ts-ignore
    new chai.Assertion(this._obj.nodeType).to.equal(1);
    // @ts-ignore
    utils.flag(this, 'shadowDom', true);
  });

  // can not be an arrow function as it gets rebound
  // TODO: this is here for backwards compatibility, removal will be
  // a breaking change
  chai.Assertion.addProperty('semantically', function shadowDom() {
    // @ts-ignore
    new chai.Assertion(this._obj.nodeType).to.equal(1);
    // @ts-ignore
    utils.flag(this, 'semantically', true);
  });

  // can not be an arrow function as it gets rebound
  // prettier-ignore
  const domEquals = _super => function handleDom(value, ...args) {
    // @ts-ignore
    if (utils.flag(this, 'dom')) {
      const expectedHTML = getDiffableSemanticHTML(value);
      // @ts-ignore
      const actualHTML = getDiffableSemanticHTML(getOuterHtml(this._obj));

      // use chai's built-in string comparison, log the updated snapshot on error
      try {
        new chai.Assertion(actualHTML).to.equal(expectedHTML);
      } catch (error) {
        /* eslint-disable no-console */
        console.log('Snapshot changed, want to accept the change:');
        console.log('');
        console.log(actualHTML);
        /* eslint-enable no-console */
        throw error;
      }

    // @ts-ignore
    } else if (utils.flag(this, 'shadowDom')) {
      const expectedHTML = getDiffableSemanticHTML(value);
      // @ts-ignore
      const actualHTML = getDiffableSemanticHTML(getCleanedShadowDom(this._obj));

      // use chai's built-in string comparison, log the updated snapshot on error
      try {
        new chai.Assertion(actualHTML).to.equal(expectedHTML);
      } catch (error) {
        /* eslint-disable no-console */
        console.log('Snapshot changed, want to accept the change:');
        console.log('');
        console.log(actualHTML);
        /* eslint-enable no-console */
        throw error;
      }

    } else {
      // @ts-ignore
      _super.apply(this, [value, ...args]);
    }
  };

  chai.Assertion.overwriteMethod('equals', domEquals);
  chai.Assertion.overwriteMethod('equal', domEquals);
  chai.Assertion.overwriteMethod('eq', domEquals);
};
