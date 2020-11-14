import { FASTElement, customElement, html } from '@microsoft/fast-element';
import './todo-list.js';

const template = html<TodoApp>`
  <h1>Todo app</h1>
  <todo-list></todo-list>
`;

@customElement({
  name: 'todo-app',
  template,
})
class TodoApp extends FASTElement {
  static definition = { name: 'todo-app', template };
}
