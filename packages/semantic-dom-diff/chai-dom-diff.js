/* eslint-disable no-param-reassign */
import { getSnapshot, getSnapshotConfig, saveSnapshot } from '@web/test-runner-commands';
import { getDiffableHTML, isDiffOptions } from './get-diffable-html.js';
import { getCleanedShadowDom, getMochaTestPath, getOuterHtml } from './src/utils.js';

/** @typedef {import('./get-diffable-html.js').DiffOptions} DiffOptions */

function disambiguateArgs(...args) {
  switch (args.length) {
    // equal<T>(actual: T, expected: T, message?: string, options?: DiffOptions): void;
    case 2: {
      const [message, options] = args;
      return { message, options };
    }

    // equal<T>(actual: T, expected: T, message?: string): void;
    // equal<T>(actual: T, expected: T, options?: DiffOptions): void;
    case 1: {
      const [first] = args;
      return isDiffOptions(first) ? { options: first } : { message: first };
    }

    default:
      return {};
  }
}

/**
 * @type {Chai.ChaiPlugin}
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

  /**
   * Base HTML assertion for `assert` interface.
   * @param {string | Node} actual
   * @param {string | Node} expected
   * @param {boolean} negate
   * @param {[string]|[DiffOptions]|[string, DiffOptions]} rest
   */
  const assertHtmlEquals = (actual, expected, negate, ...rest) => {
    const { message, options } = disambiguateArgs(...rest);
    // use chai's built-in string comparison, log the updated snapshot on error
    const assertion = new chai.Assertion(getDiffableHTML(actual, options), message);
    const expectedDiffableHTML = getDiffableHTML(expected, options);

    if (negate) {
      assertion.not.equal(expectedDiffableHTML, message);
    } else {
      assertion.equal(expectedDiffableHTML, message);
    }
  };

  /** DOM assertion for `should` and `expect` interfaces. */
  const domEquals = _super =>
    /**
     * @this {Chai.AssertionStatic}
     */
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

        assertHtmlEquals(html, value, utils.flag(this, 'negate'), args[0]);
      } else {
        _super.apply(this, [value, ...args]);
      }
    };

  chai.Assertion.overwriteMethod('equals', domEquals);
  chai.Assertion.overwriteMethod('equal', domEquals);
  chai.Assertion.overwriteMethod('eq', domEquals);

  /**
   * Base HTML snapshot assertion for `assert` interface.
   * @this {Chai.AssertionStatic}
   * @param {string|Node} actual
   * @param {boolean} negate
   * @param {[string]|[DiffOptions]|[string, DiffOptions]} rest
   */
  function assertHtmlEqualsSnapshotKarma(actual, negate, ...rest) {
    const context = window.__mocha_context__;
    const snapshotState = window.__snapshot__;

    const { message, options } = disambiguateArgs(...rest);
    const { index } = context;
    context.index += 1;
    const path = getMochaTestPath(context.runnable);
    const html = getDiffableHTML(actual, options);

    if (snapshotState.update) {
      snapshotState.set(path, index, html, 'html');
    } else {
      const snapshot = snapshotState.get(path, index);

      if (!snapshot) {
        snapshotState.set(path, index, html, 'html');
      } else {
        const isMatch = snapshotState.match(html, getDiffableHTML(snapshot.code, options));
        if ((isMatch && negate) || (!isMatch && !negate)) {
          /* istanbul ignore next */
          throw new chai.AssertionError(
            message || `Received value does not match stored snapshot ${index}`,
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
  }

  /**
   * Base HTML snapshot assertion for `assert` interface.
   * @this {Chai.AssertionStatic}
   * @param {string|Node} actual
   * @param {boolean} negate
   * @param {[string]|[DiffOptions]|[string, DiffOptions]} rest
   */
  async function assertHtmlEqualsSnapshotWebTestRunner(actual, negate, ...rest) {
    const { message, options } = disambiguateArgs(...rest);
    const path = getMochaTestPath(window.__WTR_MOCHA_RUNNER__.test);
    const name = path.join(' ');
    const snapshot = getDiffableHTML(actual, options);
    const currentSnapshot = await getSnapshot({ name });
    const config = await getSnapshotConfig();

    if (currentSnapshot && !config.updateSnapshots) {
      if (negate ? currentSnapshot === snapshot : currentSnapshot !== snapshot) {
        throw new chai.AssertionError(
          message || `Snapshot ${name} does not match the saved snapshot on disk`,
          {
            actual: snapshot,
            expected: currentSnapshot,
            showDiff: true,
          },
          chai.util.flag(this, 'ssfi'),
        );
      }
    } else {
      await saveSnapshot({ name, content: snapshot });
    }
  }

  function assertHtmlEqualsSnapshot(actual, negate, ...rest) {
    if (window.__mocha_context__ && window.__snapshot__) {
      return assertHtmlEqualsSnapshotKarma.call(this, actual, negate, ...rest);
    }
    if (window.__WTR_MOCHA_RUNNER__) {
      return assertHtmlEqualsSnapshotWebTestRunner.call(this, actual, negate, ...rest);
    }
    throw new Error(
      'Could not detect test runner environment. ' +
        'Snapshots require either Web Test Runner with mocha, ' +
        'or Karma with mocha and karma mocha snapshot',
    );
  }

  /**
   * Snapshot assertion for `should` and `expect` interfaces.
   * @this {Chai.AssertionStatic}
   */
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
    return assertHtmlEqualsSnapshot.call(this, html, utils.flag(this, 'negate'), options);
  }

  utils.addMethod(chai.Assertion.prototype, 'equalSnapshot', equalSnapshot);
  utils.addMethod(chai.Assertion.prototype, 'notEqualSnapshot', equalSnapshot);

  utils.addMethod(chai.assert, 'equalSnapshot', assertHtmlEqualsSnapshot);
  utils.addMethod(chai.assert, 'notEqualSnapshot', assertHtmlEqualsSnapshot);

  /** @type {Chai.Assert['dom']} */
  chai.assert.dom = {
    equal(actualEl, expectedHTML, ...rest) {
      const negate = false;
      return assertHtmlEquals.call(this, getDomHtml(actualEl), expectedHTML, negate, ...rest);
    },
    notEqual(actualEl, expectedHTML, ...rest) {
      const negate = true;
      return assertHtmlEquals.call(this, getDomHtml(actualEl), expectedHTML, negate, ...rest);
    },
    equalSnapshot(actualEl, ...rest) {
      const negate = false;
      return assertHtmlEqualsSnapshot.call(this, actualEl, negate, ...rest);
    },
    notEqualSnapshot(actualEl, ...rest) {
      const negate = true;
      return assertHtmlEqualsSnapshot.call(this, actualEl, negate, ...rest);
    },
  };

  /** @type {Chai.Assert['lightDom']} */
  chai.assert.lightDom = {
    equal(actualEl, expectedHTML, ...rest) {
      const negate = false;
      return assertHtmlEquals.call(this, getLightDomHtml(actualEl), expectedHTML, negate, ...rest);
    },
    notEqual(actualEl, expectedHTML, ...rest) {
      const negate = true;
      return assertHtmlEquals.call(this, getLightDomHtml(actualEl), expectedHTML, negate, ...rest);
    },
    equalSnapshot(actualEl, ...rest) {
      const negate = false;
      return assertHtmlEqualsSnapshot.call(this, getLightDomHtml(actualEl), negate, ...rest);
    },
    notEqualSnapshot(actualEl, ...rest) {
      const negate = true;
      return assertHtmlEqualsSnapshot.call(this, getLightDomHtml(actualEl), negate, ...rest);
    },
  };

  /** @type {Chai.Assert['shadowDom']} */
  chai.assert.shadowDom = {
    equal(actualEl, expectedHTML, ...rest) {
      const negate = false;
      return assertHtmlEquals.call(this, getShadowDomHtml(actualEl), expectedHTML, negate, ...rest);
    },
    notEqual(actualEl, expectedHTML, ...rest) {
      const negate = true;
      return assertHtmlEquals.call(this, getShadowDomHtml(actualEl), expectedHTML, negate, ...rest);
    },
    equalSnapshot(actualEl, ...rest) {
      const negate = false;
      return assertHtmlEqualsSnapshot.call(this, getShadowDomHtml(actualEl), negate, ...rest);
    },
    notEqualSnapshot(actualEl, ...rest) {
      const negate = true;
      return assertHtmlEqualsSnapshot.call(this, getShadowDomHtml(actualEl), negate, ...rest);
    },
  };
};
