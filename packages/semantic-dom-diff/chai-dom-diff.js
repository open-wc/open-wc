// @ts-nocheck
/* eslint-disable no-param-reassign */

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

  const getDomHtml = el => getOuterHtml(el);
  const getLightDomHtml = el => el.innerHTML;
  const getShadowDomHtml = el => getCleanedShadowDom(el);

  /** Base HTML assertion for `assert` interface. */
  const assertHtmlEquals = (actual, expected, options) => {
    // use chai's built-in string comparison, log the updated snapshot on error
    new chai.Assertion(getDiffableHTML(actual, options)).to.equal(
      getDiffableHTML(expected, options),
    );
  };

  /** DOM assertion for `should` and `expect` interfaces. */
  const domEquals = _super =>
    function handleDom(value, ...args) {
      if (
        utils.flag(this, 'lightDom') ||
        utils.flag(this, 'shadowDom') ||
        utils.flag(this, 'dom')
      ) {
        let html;
        if (utils.flag(this, 'lightDom')) {
          html = getLightDomHtml(this._obj);
        } else if (utils.flag(this, 'shadowDom')) {
          html = getShadowDomHtml(this._obj);
        } else {
          html = getDomHtml(this._obj);
        }

        assertHtmlEquals(html, value, args[0]);
      } else {
        _super.apply(this, [value, ...args]);
      }
    };

  chai.Assertion.overwriteMethod('equals', domEquals);
  chai.Assertion.overwriteMethod('equal', domEquals);
  chai.Assertion.overwriteMethod('eq', domEquals);

  const context = window.__mocha_context__;
  const snapshotState = window.__snapshot__;

  /** Base HTML snapshot assertion for `assert` interface. */
  function assertHtmlEqualsSnapshot(actual, options) {
    const { index } = context;
    context.index += 1;
    let path;

    const html = getDiffableHTML(actual, options);

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

  /** Snapshot assertion for `should` and `expect` interfaces. */
  function equalSnapshot(options) {
    const el = chai.util.flag(this, 'object');
    let html;
    if (utils.flag(this, 'shadowDom')) {
      html = getShadowDomHtml(el);
    } else if (utils.flag(this, 'lightDom')) {
      html = getLightDomHtml(el);
    } else {
      html = el;
    }
    return assertHtmlEqualsSnapshot(html, options);
  }

  utils.addMethod(chai.Assertion.prototype, 'equalSnapshot', equalSnapshot);

  utils.addMethod(chai.assert, 'equalSnapshot', assertHtmlEqualsSnapshot);
  chai.assert.dom = {
    equal: (actualEl, expectedHTML, options) =>
      assertHtmlEquals(getDomHtml(actualEl), expectedHTML, options),
    equalSnapshot: (actualEl, options) => assertHtmlEqualsSnapshot(actualEl, options),
  };
  chai.assert.lightDom = {
    equal: (actualEl, expectedHTML, options) =>
      assertHtmlEquals(getLightDomHtml(actualEl), expectedHTML, options),
    equalSnapshot: (actualEl, options) =>
      assertHtmlEqualsSnapshot(getLightDomHtml(actualEl), options),
  };
  chai.assert.shadowDom = {
    equal: (actualEl, expectedHTML, options) =>
      assertHtmlEquals(getShadowDomHtml(actualEl), expectedHTML, options),
    equalSnapshot: (actualEl, options) =>
      assertHtmlEqualsSnapshot(getShadowDomHtml(actualEl), options),
  };
};
