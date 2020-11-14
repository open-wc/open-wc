import { BaseClass } from './BaseClass.js';

export class VanillaElementBase extends BaseClass {
  styles() {
    return `
      .base { 
        color: blue;
      }
    `;
  }

  render() {
    return `
      <p class="base">Vanilla element base</p>
    `;
  }
}
