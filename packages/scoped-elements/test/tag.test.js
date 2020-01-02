import { expect } from '@open-wc/testing';
import { createUniqueTag } from '../src/tag.js';

describe('tags', () => {
  describe('createUniqueTag', () => {
    it('should create a valid tag name for an anonymous class', () => {
      const tag = createUniqueTag(customElements, class extends HTMLElement {});

      expect(tag).to.match(/[a-z][a-z0-9-\\._]*-[a-z0-9-\\._]*/);
    });

    it('should add a prefix if name is no valid', () => {
      expect(createUniqueTag(customElements, class Mustafar extends HTMLElement {})).to.be.equal(
        'c-mustafar',
      );
      expect(createUniqueTag(customElements, class _Sample2 extends HTMLElement {})).to.be.equal(
        'c-sample2',
      );
    });

    it('should return the name in dash case if is valid', () => {
      expect(createUniqueTag(customElements, class MonCalamari extends HTMLElement {})).to.be.equal(
        'mon-calamari',
      );
    });

    it('should return the name in dash case and a counter if is valid and is already registered', () => {
      customElements.define('nal-hutta', class extends HTMLElement {});

      expect(createUniqueTag(customElements, class NalHutta extends HTMLElement {})).to.match(
        /nal-hutta-\d+/,
      );
    });
  });
});
