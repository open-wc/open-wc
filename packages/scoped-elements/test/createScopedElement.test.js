import { expect } from '@open-wc/testing';
import { createScopedElement } from '../src/createScopedElement.js';

describe('createScopedElement', () => {
  it('should create the scoped HTML element specified by the tag name', () => {
    class FeatureA extends HTMLElement {}

    const scopedElements = {
      'feature-a': FeatureA,
    };

    const el = createScopedElement('feature-a', scopedElements);

    expect(el).to.be.an.instanceOf(FeatureA);
    expect(el.tagName.toLowerCase()).to.match(new RegExp(`feature-a-\\d{1,5}`));
  });

  it("should throw an error if tagName isn't recognized", () => {
    expect(() => createScopedElement('feature-a', {})).to.throw(
      "The tag 'feature-a' is not a registered scoped element. Make sure you add it via static get scopedElements().",
    );
  });
});
