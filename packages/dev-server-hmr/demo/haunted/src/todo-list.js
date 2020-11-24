import { html } from 'lit-html';
import { component, useState } from 'haunted';
import { sharedTemplate } from './sharedTemplate.js';
import { sharedStyles } from './sharedStyles.js';
import './todo-item.js';

function TodoList() {
  const [items, setItems] = useState([
    { message: 'Do A', checked: true },
    { message: 'Do B', checked: false },
    { message: 'Do C', checked: true },
    { message: 'Do D', checked: false },
    { message: 'Do E', checked: false },
  ]);

  function onCheckedChanged(e) {
    const { i } = e.target.dataset;
    const item = items[i];
    const newItems = items.slice();
    newItems.splice(i, 1, { ...item, checked: e.detail });
    setItems(newItems);
  }

  const onDelete = e => {
    const { i } = e.target.dataset;
    const newItems = items.slice();
    newItems.splice(i, 1);
    setItems(newItems);
  };

  const addTodo = () => {
    const input = this.shadowRoot.getElementById('input');
    const message = input.value;
    if (!message) {
      return;
    }
    input.value = '';
    setItems([...items, { message, checked: false }]);
  };

  return html`
    ${sharedStyles}
    <style>
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
    </style>

    <ul>
      ${items.map(
        (item, i) =>
          html`
            <li>
              <todo-item
                .message=${item.message}
                .checked=${item.checked}
                data-i=${i}
                @checked-changed=${this._onCheckedChanged}
                @delete=${onDelete}
              ></todo-item>
            </li>
          `,
      )}
    </ul>

    <div class="add">
      <input id="input" placeholder="Add a TODO" autocomplete="off" />
      <button @click=${addTodo}>Add</button>
    </div>

    ${sharedTemplate}
  `;
}

customElements.define('todo-list', component(TodoList));
