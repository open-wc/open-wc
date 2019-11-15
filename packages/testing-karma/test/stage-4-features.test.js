import { expect } from '@open-wc/testing';
import { bar, asyncFunction, power, Foo, messageTemplate } from '../demo/stage-4-features.js';

describe('stage-4-features', () => {
  it('handles object spread', () => {
    expect(bar).to.eql({ a: 1 });
  });

  it('handles async functions', async () => {
    expect(await asyncFunction()).to.equal('async function');
  });

  it('handles exponentiation operator', async () => {
    expect(await power(2, 4)).to.equal(16);
  });

  it('handles exponentiation operator', async () => {
    expect(new Foo().bar).to.equal('foo');
  });

  it('handles exponentiation operator', async () => {
    expect(messageTemplate('hello world')).to.equal('message: hello world');
  });
});
