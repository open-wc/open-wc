import { expect } from './setup.js';
import { html, litFixture, unsafeStatic } from '../index.js';

/**
 * @typedef {Object} ChildType
 * @property {number} myNumber
 *
 * @typedef {Element & ChildType} TestDiv
 */

describe('html', () => {
  it('renders dynamic tags', async () => {
    const tag = unsafeStatic('my-foo');
    const el = /** @type {TestDiv} */ (await litFixture(html`
      <${tag} .myNumber=${4} foo="bar"></${tag}>
    `));
    expect(el.tagName).to.equal('MY-FOO');
    expect(el.myNumber).to.equal(4);
    expect(el.getAttribute('foo')).to.equal('bar');
  });

  it('renders static templates', async () => {
    const el = await litFixture(html` <div></div> `);
    expect(el.tagName).to.equal('DIV');
  });

  it('renders static templates with properties, attributes', async () => {
    const el = /** @type {TestDiv} */ (await litFixture(html`
      <div .myNumber=${4} foo="bar"></div>
    `));
    expect(el.tagName).to.equal('DIV');
    expect(el.myNumber).to.equal(4);
    expect(el.getAttribute('foo')).to.equal('bar');
  });
});
