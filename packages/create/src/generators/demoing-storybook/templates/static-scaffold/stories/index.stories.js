import { storiesOf, html, withKnobs, withClassPropertiesKnobs } from '@open-wc/demoing-storybook';

import { <%= className %> } from '../src/<%= className %>.js';
import '../src/<%= tagName %>.js';

storiesOf('<%= tagName %>', module)
  .addDecorator(withKnobs)
  .add('Documentation', () => withClassPropertiesKnobs(<%= className %>))
  .add(
    'Alternative Title',
    () => html`
      <<%= tagName %> .title=${'Something else'}></<%= tagName %>>
    `,
  );
