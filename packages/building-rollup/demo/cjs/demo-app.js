import { LitElement, html } from 'lit-element';
import { message } from './commonjs-module.js';

class DemoApp extends LitElement {
  render() {
    return html` ${message} `;
  }
}

customElements.define('demo-app', DemoApp);
