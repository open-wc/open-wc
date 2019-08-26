/* eslint-disable */
import { html, LitElement, property, TemplateResult, customElement } from 'lit-element';

export const foo = () => 'module b foo';

console.log('module b');
console.log('lit-html', html);

@customElement('my-element')
class MyElement extends LitElement {

  @property({ type: String })
  message = 'world';

  render(): TemplateResult {
    return html`
      Hello ${this.message}
    `;
  }

}

document.body.appendChild(document.createElement('my-element'));