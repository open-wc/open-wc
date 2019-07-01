/* eslint-disable */
import { html, render } from 'lit-html';

export const foo = () => 'module b foo';

console.log('module b');
console.log('lit-html', html);

render(
  html`
    <strong>module b loaded correctly</strong>
  `,
  document.getElementById('app'),
);
