import { html } from 'lit-html';
import { component } from 'haunted';

function TodoItem({ checked, message }) {
  const onCheckedChanged = e => {
    this.dispatchEvent(new CustomEvent('checked-changed', { detail: e.target.checked }));
  };

  const onDelete = () => {
    this.dispatchEvent(new Event('delete'));
  };

  return html`
    <style>
      :host {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .message {
        color: blue;
      }

      .delete {
        border: none;
        width: auto;
        background: transparent;
        font-size: 12px;
        padding: 6px 4px;
      }
    </style>

    <div>
      <input id="checkbox" type="checkbox" .checked=${!!checked} @change=${onCheckedChanged} />
      <label for="checkbox" class="message">${message}</label>
    </div>
    <button class="delete" aria-label="Delete" @click=${onDelete}>❌</button>
  `;
}

customElements.define('todo-item', component(TodoItem));
