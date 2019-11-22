import { html, render } from 'lit-html';

render(
  html`
    <p>Module imported without extension ✓</p>
  `,
  document.getElementById('no-extension'),
);
