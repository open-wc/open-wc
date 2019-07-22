/* eslint-disable */
import { html, LitElement, property, TemplateResult } from 'lit-element';

export const foo = () => 'module b foo';

console.log('module b');
console.log('lit-html', html);

class MyElement extends LitElement {

  @property({ type: String })
  message = 'world';

  render(): TemplateResult {
    return html`
      Hello ${this.message}
    `;
  }

}

customElements.define('my-element', MyElement);

document.body.appendChild(document.createElement('my-element'));