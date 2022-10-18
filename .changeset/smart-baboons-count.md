---
"@open-wc/lit-helpers": minor
---

Add "spread", "spreadEvents", and "spreadProps" directives to support spreading objects of data onto elements in a `lit-html` template literal.

Example of `spread`:
```js
import { spread } from '@open-wc/lit-helpers';

const elementTemplate = (
  obj = {
    'my-attribute': 'foo',
    '?my-boolean-attribute': true,
    '@my-event': () => console.log('my-event fired'),
    '.myProperty': { foo: 'bar' },
  },
) => html` <custom-element ${spread(obj)}></custom-element> `;
```

Example of `spreadEvents`:
```js
import { spreadEvents } from '@open-wc/lit-helpers';

const elementTemplate = (
  obj = {
    'my-event': () => {
      console.log('my-event');
    },
    'my-other-event': () => {
      console.log('my-other-event');
    },
    'my-additional-event': () => {
      console.log('my-additional-event');
    },
  },
) => html` <custom-element ${spreadEvents(obj)}></custom-element> `;
```

Example of `spreadProps`:
```js
import { spreadProps } from '@open-wc/lit-helpers';

const elementTemplate = (
  obj = {
    string: 'string',
    number: 10,
    array: ['This', 'is', 'an', 'array.'],
    object: {
      foo: 'bar',
      baz: true,
      bar: false,
    },
  },
) => html` <custom-element ${spreadProps(obj)}></custom-element> `;
```

