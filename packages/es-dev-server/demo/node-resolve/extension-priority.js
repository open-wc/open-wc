import { html, render } from 'lit-html';

render(
  html`
    <p style="color: red">Error: .js file loaded instead of .mjs ✓</p>
  `,
  document.getElementById('extension-priority'),
);
