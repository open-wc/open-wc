import {
  storiesOf,
  html,
  withKnobs,
  select,
  object,
  color,
  addParameters,
  withClassPropertiesKnobs,
} from '../../index.js';

import { MyEl } from '../my-el.js';
// @ts-ignore
import readme from '../README.md';

addParameters({
  options: {
    isFullscreen: false,
    panelPosition: 'right',
  },
});

storiesOf('Demo|Example Element', module)
  .addDecorator(withKnobs)
  .add(
    'Documentation',
    () =>
      withClassPropertiesKnobs(MyEl, {
        overrides: el => [
          { key: 'headerColor', fn: () => color('headerColor', el.headerColor, 'Element') },
          {
            key: 'type',
            fn: () => select('type', ['small', 'medium', 'large'], el.type, 'Element'),
          },
          { key: 'complexItems', fn: () => object('complexItems', el.complexItems, 'Inherited') },
          { key: 'locked', group: 'Security' },
        ],
        template: html`
          <my-el><p>foo</p></my-el>
        `,
      }),
    { notes: { markdown: readme }, options: { selectedPanel: 'storybooks/knobs/panel' } },
  )
  .add(
    'Alternative Header',
    () => html`
      <my-el .header=${'Something else'}></my-el>
    `,
  );
