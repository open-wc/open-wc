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

const cssText = DemoApp.styles.cssText.replace(/\s/g, '');
const foo = { bar: 'lorem ipsum' };
const loremIpsum = undefined;

window.__optionalChaining = foo?.bar === 'lorem ipsum' && foo?.bar?.loremIpsum === undefined;
window.__nullishCoalescing = (loremIpsum ?? 'lorem ipsum') === 'lorem ipsum';
window.__partialCSS = cssText.includes('font-size:16px') && cssText.includes('display:block');
window.__litElement = (async () => {
  await import('./lazy-component.js');
  const app = document.body.querySelector('demo-app');
  const demoComponent = app.shadowRoot.querySelector('demo-component');
  const lazyComponent = app.shadowRoot.querySelector('lazy-component');

  return (
    app.shadowRoot.innerHTML.includes('<p>Demo app</p>') &&
    demoComponent.shadowRoot.innerHTML.includes('<p>Demo component</p>') &&
    lazyComponent.shadowRoot.innerHTML.includes('<p>Lazy component</p>')
  );
})();
