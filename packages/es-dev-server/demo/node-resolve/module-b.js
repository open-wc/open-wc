/* eslint-disable */
import { html, render } from 'lit-html';
import './module-c';

export const foo = () => 'module b foo';

console.log('module b');
console.log('lit-html', html);

render(
  html`
    <strong>module b loaded correctlyX</strong>
  `,
  document.getElementById('app'),
);
