import { LitElement, html } from 'lit';
import { ScopedElementsMixin } from '../../../lit-element.js';

export class LazyLoading extends ScopedElementsMixin(LitElement) {
  async load() {
    const { LazyButton } = await import('../vanilla/LazyButton.js');
    this.registry.define('lazy-button', LazyButton);
  }

  render() {
    return html`<lazy-button></lazy-button>`;
  }
}
