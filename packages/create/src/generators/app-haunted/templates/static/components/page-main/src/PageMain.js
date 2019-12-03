import { html } from 'lit-html';
import { component } from 'haunted';

function PageMainElement() {
  const title = this.title || 'Hello open-wc world!';
  const logo = this.logo || html``;

  return html`
    <style>
      :host {
        display: block;
        padding: 25px;
        text-align: center;
      }
      svg {
        animation: app-logo-spin infinite 20s linear;
      }
      @keyframes app-logo-spin {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(360deg);
        }
      }
    </style>
    ${logo}
    <h1>${title}</h1>
    <p>Edit <code>src/MyApp.js</code> and save to reload.</p>
    <a
      class="app-link"
      href="https://open-wc.org/developing/#examples"
      target="_blank"
      rel="noopener noreferrer"
    >
      Code examples
    </a>
  `;
}

export const PageMain = component(PageMainElement);