import {
  storiesOf,
  html,
} from '@open-wc/storybook';

import { opts } from './index.stories.options.js';
import '../<%= props.tagName %>.js';

storiesOf(`${opts.header}`, module)
  .add('default', () => html`
    <${opts.tag}>user content tag: ${opts.tag}</${opts.tag}>
  `)
  .add('right', () => html`
    <${opts.tag} class="right">user content tag: ${opts.tag}</${opts.tag}>
  `);
