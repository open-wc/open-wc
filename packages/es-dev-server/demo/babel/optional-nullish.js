import { html, render } from 'lit-html';

const object = {};

render(
  html`
    <p>${object?.foo?.bar ?? 'Babel can compile optional chaining and nullish coalescing'} ✓</p>
  `,
  document.getElementById('optional-nullish'),
);
