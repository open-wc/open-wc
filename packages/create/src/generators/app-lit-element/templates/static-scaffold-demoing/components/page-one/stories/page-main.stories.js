import { html } from 'lit-html';

export default {
  title: 'page-one',
};

export const NoTitle = () =>
  html`
    <page-one></page-one>
  `;

export const WithTitle = () =>
  html`
    <page-one .title=${'Hello World'}></page-one>
  `;
