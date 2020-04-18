import { expect, html, fixture } from '@open-wc/testing';
import { stub } from 'sinon';
import { render } from 'lit-html';
import { spread } from '../src/spread.js';

describe('spread', () => {
  let wrapper;
  beforeEach(async () => {
    wrapper = await fixture(document.createElement('div'));
  });

  function renderSpread(data) {
    render(html` <div ...=${spread(data)}></div> `, wrapper);
    return wrapper.firstElementChild;
  }

  it('can render undefined', async () => {
    renderSpread(undefined);
  });

  it('can render null', async () => {
    renderSpread(null);
  });

  describe('properties', () => {
    it('sets properties on an element', async () => {
      const element = renderSpread({ '.foo': 'bar', '.lorem': 'ipsum' });
      expect(element.foo).to.equal('bar');
      expect(element.lorem).to.equal('ipsum');
    });

    it('can change value in subsequent renders', async () => {
      let element = renderSpread({ '.foo': 'bar' });
      expect(element.foo).to.equal('bar');

      element = renderSpread({ '.foo': 'buz' });
      expect(element.foo).to.equal('buz');

      element = renderSpread({ '.foo': undefined });
      expect(element.foo).to.equal(undefined);
    });

    it('can add properties in subsequent renders', async () => {
      let element = renderSpread({ '.foo': 'bar' });
      expect(element.foo).to.equal('bar');

      element = renderSpread({ '.foo': 'bar', '.lorem': 'ipsum' });
      expect(element.foo).to.equal('bar');
      expect(element.lorem).to.equal('ipsum');
    });

    it('can remove properties in subsequent renders', async () => {
      let element = renderSpread({ '.foo': 'bar', '.lorem': 'ipsum' });
      expect(element.foo).to.equal('bar');
      expect(element.lorem).to.equal('ipsum');

      element = renderSpread({ '.foo': 'bar' });
      expect(element.foo).to.equal('bar');
      expect(element.lorem).to.equal(undefined);
    });

    it('can remove properties when rendering to undefined', async () => {
      let element = renderSpread({ '.foo': 'bar' });
      expect(element.foo).to.equal('bar');

      element = renderSpread();
      expect(element.foo).to.equal(undefined);
    });
  });

  describe('attributes', () => {
    it('sets attributes on an element', async () => {
      const element = renderSpread({ foo: 'bar', lorem: 'ipsum' });
      expect(element.getAttribute('foo')).to.equal('bar');
      expect(element.getAttribute('lorem')).to.equal('ipsum');
    });

    it('can change value in subsequent renders', async () => {
      let element = renderSpread({ foo: 'bar' });
      expect(element.getAttribute('foo')).to.equal('bar');

      element = renderSpread({ foo: 'buz' });
      expect(element.getAttribute('foo')).to.equal('buz');
    });

    it('removes the attribute if it is null or undefined', async () => {
      let element = renderSpread({ foo: 'bar' });
      expect(element.getAttribute('foo')).to.equal('bar');

      element = renderSpread({ foo: undefined });
      expect(element.hasAttribute('foo')).to.equal(false);

      element = renderSpread({ foo: null });
      expect(element.hasAttribute('foo')).to.equal(false);
    });

    it('can add attributes in subsequent renders', async () => {
      let element = renderSpread({ foo: 'bar' });
      expect(element.getAttribute('foo')).to.equal('bar');

      element = renderSpread({ foo: 'bar', lorem: 'ipsum' });
      expect(element.getAttribute('foo')).to.equal('bar');
      expect(element.getAttribute('lorem')).to.equal('ipsum');
    });

    it('can remove attributes in subsequent renders', async () => {
      let element = renderSpread({ foo: 'bar', lorem: 'ipsum' });
      expect(element.getAttribute('foo')).to.equal('bar');
      expect(element.getAttribute('lorem')).to.equal('ipsum');

      element = renderSpread({ foo: 'bar' });
      expect(element.getAttribute('foo')).to.equal('bar');
      expect(element.getAttribute('lorem')).to.equal(null);
    });

    it('removes attributes when rendering to undefined', async () => {
      let element = renderSpread({ foo: 'bar' });
      expect(element.getAttribute('foo')).to.equal('bar');

      element = renderSpread(undefined);
      expect(element.getAttribute('foo')).to.equal(null);
    });
  });

  describe('boolean attributes', () => {
    it('sets boolean attributes on an element', async () => {
      const element = renderSpread({ '?foo': true, '?lorem': false, '?x': true });
      expect(element.hasAttribute('foo')).to.equal(true);
      expect(element.hasAttribute('lorem')).to.equal(false);
      expect(element.hasAttribute('x')).to.equal(true);
    });

    it('can change value in subsequent renders', async () => {
      let element = renderSpread({ '?foo': true });
      expect(element.hasAttribute('foo')).to.equal(true);

      element = renderSpread({ '?foo': false });
      expect(element.hasAttribute('foo')).to.equal(false);
    });

    it('can add attributes in subsequent renders', async () => {
      let element = renderSpread({ '?foo': true, '?lorem': false });
      expect(element.hasAttribute('foo')).to.equal(true);
      expect(element.hasAttribute('lorem')).to.equal(false);

      element = renderSpread({ '?foo': true, '?lorem': false, '?x': true });
      expect(element.hasAttribute('foo')).to.equal(true);
      expect(element.hasAttribute('lorem')).to.equal(false);
      expect(element.hasAttribute('x')).to.equal(true);
    });

    it('can remove attributes in subsequent renders', async () => {
      let element = renderSpread({ '?foo': true });
      expect(element.hasAttribute('foo')).to.equal(true);

      element = renderSpread({});
      expect(element.hasAttribute('foo')).to.equal(false);
    });

    it('removes attributes when rendering to undefined', async () => {
      let element = renderSpread({ '?foo': true });
      expect(element.hasAttribute('foo')).to.equal(true);

      element = renderSpread(undefined);
      expect(element.hasAttribute('foo')).to.equal(false);
    });
  });

  describe('event listeners', () => {
    it('adds event listeners to an element', async () => {
      const eventHandlerA = stub();
      const eventHandlerB = stub();

      const element = renderSpread({ '@my-event-a': eventHandlerA, '@my-event-b': eventHandlerB });
      element.dispatchEvent(new Event('my-event-a'));
      element.dispatchEvent(new Event('my-event-b'));

      expect(eventHandlerA.calledOnce).to.equal(true);
      expect(eventHandlerB.calledOnce).to.equal(true);
    });

    it('can change event listeners in subsequent renders, deregistering the earlier listener', async () => {
      const eventHandlerA = stub();
      const eventHandlerB = stub();

      let element = renderSpread({ '@my-event-a': eventHandlerA });
      element.dispatchEvent(new Event('my-event-a'));
      expect(eventHandlerA.calledOnce).to.equal(true);

      element = renderSpread({ '@my-event-a': eventHandlerB });
      element.dispatchEvent(new Event('my-event-a'));
      expect(eventHandlerA.calledOnce).to.equal(true);
      expect(eventHandlerB.calledOnce).to.equal(true);
    });

    it('can add listeners in subsequent renders', async () => {
      const eventHandlerA = stub();
      const eventHandlerB = stub();

      let element = renderSpread({ '@my-event-a': eventHandlerA });

      element.dispatchEvent(new Event('my-event-a'));
      expect(eventHandlerA.calledOnce).to.equal(true);

      element = renderSpread({ '@my-event-a': eventHandlerA, '@my-event-b': eventHandlerB });

      element.dispatchEvent(new Event('my-event-a'));
      element.dispatchEvent(new Event('my-event-b'));
      expect(eventHandlerA.calledTwice).to.equal(true);
      expect(eventHandlerB.calledOnce).to.equal(true);
    });

    it('can remove listeners in subsequent renders', async () => {
      const eventHandlerA = stub();
      const eventHandlerB = stub();

      let element = renderSpread({ '@my-event-a': eventHandlerA, '@my-event-b': eventHandlerB });

      element.dispatchEvent(new Event('my-event-a'));
      element.dispatchEvent(new Event('my-event-b'));
      expect(eventHandlerA.calledOnce).to.equal(true);
      expect(eventHandlerB.calledOnce).to.equal(true);

      element = renderSpread({ '@my-event-a': eventHandlerA });

      element.dispatchEvent(new Event('my-event-a'));
      expect(eventHandlerA.calledTwice).to.equal(true);
      expect(eventHandlerB.calledOnce).to.equal(true);
    });

    it('removes listeners when rendering to undefined', async () => {
      const eventHandlerA = stub();

      let element = renderSpread({ '@my-event-a': eventHandlerA });

      element.dispatchEvent(new Event('my-event-a'));
      expect(eventHandlerA.calledOnce).to.equal(true);

      element = renderSpread(undefined);

      element.dispatchEvent(new Event('my-event-a'));
      expect(eventHandlerA.calledOnce).to.equal(true);
    });
  });

  describe('mixed', () => {
    it('can render a mix of types', () => {
      const eventHandler = stub();
      const element = renderSpread({
        foo: 'bar',
        '.foo': 'bar',
        '?bar': true,
        '@foo': eventHandler,
      });

      element.dispatchEvent(new Event('foo'));
      expect(element.foo).to.equal('bar');
      expect(element.getAttribute('foo')).to.equal('bar');
      expect(element.hasAttribute('bar')).to.equal(true);
      expect(eventHandler.calledOnce).to.equal(true);
    });
  });
});
