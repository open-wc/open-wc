import { LitElement, css, html } from 'lit-element';

import 'page-a/page-a.js';
import 'page-b/page-b.js';

class DemoApp extends LitElement {
  static get properties() {
    return {
      page: { type: String },
    };
  }

  static get styles() {
    return css`
      :host {
        display: block;
        max-width: 680px;
        margin: 0 auto;
      }

      nav {
        padding: 0 10px 10px 10px;
      }

      button {
        border: none;
        padding: 1rem 2rem;
        background: #0069ed;
        color: #fff;
        font-size: 1rem;
        cursor: pointer;
        text-align: center;
        transition: background 250ms ease-in-out, transform 150ms ease;
      }

      button:hover,
      button:focus {
        background: #0053ba;
      }

      button:focus {
        outline: 1px solid #fff;
        outline-offset: -4px;
      }

      button:active {
        transform: scale(0.99);
      }

      button.active {
        background: #33a43f;
      }

      h1 {
        text-align: center;
      }
    `;
  }

  constructor() {
    super();
    this.page = 'A';
  }

  render() {
    return html`
      <h1>Demo App</h1>
      <nav>
        <button class=${this.page === 'A' ? 'active' : ''} @click=${() => (this.page = 'A')}>
          Page A
        </button>
        <button class=${this.page === 'B' ? 'active' : ''} @click=${() => (this.page = 'B')}>
          Page B
        </button>
      </nav>
      ${this.page === 'A'
        ? html`
            <page-a></page-a>
          `
        : html`
            <page-b></page-b>
          `}
    `;
  }
}

customElements.define('demo-app', DemoApp);
