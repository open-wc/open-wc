import { html, render } from 'lit-html';
import { LitElement, property, TemplateResult, customElement } from 'lit-element';

function getMessage(): string {
  const message: string = 'A web component written in typescript compiles correctly';
  return message;
}

@customElement('my-element')
class MyElement extends LitElement {
  @property({ type: String })
  message: string = 'world';

  render(): TemplateResult {
    return html`
      Hello ${this.message}
    `;
  }
}

const myElement = document.createElement('my-element');

window.__litElement = (
  myElement.message === 'world' &&
  myElement.render() instanceof TemplateResult &&
  getMessage() === 'A web component written in typescript compiles correctly'
);