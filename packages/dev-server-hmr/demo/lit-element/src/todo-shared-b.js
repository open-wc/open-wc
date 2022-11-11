import { html, css } from 'lit';
import { SharedClass } from './SharedClass';

class TodoSharedB extends SharedClass {
  static get styles() {
    return [
      super.styles,
      css`
        .shared-b {
          color: green;
        }
      `,
    ];
  }

  render() {
    return html`
      <p class="shared-b">TODO Shared B</p>
      ${this.sharedTemplate()}
    `;
  }
}

customElements.define('todo-shared-b', TodoSharedB);
