import { expect, html, fixture } from '@open-wc/testing';
import { render } from 'lit-html';
import { spreadProps } from '../src/spreadProps.js';

describe('spreadProps', () => {
  let wrapper;
  beforeEach(async () => {
    wrapper = await fixture(document.createElement('div'));
  });

  function renderSpread(props) {
    render(
      html`
        <div ...=${spreadProps(props)}></div>
      `,
      wrapper,
    );
    return wrapper.firstElementChild;
  }

  it('sets properties on an element', async () => {
    const element = renderSpread({ foo: 'bar', lorem: 'ipsum' });
    expect(element.foo).to.equal('bar');
    expect(element.lorem).to.equal('ipsum');
  });

  it('can change value in subsequent renders', async () => {
    let element = renderSpread({ foo: 'bar' });
    expect(element.foo).to.equal('bar');

    element = renderSpread({ foo: 'buz' });
    expect(element.foo).to.equal('buz');

    element = renderSpread({ foo: undefined });
    expect(element.foo).to.equal(undefined);
  });

  it('can add properties in subsequent renders', async () => {
    let element = renderSpread({ foo: 'bar' });
    expect(element.foo).to.equal('bar');

    element = renderSpread({ foo: 'bar', lorem: 'ipsum' });
    expect(element.foo).to.equal('bar');
    expect(element.lorem).to.equal('ipsum');
  });

  it('can remove properties in subsequent renders', async () => {
    let element = renderSpread({ foo: 'bar', lorem: 'ipsum' });
    expect(element.foo).to.equal('bar');
    expect(element.lorem).to.equal('ipsum');

    element = renderSpread({ foo: 'bar' });
    expect(element.foo).to.equal('bar');
    expect(element.lorem).to.equal(undefined);
  });

  it('can render undefined', async () => {
    let element = renderSpread(undefined);

    element = renderSpread({ foo: 'bar' });
    expect(element.foo).to.equal('bar');

    element = renderSpread(undefined);
    expect(element.foo).to.equal(undefined);
  });

  it('can render null', async () => {
    let element = renderSpread(null);

    element = renderSpread({ foo: 'bar' });
    expect(element.foo).to.equal('bar');

    element = renderSpread(null);
    expect(element.foo).to.equal(undefined);
  });
});
