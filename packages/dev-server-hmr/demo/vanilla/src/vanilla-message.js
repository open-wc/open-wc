import { BaseClass } from './BaseClass.js';

class VanillaMessage extends BaseClass {
  static observedAttributes = ['message'];

  constructor() {
    super();
    this.message = '';
  }

  attributeChangedCallback(name, oldValue, newValue) {
    this[name] = newValue;
  }

  set message(value) {
    this._message = value;
    this.update();
  }

  get message() {
    return this._message;
  }

  styles() {
    return `
      p { 
        color: blue;
      }
    `;
  }

  render() {
    return `
      <p>Message: ${this.message}</p>
    `;
  }
}

customElements.define('vanilla-message', VanillaMessage);
