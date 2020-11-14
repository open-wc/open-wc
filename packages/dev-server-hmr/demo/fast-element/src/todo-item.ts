import { FASTElement, customElement, observable, html, css } from '@microsoft/fast-element';

const styles = css`
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

const template = html<TodoItem>`
  <div>
    <input
      id="checkbox"
      type="checkbox"
      :checked=${x => x.checked}
      @change=${(x, c) => x._onCheckedChanged(c.event)}
    />
    <label for="checkbox" class="message">${x => x.message}</label>
  </div>
  <button class="delete" aria-label="Delete" @click=${x => x._onDelete()}>❌</button>
`;

@customElement({ name: 'todo-item', template, styles })
class TodoItem extends FASTElement {
  @observable checked = false;
  @observable message = '';

  _onCheckedChanged(e: Event) {
    this.dispatchEvent(
      new CustomEvent('checked-changed', { detail: (e.target as HTMLInputElement).checked }),
    );
  }

  _onDelete() {
    this.dispatchEvent(new Event('delete'));
  }
}
