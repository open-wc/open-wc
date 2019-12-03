import { html } from '../../index.js';

import '../demo-wc-card.js';

export default {
  title: 'Demo Card|Component Story Format',
  component: 'demo-wc-card',
};

export const heading = () =>
  html`
    <h1>Hello World</h1>
    <input type="text" />
  `;

export const card = () =>
  html`
    <demo-wc-card>Hello World</demo-wc-card>
  `;
