// @ts-nocheck

import { getDiffableHTML } from './get-diffable-html.js';
import { getOuterHtml, getCleanedShadowDom, snapshotPath } from './src/utils.js';

/**
 * @param {any} chai
 * @param {any} utils
 */
export const chaiDomDiff = (chai, utils) => {
  /**
   * can not be an arrow function as it gets rebound by chai
   */
  chai.Assertion.addProperty('lightDom', function lightDom() {
    new chai.Assertion(this._obj.nodeType).to.equal(1);
    utils.flag(this, 'lightDom', true);
  });

  /**
   * can not be an arrow function as it gets rebound by chai
   */
  chai.Assertion.addProperty('shadowDom', function shadowDom() {
    new chai.Assertion(this._obj.nodeType).to.equal(1);
    utils.flag(this, 'shadowDom', true);
  });

  /**
   * can not be an arrow function as it gets rebound by chai
   */
  chai.Assertion.addProperty('dom', function dom() {
    new chai.Assertion(this._obj.nodeType).to.equal(1);
    utils.flag(this, 'dom', true);
  });

  const domEquals = _super =>
    function handleDom(value, ...args) {
      if (utils.flag(this, 'shadowDom')) {
        const expectedHTML = getDiffableHTML(value, args[0]);
        const actualHTML = getDiffableHTML(getCleanedShadowDom(this._obj), args[0]);

        // use chai's built-in string comparison, log the updated snapshot on error
        new chai.Assertion(actualHTML).to.equal(expectedHTML);
      } else if (utils.flag(this, 'lightDom')) {
        const expectedHTML = getDiffableHTML(value, args[0]);
        const actualHTML = getDiffableHTML(this._obj.innerHTML, args[0]);

        // use chai's built-in string comparison, log the updated snapshot on error
        new chai.Assertion(actualHTML).to.equal(expectedHTML);
      } else if (utils.flag(this, 'dom')) {
        const expectedHTML = getDiffableHTML(value, args[0]);
        const actualHTML = getDiffableHTML(getOuterHtml(this._obj), args[0]);

        // use chai's built-in string comparison, log the updated snapshot on error
        new chai.Assertion(actualHTML).to.equal(expectedHTML);
      } else {
        _super.apply(this, [value, ...args]);
      }
    };

  chai.Assertion.overwriteMethod('equals', domEquals);
  chai.Assertion.overwriteMethod('equal', domEquals);
  chai.Assertion.overwriteMethod('eq', domEquals);

  const context = window.__mocha_context__;
  const snapshotState = window.__snapshot__;

  function equalSnapshot(options) {
    const object = chai.util.flag(this, 'object');
    const { index } = context;
    context.index += 1;
    let dom;
    let path;

    if (utils.flag(this, 'shadowDom')) {
      dom = getCleanedShadowDom(object);
    } else if (utils.flag(this, 'lightDom')) {
      dom = object.innerHTML;
    } else {
      dom = object;
    }
    const html = getDiffableHTML(dom, options);

    if (context.runnable.type === 'hook') {
      path = snapshotPath(context.runnable.ctx.currentTest);
    } else {
      path = snapshotPath(context.runnable);
    }

    if (snapshotState.update) {
      snapshotState.set(path, index, html, 'html');
    } else {
      const snapshot = snapshotState.get(path, index);

      if (!snapshot) {
        snapshotState.set(path, index, html, 'html');
      } else if (!snapshotState.match(html, getDiffableHTML(snapshot.code, options))) {
        /* istanbul ignore next */
        throw new chai.AssertionError(
          `Received value does not match stored snapshot ${index}`,
          {
            actual: html,
            expected: snapshot.code,
            showDiff: true,
          },
          chai.util.flag(this, 'ssfi'),
        );
      }
    }
  }

  utils.addMethod(chai.Assertion.prototype, 'equalSnapshot', equalSnapshot);
};
