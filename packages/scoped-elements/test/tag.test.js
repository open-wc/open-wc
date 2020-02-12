import { expect } from '@open-wc/testing';
import { createUniqueTag } from '../src/tag.js';

describe('tags', () => {
  describe('createUniqueTag', () => {
    it('should throw an error if tagName is invalid', () => {
      expect(() => createUniqueTag(customElements)).to.throw(/tagName is invalid/);
      expect(() => createUniqueTag(customElements, '')).to.throw(/tagName is invalid/);
      expect(() => createUniqueTag(customElements, ' ')).to.throw(/tagName is invalid/);
      expect(() => createUniqueTag(customElements, 'mustafar')).to.throw(/tagName is invalid/);
      expect(() => createUniqueTag(customElements, 'NAL-HUTTA')).to.throw(/tagName is invalid/);
    });

    it('should return a valid tag name', () => {
      const tagName = 'nal-hutta';
      const tag = createUniqueTag(customElements, `${tagName}`);

      expect(tag).to.equal(`${tagName}`);
    });

    it('should increment a counter if tag is already registered', () => {
      const tagName = 'mon-calamari';

      customElements.define(`${tagName}`, class extends HTMLElement {});
      // eslint-disable-next-line wc/no-invalid-element-name
      customElements.define(`${tagName}-1`, class extends HTMLElement {});
      // eslint-disable-next-line wc/no-invalid-element-name
      customElements.define(`${tagName}-2`, class extends HTMLElement {});

      const tag = createUniqueTag(customElements, `${tagName}`);

      expect(tag).to.equal(`${tagName}-3`);
    });
  });
});
