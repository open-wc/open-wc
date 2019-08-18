/* istanbul ignore next */
// do manual setup and not use testing to not have circle dependencies
import { fixture as originalFixture, cleanupFixture } from '@open-wc/testing-helpers';
import { chai } from '@bundled-es-modules/chai';
import { chaiDomDiff } from '../chai-dom-diff.js';

export async function fixture(template) {
  const element = await originalFixture(template);
  afterEach(() => {
    cleanupFixture(element);
  });
  return /** @type {T} */ (element);
}

// register-plugins
chai.use(chaiDomDiff);
