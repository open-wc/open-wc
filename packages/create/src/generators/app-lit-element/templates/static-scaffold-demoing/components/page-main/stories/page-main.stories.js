import { html } from 'lit-html';

export default {
  title: 'page-main',
};

export const NoTitle = () =>
  html`
    <page-main></page-main>
  `;

export const WithTitle = () =>
  html`
    <page-main .title=${'Hello World'}></page-main>
  `;
