import { html } from 'lit-html';
import '../out-tsc/src/<%= tagName %>.js';

export default {
  title: '<%= tagName %>',
};

export const App = () =>
  html`
    <<%= tagName %>></<%= tagName %>>
  `;
