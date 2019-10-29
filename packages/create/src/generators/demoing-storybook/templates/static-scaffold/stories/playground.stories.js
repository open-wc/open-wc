/* eslint-disable import/extensions */
import { html } from 'lit-html';
import { withKnobs, withWebComponentsKnobs, text } from '@open-wc/demoing-storybook';

import '../<%= tagName %>.js';

export default {
  title: '<%= className %>|Playground',
  component: '<%= tagName %>',
  decorators: [withKnobs, withWebComponentsKnobs],
  parameters: { options: { selectedPanel: 'storybookjs/knobs/panel' } },
};

export const singleComponent = () => html`
  <<%= tagName %>></<%= tagName %>>
`;

export const manualContent = () => html`
  <<%= tagName %>>
    <p>${text('Content', 'Some text', 'Properties')}</p>
  </<%= tagName %>>
`;
