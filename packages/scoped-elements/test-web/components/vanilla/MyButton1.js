export class MyButton1 extends HTMLElement {
  constructor() {
    super();
    this.color = 'red';
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.shadowRoot.innerHTML = '<button>click</button>';
  }
}
