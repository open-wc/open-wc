import { LitElement, html } from 'lit';
import { sharedTemplate } from './sharedTemplate.js';
import { sharedStyles } from './sharedStyles.js';
import './todo-list.js';
import './todo-shared-a.js';
import './todo-shared-b.js';

class TodoApp extends LitElement {
  static styles = sharedStyles;

  render() {
    return html`
      <h1>Todo app</h1>
      <todo-list></todo-list>
      ${sharedTemplate}
      <todo-shared-a></todo-shared-a>
      <todo-shared-b></todo-shared-b>
    `;
  }
}

customElements.define('todo-app', TodoApp);
