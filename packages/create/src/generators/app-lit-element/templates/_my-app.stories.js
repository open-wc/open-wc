import { html } from 'lit-html';
import '../<%= tagName %>.js';

export default {
  title: '<%= tagName %>',
};

export const App = () =>
  html`
    <<%= tagName %>></<%= tagName %>>
  `;
