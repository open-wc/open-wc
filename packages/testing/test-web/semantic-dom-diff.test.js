import { fixture, expect } from '../index.js';

describe('Plugin - semantic-dom-diff', () => {
  it('can semantically compare full dom trees', async () => {
    const el = await fixture(`<div><!-- comment --><h1>${'Hey'}  </h1>  </div>`);
    expect(el).dom.to.equal('<div><h1>Hey</h1></div>');
  });

  it('can semantically compare lightDom trees', async () => {
    const el = await fixture(`<div><!-- comment --><h1>${'Hey'}  </h1>  </div>`);
    expect(el).lightDom.to.equal('<h1>Hey</h1>');
  });

  // TODO: skipped until web test runner supports snapshots
  it.skip('can compare against a snapshot', async () => {
    const el = await fixture(`<div><!-- comment --><h1>${'Hey'}  </h1>  </div>`);
    expect(el).dom.to.equalSnapshot();
  });
});
