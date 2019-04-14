/* eslint-disable class-methods-use-this, import/no-extraneous-dependencies */
import { LitElement, html, css } from 'lit-element';

class DemoComponent extends LitElement {
  static get properties() {
    return {
      myProperty: { type: String },
    };
  }

  static get styles() {
    return css`
      p {
        color: blue;
      }
    `;
  }

  /** @type {string} */
  myProperty = null;

  render() {
    return html`
      <p>Demo component, myProperty is: ${this.myProperty}</p>
    `;
  }

  firstUpdated() {
    this.shadowRoot
      .querySelector('p')
      .dispatchEvent(new CustomEvent('foo-event', { bubbles: true, composed: true }));
  }
}

customElements.define('demo-component', DemoComponent);
