import {
  html,
  litHtmlFixture,
  unsafeStatic,
} from '../index.js';

describe('html', () => {
  it('renders dynamic tags', async () => {
    const tag = unsafeStatic('my-foo');
    const el = await litHtmlFixture(html`
      <${tag} .myNumber=${4} foo="bar"></${tag}>
    `);
    expect(el.tagName).to.equal('MY-FOO');
    expect(el.myNumber).to.equal(4);
    expect(el.getAttribute('foo')).to.equal('bar');
  });

  it('renders static templates', async () => {
    const el = await litHtmlFixture(html`
      <div></div>
    `);
    expect(el.tagName).to.equal('DIV');
  });

  it('renders static templates with properties, attributes', async () => {
    const el = await litHtmlFixture(html`
      <div .myNumber=${4} foo="bar"></div>
    `);
    expect(el.tagName).to.equal('DIV');
    expect(el.myNumber).to.equal(4);
    expect(el.getAttribute('foo')).to.equal('bar');
  });
});
