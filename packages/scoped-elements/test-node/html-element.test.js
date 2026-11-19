import { expect } from 'chai';

describe('html-element', () => {
  it('can be imported in an environment without window', async () => {
    expect(typeof window).to.equal('undefined');

    await import('../html-element.js');

    expect(globalThis.scopedElementsVersions).to.include('3.0.0');
  });
});
