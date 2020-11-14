import { FASTElement, customElement, observable, repeat, html, css } from '@microsoft/fast-element';
import { sharedTemplate } from './sharedTemplate';
import { sharedStyles } from './sharedStyles';
import './todo-item.js';

interface TodoItem {
  message: string;
  checked: boolean;
}

const styles = [
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

const template = html<TodoList>`
  <ul>
    ${repeat(
      x => x.items,
      html<TodoItem, TodoList>`
        <li>
          <todo-item
            :message=${x => x.message}
            :checked=${x => x.checked}
            data-i=${(_, c) => c.index}
            @checked-changed=${(_, c) => c.parent._onCheckedChanged(c.event as any)}
            @delete=${(_, c) => c.parent._onDelete(c.event)}
          ></todo-item>
        </li>
      `,
    )}
  </ul>

  <div class="add">
    <input id="input" placeholder="Add a TODO" autocomplete="off" />
    <button @click=${x => x._addTodo()}>
      Add
    </button>
  </div>

  ${sharedTemplate}
`;

@customElement({ name: 'todo-list', template, styles })
class TodoList extends FASTElement {
  @observable items: TodoItem[] = [
    { message: 'Do A', checked: true },
    { message: 'Do B', checked: false },
    { message: 'Do C', checked: true },
    { message: 'Do D', checked: false },
    { message: 'Do E', checked: false },
  ];

  _onCheckedChanged(e: Event & { detail: boolean }) {
    const { i: iString } = (e.target as HTMLElement).dataset;
    const i = Number(iString);
    const item = this.items[i];
    const newItems = this.items.slice();
    newItems.splice(i, 1, { ...item, checked: e.detail });
    this.items = newItems;
  }

  _onDelete(e: Event) {
    const { i: iString } = (e.target as HTMLElement).dataset;
    const i = Number(iString);
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
