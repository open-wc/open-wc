# Classes in HTML

[//]: # 'AUTO INSERT HEADER PREPUBLISH'

Complex Web Component applications often are developed by several teams across organizations. In that scenario is common
that shared component libraries are used by teams to create an homogeneous look and feel or just to avoid creating the
same components several times, but as those libraries evolve name collision problems between different versions of the
same library appear because teams are not able to evolve their code at the same velocity. That causes bottlenecks in
software delivery that should be managed by the teams and complex build systems trying to alleviate the problem.

[Scoped Custom Element Registries](https://github.com/w3c/webcomponents/issues/716) is a proposal that tries to fix that
problem, but until is ready and we could use a polyfill in those browsers that do not implement it, auto scoping the
custom elements is a workaround.

This package allows you to forget about how the custom elements are defined inside the registry. It's going to register
them for you scoping the name if necessary avoiding the class name collision and allowing you to use different versions
of the same component in yours.

## Installation

```bash
npm i --save @open-wc/classes-in-html
```

## How it works

To use this feature you must import the `html` function from `@open-wc/classes-in-html`, import the custom element
dependency classes and use them in the template literals just like any other parameter.

```js
import { LitElement } from 'lit-element';
import { html } from '@open-wc/classes-in-html'; // <-- import the html function
import MyButton from './MyButton.js'; // <-- import your dependency class

export default class MyElement extends LitElement {
  static get properties() {
    return {
      text: String,
    };
  }

  render() {
    return html`<${MyButton}>${this.text}</${MyButton}>`; // <-- use them just like other parameters
  }
}
```

Internally the library is going to transform the template literal into another template literal which is going to be
processed finally by `lit-html`.

`<${MyButton}>${this.text}</${MyButton}>` --> `<my-button>${this.text}</my-button>`

In case `my-button` was already registered, then `my-button-1` is going to be used and so on.

## When to use

If you are creating a custom element that depends on other custom elements then you should use `classes-in-html` to
forget about how those custom elements on which yours depends are defined in the registry.

```js
// MyElement.js
import { LitElement } from 'lit-element';
import { html } from '@open-wc/classes-in-html';
import MyButton from './MyButton.js'; // your custom element depends on it

export default class MyElement extends LitElement {
  render() {
    return html`
      <${MyButton}>Click me!</${MyButton}>
    `;
  }
}
```

## When not to use

In the case you are developing a custom element that don't depends on other custom elements then you shouldn't use it.
The reason of that is because there is a performance penalty on using it.

```js
// MyButton.js
import { html, LitElement } from 'lit-element';

export default class MyButton extends LitElement {
  render() {
    return html`
      <button><slot></slot></button>
    `;
  }
}
```

## Special thanks

This package is inspired by [carehtml](https://github.com/bashmish/carehtml) and I would like to thank
[@bashmish](https://github.com/bashmish) for his work on it.

<script>
  export default {
    mounted() {
      const editLink = document.querySelector('.edit-link a');
      if (editLink) {
        const url = editLink.href;
        editLink.href = url.substr(0, url.indexOf('/master/')) + '/master/packages/classes-in-html/README.md';
      }
    }
  }
</script>
