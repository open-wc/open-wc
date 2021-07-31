/* eslint-disable */
import { LitElement, html, css } from 'lit-element';
import './demo-component.js';

// partial css trips up the minifier
const fontSize = css`
  16
`;

const fontMd = css`
  font-size: ${fontSize}px;
`;

class DemoApp extends LitElement {
  static get styles() {
    return css`
      :host {
        display: block;
        color: black;
        background-color: white;
        ${fontMd}
      }
    `;
  }

  render() {
    return html`
      <p>Demo app</p>
      <demo-component></demo-component>
      <lazy-component></lazy-component>
    `;
  }
}

customElements.define('demo-app', DemoApp);

const stylesToBeMinified = css`
  .foo {
    color: 16px;
  }
`;

const partialCSS = DemoApp.styles.cssText.replace(/\s/g, '');
const foo = { bar: 'lorem ipsum' };
const loremIpsum = undefined;

async function asyncFunction() {
  await new Promise(resolve => setTimeout(resolve, 1));
  return true;
}

async function asyncFunction2() {
  return 'x';
}

console.log(asyncFunction2);

function forOf() {
  const map = new Map();
  map.set('a', 1);
  map.set('2', 2);
  let total = 0;
  for (const [k, v] of map) {
    total += v;
  }
  return total;
}

const myAsyncIterable = {
  async *[Symbol.asyncIterator]() {
    yield 1;
    yield 2;
    yield 3;
  },
};
function getAsyncIterated() {
  return new Promise(async resolve => {
    let total = 0;
    for await (const x of myAsyncIterable) {
      total += x;
    }
    resolve(total);
  });
}

window.__startsWith = 'foo'.startsWith('fo');
window.__map = new Map().set('foo', 'bar').get('foo') === 'bar';
window.__asyncFunction = asyncFunction();
window.__forOf = forOf() === 3;
window.__optionalChaining = foo?.bar === 'lorem ipsum' && foo?.bar?.loremIpsum === undefined;
window.__nullishCoalescing = (loremIpsum ?? 'lorem ipsum') === 'lorem ipsum';
window.__asyncIterator = getAsyncIterated().then(r => r === 6);
window.__partialCSS = partialCSS.includes('font-size:16px') && partialCSS.includes('display:block');
window.__minifiedCSS = stylesToBeMinified.cssText === '';
window.__litElement = (async () => {
  await import('./lazy-component.js');
  await customElements.whenDefined('demo-app');
  await customElements.whenDefined('demo-component');
  await customElements.whenDefined('lazy-component');

  const app = document.body.querySelector('demo-app');
  await app.updateComplete;

  const demoComponent = app.shadowRoot.querySelector('demo-component');
  await demoComponent.updateComplete;

  const lazyComponent = app.shadowRoot.querySelector('lazy-component');
  await lazyComponent.updateComplete;

  return (
    app.shadowRoot.innerHTML.includes('Demo app</p>') &&
    demoComponent.shadowRoot.innerHTML.includes('Demo component</p>') &&
    lazyComponent.shadowRoot.innerHTML.includes('Lazy component</p>')
  );
})();
