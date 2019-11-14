import { html, LitElement, customElement, property } from 'lit-element';

@customElement('my-element')
export class MyElement extends LitElement {
  @property({ type: String })
  msg = 'world';

  render() {
    return html`
      <p>Hello ${this.msg}<p>
    `;
  }
}