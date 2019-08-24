import sinon from 'sinon';
import { expect } from '../index.js';

describe('Plugin: sinon-chai', () => {
  it('can expect a spys callCount', async () => {
    const spy = sinon.spy();
    expect(spy).to.have.callCount(0);
    spy();
    expect(spy).to.have.callCount(1);
  });
});
