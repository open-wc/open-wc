import { expect, html, fixture } from '@open-wc/testing';
import { spy } from 'sinon';
import { render } from 'lit-html';
import { live } from '../src/live.js';

describe('live', () => {
  before(() => {
    class LitHelpers extends HTMLElement {
      set myProp(value) {
        this._myProp = value;
      }

      get myProp() {
        return this._myProp;
      }
    }

    customElements.define('lit-helpers', LitHelpers);
  });

  describe('property bindings', () => {
    let wrapper;
    beforeEach(async () => {
      wrapper = await fixture(document.createElement('div'));
    });

    function renderLive(value) {
      render(html` <lit-helpers .myProp="${live(value)}"></lit-helpers> `, wrapper);
      return wrapper.firstElementChild;
    }

    it('can render a property', () => {
      const element = renderLive('foo');
      expect(element.myProp).to.equal('foo');
    });

    it('can change property values', () => {
      const element = renderLive('foo');
      renderLive('bar');
      expect(element.myProp).to.equal('bar');
    });

    it('can render to null and undefined', () => {
      const element = renderLive('foo');
      renderLive(null);
      expect(element.myProp).to.equal(null);
      renderLive('bar');
      expect(element.myProp).to.equal('bar');
      renderLive(undefined);
      expect(element.myProp).to.equal(undefined);
    });

    it('can change property values when the value on the element changes', () => {
      const element = renderLive('foo');
      element.myProp = 'bar';
      renderLive('foo');

      expect(element.myProp).to.equal('foo');
    });

    it('does not set property values when the value on the element did not change', () => {
      const element = renderLive(undefined);
      const myPropSpy = /** @type {*} */ (spy(element, 'myProp', ['get', 'set']));
      renderLive('foo');
      expect(myPropSpy.set.callCount).to.equal(1);
      renderLive('bar');
      expect(myPropSpy.set.callCount).to.equal(2);
      renderLive('bar');
      expect(myPropSpy.set.callCount).to.equal(2);
    });
  });

  describe('attribute bindings', () => {
    let wrapper;
    beforeEach(async () => {
      wrapper = await fixture(document.createElement('div'));
    });

    function renderLive(value) {
      render(html` <div my-attr="${live(value)}"></div> `, wrapper);
      return wrapper.firstElementChild;
    }

    it('can render an attribute', () => {
      const element = renderLive('foo');
      expect(element.getAttribute('my-attr')).to.equal('foo');
    });

    it('can change attribute values', () => {
      const element = renderLive('foo');
      renderLive('bar');
      expect(element.getAttribute('my-attr')).to.equal('bar');
    });

    it('can render null and undefined', () => {
      const element = renderLive('foo');
      renderLive(null);
      expect(element.getAttribute('my-attr')).to.equal('null');
      renderLive('bar');
      expect(element.getAttribute('my-attr')).to.equal('bar');
      renderLive(undefined);
      expect(element.getAttribute('my-attr')).to.equal('undefined');
    });

    it('can change attribute values when the value on the element changes', () => {
      const element = renderLive('foo');
      element.setAttribute('my-attr', 'bar');
      renderLive('foo');

      expect(element.getAttribute('my-attr')).to.equal('foo');
    });

    it('does not set attribute values when the value on the element did not change', () => {
      const element = renderLive('');
      const setAttribute = spy(element, 'setAttribute');
      renderLive('foo');
      expect(setAttribute.callCount).to.equal(1);
      renderLive('bar');
      expect(setAttribute.callCount).to.equal(2);
      renderLive('bar');
      expect(setAttribute.callCount).to.equal(2);
    });
  });
});
