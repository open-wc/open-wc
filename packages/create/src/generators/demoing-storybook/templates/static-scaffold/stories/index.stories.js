import { storiesOf, html, withKnobs, withClassPropertiesKnobs } from '@open-wc/demoing-storybook';

import <%= className %> from '../src/<%= className %>.js';
import '../src/<%= tagName %>.js';

import readme from '../README.md';

storiesOf('<%= tagName %>', module)
  .addDecorator(withKnobs)
  .add('Documentation', () => withClassPropertiesKnobs(<%= className %>), { notes: { markdown: readme } })
  .add(
    'Alternative Header',
    () => html`
      <<%= tagName %> .header=${'Something else'}></<%= tagName %>>
    `,
  );
