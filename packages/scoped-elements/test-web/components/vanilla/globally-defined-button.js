export class GloballyDefinedButton extends HTMLElement {
  constructor() {
    super();
    this.color = 'green';
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.shadowRoot.innerHTML = '<button>click</button>';
  }
}

customElements.define('globally-defined-button', GloballyDefinedButton);
