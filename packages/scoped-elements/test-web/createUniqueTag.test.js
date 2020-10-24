import { expect } from '@open-wc/testing';
import { createUniqueTag } from '../src/createUniqueTag.js';

describe('createUniqueTag', () => {
  it('should throw an error if tagName is invalid', () => {
    expect(() => createUniqueTag(undefined)).to.throw(/tagName is invalid/);
    expect(() => createUniqueTag('')).to.throw(/tagName is invalid/);
    expect(() => createUniqueTag(' ')).to.throw(/tagName is invalid/);
    expect(() => createUniqueTag('mustafar')).to.throw(/tagName is invalid/);
    expect(() => createUniqueTag('NAL-HUTTA')).to.throw(/tagName is invalid/);
  });

  it('should return a valid tag name', () => {
    const tagName = 'nal-hutta';
    const tag = createUniqueTag(`${tagName}`);

    expect(tag).to.match(new RegExp(`${tagName}-\\d{1,5}`));
  });
});
