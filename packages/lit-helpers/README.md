# Lit Helpers

[//]: # 'AUTO INSERT HEADER PREPUBLISH'

A library with helpers functions for working with [lit-html](https://lit-html.polymer-project.org/) and [lit-element](https://lit-element.polymer-project.org/)

## Installation

```bash
npm i --save @open-wc/lit-helpers
```

## Spread directives

Spread directives can be used to set an arbitrary collection of properties, attributes or event listeners on an element without knowing all the keys in advance.

The spread directives work by taking in an object of data to spread. Because of `lit-html` syntax, we need one attribute to apply the directive to. It doesn't actually matter what the name of this attribute is, we recommend sticking to the convention of using `...` as the attribute name.

### Regular spread

The regular `spread` directive can be used to set properties, attribute or event listeners. It uses the same syntax as `lit-html` for distinguishing different types of bindings:

```js
import { html, render } from 'lit-html';
import { spread } from '@open-wc/lit-helpers';

render(
  html`
    <div
      ...=${spread({
        'my-attribute': 'foo',
        '?my-boolean-attribute': true
        '.myProperty': { foo: 'bar' },
        '@my-event': () => console.log('my-event fired'),
      })}
    ></div>
  `,
  document.body,
);
```

### Property spread

Because spreading properties is a common use case, you can use the `spreadProps` directive so that you don't need prefix each property with a `.`. This is especially useful when the data comes from external sources.

```js
import { html, render } from 'lit-html';
import { spreadProps } from '@open-wc/lit-helpers';

render(
  html`
    <div ...="${spreadProps({ propertyA: 'a', propertyB: 'b' })}"></div>
  `,
  document.body,
);
```

### Attribute spread

Since `spread` already spreads attribute as the default case, we do not need a separate `spreadAttributes` directive.

### Re-rendering

When re-rendering, values are updated if they changed from the previous value. We use the same strict equality check (`!==`) as `lit-html` for this.

Unlike `lit-html`, when spreading attributes we remove the attribute if it is set to `null` or `undefined`.

If an entry in the spread data is removed, the property is set to undefined, the attribute is removed or the event listener is deregistered.

Example:

```js
function renderSpread(data) {
  render(
    html`
      <div ...="${spread(data)}"></div>
    `,
    document.body,
  );
}

// result: <div foo="bar">
renderSpread({ foo: 'bar' });

// result: <div foo="buz">
renderSpread({ foo: 'buz' });

// result: <div foo="buz" lorem="ipsum">
renderSpread({ foo: 'buz', lorem: 'ipsum' });

// result: <div foo="buz">
renderSpread({ foo: 'buz' });

// result: <div>
renderSpread({ foo: undefined' });
```

<script>
  export default {
    mounted() {
      const editLink = document.querySelector('.edit-link a');
      if (editLink) {
        const url = editLink.href;
        editLink.href = url.substr(0, url.indexOf('/master/')) + '/master/packages/testing-helpers/README.md';
      }
    }
  }
</script>
