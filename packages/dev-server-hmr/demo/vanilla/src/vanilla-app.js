import { BaseClass } from './BaseClass.js';
import { sharedTemplate } from './sharedTemplate.js';
import { sharedStyles } from './sharedStyles.js';
import './vanilla-message.js';
import './vanilla-element.js';

class VanillaApp extends BaseClass {
  styles() {
    return `
      ${sharedStyles}

      h1 { 
        color: blue;
      }
    `;
  }

  render() {
    return `
      <h1>Vanilla app</h1>
      ${sharedTemplate}

      <vanilla-message message="Hello"></vanilla-message>
      <vanilla-message message="World"></vanilla-message>
      <vanilla-message message="Goodbye"></vanilla-message>

      <vanilla-element></vanilla-element>
    `;
  }
}

customElements.define('vanilla-app', VanillaApp);
