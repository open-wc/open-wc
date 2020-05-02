import { html, css, LitElement, property } from 'lit-element';

export class <%= className %> extends LitElement {
  static styles =css`
    :host {
      display: block;
      padding: 25px;
      color: var(--<%= tagName %>-text-color, #000);
    }
  `;

  @property() title: string = 'Hey there';

  @property() counter: number = 5;

  __increment() {
    this.counter += 1;
  }

  render() {
    return html`
      <h2>${this.title} Nr. ${this.counter}!</h2>
      <button @click=${this.__increment}>increment</button>
    `;
  }
}
