## My El

A component that is as young as you are.
Just see for yourself.

<my-el></my-el>

```js script
import { LitElement, html, css } from 'lit-element';

class MyEl extends LitElement {
  static get properties() {
    return {
      age: { type: Number },
    };
  }

  static get styles() {
    return css`
      h1 {
        color: red;
      }
    `;
  }

  constructor() {
    super();
    this.age = 8;
  }

  render() {
    return html`
      <h1>I am ${this.age} years</h1>
      <button @click=${() => (this.age += 1)}>Celebrate</button>
    `;
  }
}

customElements.define('my-el', MyEl);
```
