async function message(nr: number): Promise<string> {
  return `Hello typescript! ${nr * 2}`;
}

class DemoApp extends HTMLElement {
  async connectedCallback() {
    const msg = await message(2);

    this.innerHTML = `
      <h1>${msg}</h1>
    `;
  }
}

customElements.define('demo-app', DemoApp);