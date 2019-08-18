import { wrappers } from '@open-wc/testing-helpers/src/fixture-manager.js';
import { expect, cleanupFixture } from '../../index.js';
import { fixture, fixtureSync } from '../../src/fixture.js';

describe('fixture', () => {
  describe('cleans up fixtures automatically on afterEach', () => {
    it('fixture a', async () => {
      expect(wrappers.size).to.equal(0);
      await fixture('<div></div>');
      expect(wrappers.size).to.equal(1);
    });

    it('fixture b', async () => {
      expect(wrappers.size).to.equal(0);
      await fixtureSync('<div></div>');
      expect(wrappers.size).to.equal(1);
    });

    it('fixture c', async () => {
      expect(wrappers.size).to.equal(0);
    });
  });

  describe('can be configured to not automatically cleanup', () => {
    let elementA;
    let elementB;

    it('fixture a', async () => {
      expect(wrappers.size).to.equal(0);
      elementA = await fixture('<div></div>', { autoCleanup: false });
      expect(wrappers.size).to.equal(1);
    });

    it('fixture b', async () => {
      expect(wrappers.size).to.equal(1);
      elementB = await fixtureSync('<div></div>', { autoCleanup: false });
      expect(wrappers.size).to.equal(2);
    });

    it('fixture c', async () => {
      expect(wrappers.size).to.equal(2);
      cleanupFixture(elementA);
      cleanupFixture(elementB);
      expect(wrappers.size).to.equal(0);
    });
  });
});
