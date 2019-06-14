export class GetResult extends HTMLElement {
  set success(value) {
    this.__success = value;
    if (this.__success) {
      this.innerHTML = `<p>YEAH</p>`;
    } else {
      this.innerHTML = `<p>NOPE</p>`;
    }
  }

  get success() {
    return this.__success;
  }

  constructor() {
    super();
    this.success = false;
  }
}

customElements.define('get-result', GetResult);
