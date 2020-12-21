import { html, css } from 'lit-element';
import { SharedClass } from './SharedClass';

class TodoSharedA extends SharedClass {
  static get styles() {
    return [
      super.styles,
      css`
        .shared-a {
          color: red;
        }
      `,
    ];
  }

  render() {
    return html`
      <p class="shared-a">TODO Shared A</p>
      ${this.sharedTemplate()}
    `;
  }
}

customElements.define('todo-shared-a', TodoSharedA);
