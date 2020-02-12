import { LoggingMixin } from './LoggingMixin.js';

class Page extends LoggingMixin(HTMLElement) {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.name = '';
  }

  connectedCallback() {
    super.connectedCallback();
    this.shadowRoot.innerHTML = `
      <style> 
        :host { display: block; background: ${this.name}; width: 100px; height: 100px; }
      </style>
      <div>
        Page ${this.name}
      </div>
    `;
  }
}

class PageRed extends Page {
  constructor() {
    super();
    this.name = 'Red';
  }
}
customElements.define('page-red', PageRed);

// ****** here we apply the mixin again ******
//                           |
//                           v
class PageGreen extends LoggingMixin(Page) {
  constructor() {
    super();
    this.name = 'Green';
    // following line would give a TypeScript error
    // Argument of type '12' is not assignable to parameter of type 'string'.
    // this.logString(12);
  }
}
customElements.define('page-green', PageGreen);

class PageBlue extends Page {
  constructor() {
    super();
    this.name = 'Blue';
  }
}
customElements.define('page-blue', PageBlue);
