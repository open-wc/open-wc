/* eslint-disable import/extensions */
import { html } from 'lit-html';
import { withKnobs, withWebComponentsKnobs, text } from '../../index.js';

import '../demo-wc-card.js';

export default {
  title: 'Card|Playground',
  component: 'demo-wc-card',
  decorators: [withKnobs, withWebComponentsKnobs],
  parameters: { options: { selectedPanel: 'storybookjs/knobs/panel' } },
};

export const singleComponent = () => html`
  <demo-wc-card></demo-wc-card>
`;

export const manualContent = () => html`
  <demo-wc-card>
    <p>${text('Content', 'Some text', 'Properties')}</p>
  </demo-wc-card>
`;

export const multipleComponent = () => html`
  <p>By default it will show knobs for all elements of the current "component"</p>
  <demo-wc-card></demo-wc-card>
  <demo-wc-card></demo-wc-card>
`;

export const onlyFirstComponent = () => html`
  <p>
    You can set "parameters.customElements.queryString = 'demo-wc-card:nth-of-type(1)' to only show
    knobs for a specific element"
  </p>
  <demo-wc-card></demo-wc-card>
  <demo-wc-card></demo-wc-card>
`;

onlyFirstComponent.story = {
  parameters: {
    customElements: {
      queryString: 'demo-wc-card:nth-of-type(1)',
    },
  },
};
