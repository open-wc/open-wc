import { LitElement, customElement, html } from 'lit';
import './todo-list.js';

@customElement('todo-app')
class TodoApp extends LitElement {
  render() {
    return html`
      <h1>Todo app</h1>
      <todo-list></todo-list>
    `;
  }
}
