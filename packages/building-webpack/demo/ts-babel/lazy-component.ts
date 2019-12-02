import { LitElement, html, css, customElement } from 'lit-element';

@customElement('lazy-component')
class LazyComponent extends LitElement {
  static styles = css`
    p {
      color: red;
    }
  `;

  render() {
    return html`
      <p>Lazy component</p>
    `;
  }
}
