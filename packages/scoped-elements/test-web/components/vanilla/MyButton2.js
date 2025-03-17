export class MyButton2 extends HTMLElement {
  constructor() {
    super();
    this.color = 'blue';
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.shadowRoot.innerHTML = '<button>click</button>';
  }
}
