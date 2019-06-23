import { html, fixture, litFixture, expect } from '../../index.js';

import '../src/get-result.js';

describe('True Checking', () => {
  it('is false by default', async () => {
    /** @type {import('../src/get-result.js').GetResult} */
    const el = await fixture('<get-result></get-result>');
    expect(el.success).to.be.false;
  });

  it('false values will have a light-dom of <p>NOPE</p>', async () => {
    const el = await fixture('<get-result></get-result>');
    expect(el).dom.to.equal('<get-result><p>NOPE</p></get-result>');
  });

  it('true values will have a light-dom of <p>YEAH</p>', async () => {
    const foo = 1;
    const el = await litFixture(
      html`
        <get-result .success=${foo === 1}></get-result>
      `,
    );
    // @ts-ignore
    expect(el.success).to.be.true;
    expect(el).dom.to.equal('<get-result><p>YEAH</p></get-result>');
  });
});
