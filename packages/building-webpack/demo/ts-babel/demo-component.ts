/* eslint-disable class-methods-use-this, import/no-extraneous-dependencies */
import { LitElement, html, css, customElement } from 'lit-element';

@customElement('demo-component')
class DemoComponent extends LitElement {
  static styles = css`
    p {
      color: blue;
    }
  `;

  render() {
    return html`
      <p>Demo component</p>
    `;
  }
}
