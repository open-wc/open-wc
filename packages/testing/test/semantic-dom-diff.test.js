import { fixture, expect } from '../index.js';

describe('Plugin: semantic-dom-diff', () => {
  it('can semantically compare dom trees', async () => {
    const el = await fixture(`<div><!-- comment --><h1>${'Hey'}  </h1>  </div>`);
    expect(el).dom.to.equal('<div><h1>Hey</h1></div>');
  });

  it('can compare against a snapshot', async () => {
    const el = await fixture(`<div><!-- comment --><h1>${'Hey'}  </h1>  </div>`);
    expect(el).dom.to.equalSnapshot();
  });
});
