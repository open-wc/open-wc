import { LitElement, html } from 'lit-element';

class DemoApp extends LitElement {
  render() {
    return html`
      <!-- foo -->
      <!-- bar -->
    `;
  }
}

customElements.define('demo-app', DemoApp);
