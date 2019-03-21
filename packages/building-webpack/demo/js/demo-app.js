/* eslint-disable */
import { LitElement, html, css } from 'lit-element';
import './demo-component.js';
import './meta-url-test.js';

console.log('file name should end with demo/demo-app.js', import.meta.url);

// some simple tests to see if compilation worked
if (!'foo'.startsWith('foo')) {
  throw new Error('startsWith failed');
}

if (!'foo'.endsWith('foo')) {
  throw new Error('startsWith failed');
}

if (new Map().set('foo', 'bar').get('foo') !== 'bar') {
  throw new Error('map failed');
}

async function asyncFunction() {
  await new Promise(resolve => setTimeout(resolve, 500));
}
asyncFunction();
console.log('async function compiled to: ', asyncFunction.toString());

function forOf() {
  const map = new Map();
  map.set('a', 1);
  map.set('2', 2);
  for (const [k, v] of map) {
    console.log(k, v);
  }
}
forOf();
console.log('forOf function compiled to: ', forOf.toString());

class DemoApp extends LitElement {
  static get properties() {
    return {
      _myElementLoaded: { type: Boolean },
    };
  }

  static styles = css`
    :host {
      display: block;
      color: black;
      background-color: white;
    }
  `;

  foo = '123';

  constructor() {
    super();

    this._myElementLoaded = false;
    this.addEventListener('foo-event', e => {
      console.log('foo event fired through multiple shadow roots', e.composedPath());
    });
  }

  render() {
    return html`
      <p>Hello world ${this.foo}</p>

      <button @click="${this._lazyLoad}">Lazy load</button>
      <demo-component></demo-component>

      ${this._myElementLoaded
        ? html`
            <lazy-component></lazy-component>
          `
        : ''}
    `;
  }

  async _lazyLoad() {
    await import('./lazy/lazy-component.js');
    this._myElementLoaded = true;
  }
}

customElements.define('demo-app', DemoApp);
