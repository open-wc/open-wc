import { LitElement, property, customElement, html, css } from 'lit';

@customElement('todo-item')
class TodoItem extends LitElement {
  static get styles() {
    return css`
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
    `;
  }

  @property({ type: Boolean })
  checked = false;
  @property({ type: String })
  message?: string;

  render() {
    return html`
      <div>
        <input
          id="checkbox"
          type="checkbox"
          .checked=${!!this.checked}
          @change=${this._onCheckedChanged}
        />
        <label for="checkbox" class="message">${this.message}</label>
      </div>

      <button class="delete" aria-label="Delete" @click=${this._onDelete}>❌</button>
    `;
  }

  _onCheckedChanged(e: any) {
    this.dispatchEvent(new CustomEvent('checked-changed', { detail: e.target.checked }));
  }

  _onDelete() {
    this.dispatchEvent(new Event('delete'));
  }
}
