import { VanillaElementBase } from './VanillaElementBase.js';

class VanillaElement extends VanillaElementBase {
  styles() {
    return `
      ${super.styles()}

      .element { 
        color: red;
      }
    `;
  }

  render() {
    return `
      ${super.render()}
      <p class="element">Vanilla element</p>
    `;
  }
}

customElements.define('vanilla-element', VanillaElement);
