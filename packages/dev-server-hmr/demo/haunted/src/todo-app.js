import { html } from 'lit';
import { component } from 'haunted';

import './todo-list.js';

function TodoApp() {
  return html`
    <h1>Todo app</h1>
    <todo-list></todo-list>
  `;
}

customElements.define('todo-app', component(TodoApp));
