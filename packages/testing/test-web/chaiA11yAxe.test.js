import { fixture, expect, assert, html } from '../index.js';

describe('chaiA11yAxe', () => {
  describe('Expect', () => {
    it('passes axe accessible tests', async () => {
      const el = await fixture(html` <button>some light dom</button> `);
      await expect(el).to.be.accessible();
    });

    it('accepts "done" option', done => {
      fixture(html` <button>some light dom</button> `).then(el => {
        expect(el).to.be.accessible({
          done,
        });
      });
    });

    it('accepts ignored rules list', async () => {
      const el = await fixture(html`
        <div aria-labelledby="test-x">
          <span role="button"></span>
        </div>
      `);
      await expect(el).to.be.accessible({
        ignoredRules: ['aria-valid-attr-value', 'button-name'],
      });
    });

    it('uses negation to pass failed test', async () => {
      const el = await fixture(html` <div aria-labelledby="test-x"></div> `);
      await expect(el).not.to.be.accessible();
    });
  });

  describe('Assert', () => {
    it('passes axe accessible tests', async () => {
      const el = await fixture(html` <button>some light dom</button> `);
      await assert.isAccessible(el);
    });

    it('accepts ignored rules list', async () => {
      const el = await fixture(html` <div aria-labelledby="test-x"></div> `);
      await assert.isAccessible(el, {
        ignoredRules: ['aria-valid-attr-value'],
      });
    });

    it('throws when audit did not pass', async () => {
      const el = await fixture(html` <div aria-labelledby="test-x"></div> `);
      let thrown = false;
      try {
        await assert.isAccessible(el);
      } catch (e) {
        thrown = true;
      }
      assert.isTrue(thrown);
    });

    it('passes for negation', async () => {
      const el = await fixture(html` <div aria-labelledby="test-x"></div> `);
      await assert.isNotAccessible(el);
    });
  });
});
