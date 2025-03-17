import { ScopedElementsMixin } from '../../../html-element.js';

export class LazyLoading extends ScopedElementsMixin(HTMLElement) {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  loaded = new Promise(r => {
    this.__resolve = r;
  });

  async connectedCallback() {
    const { LazyButton } = await import('./LazyButton.js');
    this.registry.define('lazy-button', LazyButton);
    const lazyButton = this.shadowRoot.createElement('lazy-button');
    this.shadowRoot.appendChild(lazyButton);
    this.__resolve();
  }
}
