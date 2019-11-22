import { html, render } from 'lit-html';

render(
  html`
    <p>Resolving a .ts file takes priority over a .js file ✓</p>
  `,
  document.getElementById('ts-extension'),
);
