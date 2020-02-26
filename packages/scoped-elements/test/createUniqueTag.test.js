import { expect } from '@open-wc/testing';
import { createUniqueTag } from '../src/createUniqueTag.js';

describe('createUniqueTag', () => {
  it('should throw an error if tagName is invalid', () => {
    expect(() => createUniqueTag(customElements, undefined)).to.throw(/tagName is invalid/);
    expect(() => createUniqueTag(customElements, '')).to.throw(/tagName is invalid/);
    expect(() => createUniqueTag(customElements, ' ')).to.throw(/tagName is invalid/);
    expect(() => createUniqueTag(customElements, 'mustafar')).to.throw(/tagName is invalid/);
    expect(() => createUniqueTag(customElements, 'NAL-HUTTA')).to.throw(/tagName is invalid/);
  });

  it('should return a valid tag name', () => {
    const tagName = 'nal-hutta';
    const tag = createUniqueTag(customElements, `${tagName}`);

    expect(tag).to.match(new RegExp(`${tagName}-\\d{1,5}`));
  });
});
