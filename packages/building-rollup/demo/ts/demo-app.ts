import { LitElement, html, customElement } from 'lit-element';

const msg: string = 'Typescript demo works';

@customElement('demo-app')
class DemoApp extends LitElement {
  render() {
    return html`
      ${msg}

      <div id="demo">Demo</div>
    `;
  }
  
  firstUpdated() {
    const demoElement = this.shadowRoot?.getElementById('demo');
    demoElement.innerText = 'Demo updated!';
  }
}
