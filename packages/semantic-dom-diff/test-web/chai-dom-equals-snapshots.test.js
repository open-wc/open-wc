import { assert, expect } from './bdd-setup.js';

customElements.define(
  'snapshotted-element',
  class extends HTMLElement {
    constructor() {
      super();

      this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
      this.shadowRoot.innerHTML = '<span>B</span>';
    }
  },
);

describe('component-a', () => {
  describe('success states', () => {
    it('matches a string snapshot', async () => {
      await expect('<div>A</div>').to.equalSnapshot();
      await assert.equalSnapshot('<div>A</div>');
    });

    it('matches a dom element snapshot', async () => {
      const div = document.createElement('div');
      div.textContent = 'B';
      await expect(div).to.equalSnapshot();
      assert.equalSnapshot(div);
    });

    it('matches a dom element snapshot, using .dom', async () => {
      const div = document.createElement('div');
      div.textContent = 'C';
      await expect(div).dom.to.equalSnapshot();
      assert.dom.equalSnapshot(div);
    });
  });

  describe('error states', () => {
    it('matches a lightdom snapshot', async () => {
      const div = document.createElement('div');
      div.innerHTML = '<span>A</span>';
      await expect(div).lightDom.to.equalSnapshot();
      assert.lightDom.equalSnapshot(div);
    });

    it('matches shadow dom snapshot', async () => {
      const myElement = document.createElement('snapshotted-element');
      document.body.appendChild(myElement);
      await expect(myElement).shadowDom.to.equalSnapshot();
      assert.shadowDom.equalSnapshot(myElement);
      myElement.parentElement.removeChild(myElement);
    });
  });

  describe('failed snapshots', () => {
    describe('throws an error when a snapshot does not match', () => {
      it('expect', async () => {
        const myElement = document.createElement('div');
        myElement.textContent = `${Math.random()}`;
        document.body.appendChild(myElement);

        let thrown = false;
        try {
          await expect(myElement).dom.to.equalSnapshot();
        } catch (error) {
          thrown = true;
          await expect(error.actual.startsWith('<div>')).to.be.true;
          await expect(error.expected.startsWith('<div>')).to.be.true;
        }

        await expect(thrown).to.be.true;
      });

      it('assert', async () => {
        const myElement = document.createElement('div');
        myElement.textContent = `${Math.random()}`;
        document.body.appendChild(myElement);

        let thrown = false;
        try {
          await assert.dom.equalSnapshot(myElement);
        } catch (error) {
          thrown = true;
          await expect(error.actual.startsWith('<div>')).to.be.true;
          await expect(error.expected.startsWith('<div>')).to.be.true;
        }

        await expect(thrown).to.be.true;
      });
    });

    it('does not throw an error when a snapshot does not match using negate', async () => {
      const myElement = document.createElement('div');
      myElement.textContent = `${Math.random()}`;
      document.body.appendChild(myElement);

      await expect(myElement).dom.to.not.equalSnapshot();
      assert.dom.notEqualSnapshot(myElement);
    });
  });
});

describe('component-b', () => {
  describe('success states', () => {
    describe('can ignore attributes ', () => {
      it('expect', async () => {
        await expect(`<div random-attribute="${Math.random()}">A</div>`).to.equalSnapshot({
          ignoreAttributes: ['random-attribute'],
        });
      });

      it('assert', async () => {
        await assert.dom.equalSnapshot(`<div random-attribute="${Math.random()}">A</div>`, {
          ignoreAttributes: ['random-attribute'],
        });
      });
    });
  });

  describe('error states', () => {
    describe('can ignore tags', () => {
      it('expect', async () => {
        await expect(`<div>A</div><span>B</span>`).to.equalSnapshot({ ignoreTags: ['span'] });
      });

      it('assert', async () => {
        await assert.dom.equalSnapshot(`<div>A</div><span>B</span>`, { ignoreTags: ['span'] });
      });
    });
  });
});
