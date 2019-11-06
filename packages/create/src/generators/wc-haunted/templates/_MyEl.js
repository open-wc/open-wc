import { html } from 'lit-html';
import { component, useEffect, useState } from 'haunted';

const defaultTitle = 'Hey there';

function <%= className %>Element() {
  const [count, setCount] = useState(this.counter || 5);
  useEffect(() => {
    if (!this.hasAttribute('title')) {
      this.setAttribute('title', defaultTitle);
    }
  });
  useEffect(() => {
    this.counter = count;
  }, [count]);

  return html`
    <style>
      :host {
        display: block;
        padding: 25px;
      }
    </style>
    <h2>${this.getAttribute('title') || defaultTitle} Nr. ${count}!</h2>
    <button @click=${() => setCount(count + 1)}>increment</button>
  `;
}

<%= className %>Element.observedAttributes = ['title'];

export const <%= className %> = component(<%= className %>Element);