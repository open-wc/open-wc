import { html, render } from 'lit-html';

render(
  html`
    <p style="color: red;">Error: .js incorrectly resolved over .ts ✓</p>
  `,
  document.getElementById('ts-extension'),
);
