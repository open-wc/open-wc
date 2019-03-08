import { LitElement, html } from 'lit-element';

class DemoApp extends LitElement {
  render() {
    return html`
      <h1>Hello typescript!</h1>
    `;
  }
}

customElements.define('demo-app', DemoApp);