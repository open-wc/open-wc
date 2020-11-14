import { LitElement, html } from 'lit-element';
import './todo-list.js';

class TodoApp extends LitElement {
  render() {
    return html`
      <h1>Todo app</h1>
      <todo-list></todo-list>
    `;
  }
}

customElements.define('todo-app', TodoApp);
