import { axe, loadAxe } from './axe-import.js';

/**
 * Creates a map of rules to disable during the test.
 * @param {Array<String>?} ignored List of rule names to ignore during the test.
 * @return {Object|undefined} List of rules to be passed to test configuration or
 * `undefined` when not needed.
 */
function getRules(ignored) {
  if (!ignored || !ignored.length) {
    return undefined;
  }
  const result = {};
  ignored.forEach(rule => {
    result[rule] = { enabled: false };
  });
  return result;
}

/**
 * Performs the test using AXE core.
 * @param {Element} element The element to be used to perform the test on.
 * @param {Object} opts AXE configuration options.
 * @return {Promise} Promise resolved to the test results object
 */
async function runTestAsync(element, opts) {
  if (!axe) {
    // ensure axe is loaded before running tests
    await loadAxe();
  }

  return new Promise((resolve, reject) => {
    // @ts-ignore
    axe.run(element, opts, (err, results) => {
      if (err) {
        reject(new Error(err));
      } else {
        resolve(results);
      }
    });
  });
}

/**
 * Processes axe testing results.
 * @param {Boolean} negate When true "not" was used with the test and the output is the opposite
 * (failed test won't throw error)
 * @param {Object} results Axe test result object
 * @param {Function} done A function to be called when ready.
 * @throws {Error} When test did not pass.
 */
function processResults(negate, results, done) {
  const { violations } = results;

  if (violations.length && negate) {
    done();
    return;
  }

  if (!violations.length && !negate) {
    done();
    return;
  }

  const messages = [];
  if (violations.length) {
    messages[messages.length] = 'Accessibility Violations';
    messages[messages.length] = '---';
    violations.forEach(violation => {
      messages[messages.length] = `Rule: ${violation.id}`;
      messages[messages.length] = `Impact: ${violation.impact}`;
      messages[messages.length] = `${violation.help} (${violation.helpUrl})`;
      violation.nodes.forEach(node => {
        messages[messages.length] = '';
        if (node.target) {
          messages[messages.length] = `Issue target: ${node.target}`;
        }
        messages[messages.length] = `Context: ${node.html}`;
        if (node.failureSummary) {
          messages[messages.length] = `${node.failureSummary}`;
        }
      });
      messages[messages.length] = '---';
    });
  }

  const msg = new Error(messages.join('\n'));
  done(msg);
  throw msg;
}

/**
 * @param {any} chai
 * @param {any} utils
 */
export const chaiA11yAxe = (chai, utils) => {
  const { assert } = chai;
  utils.addMethod(chai.Assertion.prototype, 'accessible', function axeTest(options) {
    // @ts-ignore
    const fixture = this._obj;
    const opts = options || {};

    const rules = getRules(opts.ignoredRules);

    const testOpts = {
      resultTypes: ['violations'],
    };
    if (rules) {
      testOpts.rules = rules;
    }
    let done = opts.done ? opts.done : undefined;
    if (!done) {
      done = () => {};
    }
    const result = runTestAsync(fixture, testOpts).then(results =>
      // @ts-ignore
      processResults(utils.flag(this, 'negate'), results, done),
    );
    // @ts-ignore
    this.then = result.then.bind(result);
    // @ts-ignore
    return this;
  });

  assert.isAccessible = function isAccessible(fixture, options) {
    return new chai.Assertion(fixture).to.be.accessible(options);
  };

  assert.isNotAccessible = function isAccessible(fixture, options) {
    return new chai.Assertion(fixture).not.to.be.accessible(options);
  };
};
