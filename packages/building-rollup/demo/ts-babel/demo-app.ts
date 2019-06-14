import { LitElement, html, TemplateResult } from 'lit-element';

class DemoApp extends LitElement {
  render(): TemplateResult {
    return html`
      <h1>Hello typescript!</h1>
    `;
  }
}

customElements.define('demo-app', DemoApp);