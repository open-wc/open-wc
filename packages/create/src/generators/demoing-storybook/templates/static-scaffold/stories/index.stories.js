import { storiesOf, html, withKnobs, withClassPropertiesKnobs, addParameters } from '@open-wc/demoing-storybook';

import { <%= className %> } from '../src/<%= className %>.js';
import '../<%= tagName %>.js';

storiesOf('<%= tagName %>', module)
  .addDecorator(withKnobs)
  .addParameters({
    backgrounds: [{ name: 'lightgrey', value: '#d3d3d3' }, { name: 'teal', value: '#008080' }],
  })
  .add('Documentation', () => withClassPropertiesKnobs(<%= className %>))
  .add(
    'Alternative Title',
    () => html`
      <<%= tagName %> .title=${'Something else'}></<%= tagName %>>
    `,
  );
