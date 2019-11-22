import { html, render } from 'lit-html';
import { LitElement, property, TemplateResult, customElement } from 'lit-element';

function getMessage(): string {
  const message: string = 'A web component written in typescript compiles correctly';
  return message;
}

@customElement('my-element')
class MyElement extends LitElement {

  constructor() {
    super();

    render(
      html`
        <p>${getMessage()} ✓</p>
      `,
      document.getElementById('web-component'),
    );
  }

  @property({ type: String })
  message: string = 'world';

  render(): TemplateResult {
    return html`
      Hello ${this.message}
    `;
  }
}

render(
  html`
    <p>A module written in typescript compiles correctly ✓</p>
  `,
  document.getElementById('module'),
);
