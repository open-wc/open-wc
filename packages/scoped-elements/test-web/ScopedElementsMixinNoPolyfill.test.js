import { expect, fixture, defineCE } from '@open-wc/testing';
import { LitElement, html } from 'lit';
import { runScopedElementsMixinSuite } from './runScopedElementsMixinSuite.js';

import { ScopedElementsMixin } from '../index.js';

runScopedElementsMixinSuite({
  label: 'ScopedElementsMixin features NOT needing a real scope [no polyfill loaded]',
});

class OriginalFeature extends LitElement {
  render() {
    return html` <div>Original Feature</div> `;
  }
}

class FeatureReDeclared extends LitElement {
  render() {
    return html` <div>Feature ReDeclared</div> `;
  }
}

describe('ScopedElementsMixin missing polyfill', () => {
  it('logs an error if actual scoping is needed and the polyfill is not loaded', async () => {
    const tag = defineCE(
      class extends ScopedElementsMixin(LitElement) {
        static get scopedElements() {
          return {
            'original-feature': OriginalFeature,
          };
        }

        render() {
          return html` <original-feature></original-feature> `;
        }
      },
    );

    const tag2 = defineCE(
      class extends ScopedElementsMixin(LitElement) {
        static get scopedElements() {
          return {
            'original-feature': FeatureReDeclared,
          };
        }

        render() {
          return html` <original-feature></original-feature> `;
        }
      },
    );

    const originalConsole = console;
    const capture = [];
    console.error = msg => {
      capture.push(msg);
    };

    await fixture(`<${tag}></${tag}><${tag2}></${tag2}>`);

    expect(capture).to.deep.equal([
      [
        `You are trying to re-register the "original-feature" custom element with a different class via ScopedElementsMixin.`,
        'This is only possible with a CustomElementRegistry.',
        'Your browser does not support this feature so you will need to load a polyfill for it.',
        'Load "@webcomponents/scoped-custom-element-registry" before you register ANY web component to the global customElements registry.',
        'e.g. add "<script src="/node_modules/@webcomponents/scoped-custom-element-registry/scoped-custom-element-registry.min.js"></script>" as your first script tag.',
        'For more details you can visit https://open-wc.org/docs/development/scoped-elements/',
      ].join('\n'),
    ]);

    console.error = originalConsole.error;
  });

  it('logs an error if actual scoping is needed and the polyfill is not loaded when lazy defining an element', async () => {
    const tag = defineCE(
      class extends ScopedElementsMixin(LitElement) {
        static get scopedElements() {
          return {
            'original-feature': OriginalFeature,
          };
        }

        render() {
          return html` <original-feature></original-feature> `;
        }
      },
    );

    const tag2 = defineCE(
      class extends ScopedElementsMixin(LitElement) {
        render() {
          return html` <original-feature></original-feature> `;
        }
      },
    );

    const originalConsole = console;
    const capture = [];
    console.error = msg => {
      capture.push(msg);
    };

    const wrapper = await fixture(`<div><${tag}></${tag}><${tag2}></${tag2}></div>`);
    const [el1, el2] = wrapper.children;
    expect(el1.shadowRoot.children[0]).to.be.an.instanceOf(OriginalFeature);

    el2.defineScopedElement('original-feature', FeatureReDeclared);

    expect(capture).to.deep.equal([
      [
        `You are trying to re-register the "original-feature" custom element with a different class via ScopedElementsMixin.`,
        'This is only possible with a CustomElementRegistry.',
        'Your browser does not support this feature so you will need to load a polyfill for it.',
        'Load "@webcomponents/scoped-custom-element-registry" before you register ANY web component to the global customElements registry.',
        'e.g. add "<script src="/node_modules/@webcomponents/scoped-custom-element-registry/scoped-custom-element-registry.min.js"></script>" as your first script tag.',
        'For more details you can visit https://open-wc.org/docs/development/scoped-elements/',
      ].join('\n'),
    ]);

    console.error = originalConsole.error;
  });
});
