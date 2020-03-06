import { html } from 'lit-html';
import '../src/<%= tagName %>.js';

export default {
  title: '<%= tagName %>',
};

export const App = () =>
  html`
    <<%= tagName %>></<%= tagName %>>
  `;
