import { expect } from '@open-wc/testing';
import { wrap } from '../src/wrap.js';

describe('wrap', () => {
  it('passes strings and values as tagged templates expect', () => {
    let calledCount = 0;
    let calledArgs;
    const html = wrap((...args) => {
      calledCount += 1;
      calledArgs = args;
    });
    class MyLily extends HTMLElement {}

    html`<${MyLily} id="${'my-id'}">${'my text'}</${MyLily}>`;
    expect(calledCount).to.equal(1);
    expect(calledArgs).to.deep.equal([['<my-lily id="', '">', '</my-lily>'], 'my-id', 'my text']);
  });

  it('integrates with lit-html', async () => {
    const { html: litHtml, TemplateResult, render } = await import('lit-html');

    const html = wrap(litHtml);
    class MyAzalea extends HTMLElement {}

    const template = html`<${MyAzalea} id="${'my-id'}">${'my text'}</${MyAzalea}>`;
    expect(template).to.be.instanceof(TemplateResult);

    const fixture = document.createElement('div');
    document.body.appendChild(fixture);
    render(template, fixture);

    const el = fixture.children[0];

    expect(el).to.be.instanceof(MyAzalea);
    expect(el.getAttribute('id')).to.equal('my-id');
    expect(el.textContent).to.equal('my text');

    document.body.removeChild(fixture);
  });
});
