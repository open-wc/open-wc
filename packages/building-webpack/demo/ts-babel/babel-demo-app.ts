async function babelMessage(nr: number): Promise<string> {
  return `Hello typescript! ${nr * 2}`;
}

class BabelDemoApp extends HTMLElement {
  async connectedCallback() {
    const msg = await babelMessage(2);

    this.innerHTML = `
      <h1>${msg}</h1>
    `;
  }
}

customElements.define('babel-demo-app', BabelDemoApp);
