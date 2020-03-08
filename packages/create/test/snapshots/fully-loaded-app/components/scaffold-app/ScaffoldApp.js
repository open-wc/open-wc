import { LitElement, html, css } from 'lit-element';
import { classMap } from 'lit-html/directives/class-map.js';
import { openWcLogo } from './open-wc-logo.js';

import { aboutTemplate } from './aboutTemplate.js';
import '../page-main/page-main.js';
import '../page-one/page-one.js';

export class ScaffoldApp extends LitElement {
  static get properties() {
    return {
      title: { type: String },
      page: { type: String },
    };
  }

  static get styles() {
    return css`
      :host {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        font-size: calc(10px + 2vmin);
        color: #1a2b42;
        max-width: 960px;
        margin: 0 auto;
      }

      header {
        width: 100%;
        background: #fff;
        border-bottom: 1px solid #ccc;
      }

      header ul {
        display: flex;
        justify-content: space-around;
        min-width: 400px;
        margin: 0 auto;
        padding: 0;
      }

      header ul li {
        display: flex;
      }

      header ul li a {
        color: #5a5c5e;
        text-decoration: none;
        font-size: 18px;
        line-height: 36px;
      }

      header ul li a:hover,
      header ul li a.active {
        color: blue;
      }

      main {
        flex-grow: 1;
      }

      .app-footer {
        font-size: calc(12px + 0.5vmin);
        align-items: center;
      }

      .app-footer a {
        margin-left: 5px;
      }
    `;
  }

  constructor() {
    super();
    this.page = 'main';
  }

  render() {
    return html`
      <header>
        <ul>
          <li>
            <a href="#main" class=${this.__navClass('main')} @click=${this.__onNavClicked}>
              Main
            </a>
          </li>
          <li>
            <a href="#pageOne" class=${this.__navClass('pageOne')} @click=${this.__onNavClicked}>
              Page One
            </a>
          </li>
          <li>
            <a href="#about" class=${this.__navClass('about')} @click=${this.__onNavClicked}>
              About
            </a>
          </li>
        </ul>
      </header>

      <main>
        ${this._renderPage()}
      </main>

      <p class="app-footer">
        🚽 Made with love by
        <a target="_blank" rel="noopener noreferrer" href="https://github.com/open-wc">open-wc</a>.
      </p>
    `;
  }

  _renderPage() {
    switch (this.page) {
      case 'main':
        return html`
          <page-main .logo=${openWcLogo}></page-main>
        `;
      case 'pageOne':
        return html`
          <page-one></page-one>
        `;
      case 'about':
        return aboutTemplate;
      default:
        return html`
          <p>Page not found try going to <a href="#main">Main</a></p>
        `;
    }
  }

  __onNavClicked(ev) {
    ev.preventDefault();
    this.page = ev.target.hash.substring(1);
  }

  __navClass(page) {
    return classMap({ active: this.page === page });
  }
}
