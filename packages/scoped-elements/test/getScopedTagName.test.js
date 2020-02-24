import { expect } from '@open-wc/testing';
import { getScopedTagName } from '../src/getScopedTagName.js';

describe('getScopedTagName', () => {
  it('should return the scoped tag name used to define the HTML Element specified by the user tag name', () => {
    class FeatureA extends HTMLElement {}

    const scopedElements = {
      'feature-a': FeatureA,
    };

    const scopedTagName = getScopedTagName('feature-a', scopedElements);

    expect(scopedTagName).to.match(new RegExp(`feature-a-\\d{1,5}`));
  });

  it("should throw an error if tagName isn't recognized", () => {
    expect(() => getScopedTagName('feature-a', {})).to.throw(
      "The tag 'feature-a' is not a registered scoped element. Make sure you add it via static get scopedElements().",
    );
  });
});
