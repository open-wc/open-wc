import { expect } from '@bundled-es-modules/chai';
import './bdd-setup.js';

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
    it('matches a string snapshot', () => {
      expect('<div>A</div>').to.equalSnapshot();
    });

    it('matches a dom element snapshot', () => {
      const div = document.createElement('div');
      div.textContent = 'B';
      expect(div).to.equalSnapshot();
    });

    it('matches a dom element snapshot, using .dom', () => {
      const div = document.createElement('div');
      div.textContent = 'C';
      expect(div).dom.to.equalSnapshot();
    });
  });

  describe('error states', () => {
    it('matches a lightdom snapshot', () => {
      const div = document.createElement('div');
      div.innerHTML = '<span>A</span>';
      expect(div).lightDom.to.equalSnapshot();
    });

    it('matches shadow dom snapshot', () => {
      const myElement = document.createElement('snapshotted-element');
      document.body.appendChild(myElement);
      expect(myElement).shadowDom.to.equalSnapshot();
      myElement.parentElement.removeChild(myElement);
    });
  });
});

describe('component-b', () => {
  describe('success states', () => {
    it('can ignore attributes', () => {
      expect(`<div random-attribute="${Math.random()}">A</div>`).to.equalSnapshot({
        ignoreAttributes: ['random-attribute'],
      });
    });
  });

  describe('error states', () => {
    it('can ignore tags', () => {
      expect(`<div>A</div><span>B</span>`).to.equalSnapshot({ ignoreTags: ['span'] });
    });
  });
});
