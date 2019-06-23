import { fixture } from './fixture.js';
/* global Mocha, axs */
const Test = Mocha.Test;
const Suite = Mocha.Suite;
/**
 * Runs accessibility audits for web components.
 *
 * @param {String} id Suite id
 * @param {String|Element} html Fixture template string or created element.
 * @param {Array?} ignoredRules Array of rules to ignore for this suite
 */
export async function a11ySuite(id, html, ignoredRules) {
  const element = html instanceof HTMLElement ? html : await fixture(html);
  const mInstancwe = new Mocha();
  const suiteInstance = Suite.create(mocha.suite, 'A11y Audit: ' + id);
  const axsConfig = new axs.AuditConfiguration();
  axsConfig.scope = element.parentNode;
  axsConfig.showUnsupportedRulesWarning = false;
  axsConfig.auditRulesToIgnore = ignoredRules;
  const results = axs.Audit.run(axsConfig);
  results.forEach((result) => {
    // only show applicable tests
    if (result.result !== 'NA') {
      const title = result.rule.heading;
      suiteInstance.addTest(new Test(title, function() {
        const error = result.result === 'FAIL' ? axs.Audit.accessibilityErrorMessage(result) : null;
        if (error) {
          throw new Error(error);
        }
      }));
    }
  });
  mInstancwe.run();
}
