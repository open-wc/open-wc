import {
  storiesOf,
  html,
} from '@open-wc/storybook';

import '../<%= tagName %>.js';

storiesOf('<%= tagName %>', module)
  .add('default', () => html`
    <<%= tagName %>>user content tag: <%= tagName %></<%= tagName %>>
  `)
  .add('right', () => html`
    <<%= tagName %> class="right">user content tag: <%= tagName %></<%= tagName %>>
  `);
