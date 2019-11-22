import { html, render } from 'lit-html';

render(
  html`
    <p>.mjs takes priority over .js ✓</p>
  `,
  document.getElementById('extension-priority'),
);
