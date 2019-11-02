/* eslint-disable import/extensions */
import { html } from 'lit-html';
import { withKnobs, withWebComponentsKnobs, text } from '../../index.js';

import '../demo-wc-card.js';
import '../fake-input.js';

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
    <button
      @click=${() => {
        document.querySelector('demo-wc-card').header = 'updated';
      }}
    >
      Update header
    </button>
  </demo-wc-card>
`;

export const multipleComponent = () => html`
  <p>By default it will show knobs for all elements of the current "component"</p>
  <demo-wc-card></demo-wc-card>
  <demo-wc-card></demo-wc-card>
`;

export const filterBackSide = () => html`
  <p>
    You can filter specific properties via "parameters.customElements.filterProperties =
    ['backSide']"
  </p>
  <demo-wc-card></demo-wc-card>
  <demo-wc-card></demo-wc-card>
`;

filterBackSide.story = {
  parameters: {
    customElements: {
      filterProperties: ['backSide'],
    },
  },
};

export const debugFocus = () => html`
  <p>
    Focus for example is quite annoying to debug as when you want to look it up in the Developer
    Tools the focus already changed. With displaying the state in the knobs you can see the value
    while interacting with your component.
  </p>
  First Name:
  <fake-input></fake-input><br />
  Last Name:
  <fake-input></fake-input><br />
  Age:
  <fake-input></fake-input><br />
`;

debugFocus.story = {
  parameters: {
    customElements: {
      filterProperties: ['focused'],
      queryString: 'fake-input',
    },
  },
};

export const onlyFirstComponent = () => html`
  <p>
    You can set "parameters.customElements.queryString = 'demo-wc-card:nth-of-type(1)'" to only show
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
