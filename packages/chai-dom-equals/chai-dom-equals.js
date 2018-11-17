import { getSemanticDomDiff } from '@open-wc/semantic-dom-diff';

/**
 * el.outerHTML is not polyfilled so we need to recreate the tag + attributes and
 * combine it with el.innerHTML.
 */
export const getOuterHtml = (el) => {
  if (window.ShadyCSS && window.ShadyCSS.nativeShadow === false) {
    const tagName = el.tagName.toLowerCase();
    let attributes = ' ';
    Array.prototype.slice.call(el.attributes).forEach((item) => {
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
 */
export const getCleanedShadowDom = (el) => {
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

export const chaiDomEquals = (chai, utils) => {
  // can not be an arrow function as it gets rebound
  chai.Assertion.addProperty('dom', function dom() {
    new chai.Assertion(this._obj.nodeType).to.equal(1);
    utils.flag(this, 'dom', true);
  });

  // can not be an arrow function as it gets rebound
  chai.Assertion.addProperty('shadowDom', function shadowDom() {
    new chai.Assertion(this._obj.nodeType).to.equal(1);
    utils.flag(this, 'shadowDom', true);
  });

  // can not be an arrow function as it gets rebound
  chai.Assertion.addProperty('semantically', function shadowDom() {
    new chai.Assertion(this._obj.nodeType).to.equal(1);
    utils.flag(this, 'semantically', true);
  });

  // can not be an arrow function as it gets rebound
  const domEquals = _super => function handleDom(value, ...args) {
    if (!utils.flag(this, 'semantically') && utils.flag(this, 'dom')) {
      const expected = getOuterHtml(this._obj);
      this.assert(
        value === expected,
        'expected dom #{exp} to equal #{act}',
        'expected dom #{exp} to not equal #{act}',
        expected,
        value,
      );
    } else if (!utils.flag(this, 'semantically') && utils.flag(this, 'shadowDom')) {
      const expected = getCleanedShadowDom(this._obj);
      this.assert(
        value === expected,
        'expected shadow dom #{exp} to equal #{act}',
        'expected shadow dom #{exp} to not equal #{act}',
        expected,
        value,
      );
    } else if (utils.flag(this, 'semantically') && utils.flag(this, 'dom')) {
      const result = getSemanticDomDiff(value, getOuterHtml(this._obj));
      const message = result ? result.message : '';
      const path = result ? result.path : '';
      const normalizedHTML = result ? result.normalizedRightHTML : '';
      this.assert(
        result === null,
        () => {
          /* eslint-disable no-console */
          console.log('Snapshot changed, want to accept the change?');
          console.log('Updated Snapshot:');
          console.log('');
          console.log(normalizedHTML);
          /* eslint-enable no-console */
          return `expected dom to be semantically equal\n- diff found: ${message}\n- in path: ${path}`;
        },
        'expected dom to not be semantically equal',
      );
    } else if (utils.flag(this, 'semantically') && utils.flag(this, 'shadowDom')) {
      const result = getSemanticDomDiff(value, getCleanedShadowDom(this._obj));
      const message = result ? result.message : '';
      const path = result ? result.path : '';
      const normalizedHTML = result ? result.normalizedRightHTML : '';
      this.assert(
        result === null,
        () => {
          /* eslint-disable no-console */
          console.log('Snapshot changed, want to accept the change?');
          console.log('Updated Snapshot:');
          console.log('');
          console.log(normalizedHTML);
          /* eslint-enable no-console */
          return `expected shadow dom to be semantically equal\n- diff found: ${message}\n- in path: ${path}`;
        },
        'expected shadow dom to not be semantically equal',
      );
    } else {
      _super.apply(this, [value, ...args]);
    }
  };

  chai.Assertion.overwriteMethod('equals', domEquals);
  chai.Assertion.overwriteMethod('equal', domEquals);
  chai.Assertion.overwriteMethod('eq', domEquals);
};
