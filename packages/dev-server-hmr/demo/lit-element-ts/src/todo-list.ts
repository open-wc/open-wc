import { LitElement, customElement, property, html, css } from 'lit-element';
import { sharedTemplate } from './sharedTemplate';
import { sharedStyles } from './sharedStyles';
import './todo-item.js';

@customElement('todo-list')
class TodoList extends LitElement {
  static get styles() {
    return [
      sharedStyles,
      css`
        ul {
          list-style: none;
          padding-inline-start: 0;
          max-width: 200px;
        }

        .add {
          display: flex;
        }

        .add > * {
          margin-right: 6px;
        }
      `,
    ];
  }

  @property({ type: Array })
  items = [
    { message: 'Do A', checked: true },
    { message: 'Do B', checked: false },
    { message: 'Do C', checked: true },
    { message: 'Do D', checked: false },
    { message: 'Do E', checked: false },
  ];

  render() {
    return html`
      <ul>
        ${this.items.map(
          (item, i) =>
            html`
              <li>
                <todo-item
                  .message=${item.message}
                  .checked=${item.checked}
                  data-i=${i}
                  @checked-changed=${this._onCheckedChanged}
                  @delete=${this._onDelete}
                ></todo-item>
              </li>
            `,
        )}
      </ul>

      <div class="add">
        <input id="input" placeholder="Add a TODO" autocomplete="off" /><button
          @click=${this._addTodo}
        >
          Add
        </button>
      </div>

      ${sharedTemplate}
    `;
  }

  _onCheckedChanged(e: any) {
    const { i } = e.target.dataset;
    const item = this.items[i];
    const newItems = this.items.slice();
    newItems.splice(i, 1, { ...item, checked: e.detail });
    this.items = newItems;
  }

  _onDelete(e) {
    const { i } = e.target.dataset;
    const newItems = this.items.slice();
    newItems.splice(i, 1);
    this.items = newItems;
  }

  _addTodo() {
    const input = this.shadowRoot!.getElementById('input') as HTMLInputElement;
    const message = input.value;
    if (!message) {
      return;
    }
    input.value = '';
    this.items = [...this.items, { message, checked: false }];
  }
}
