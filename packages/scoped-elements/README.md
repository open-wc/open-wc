# Scoped elements

[//]: # 'AUTO INSERT HEADER PREPUBLISH'

Complex Web Component applications often are developed by several teams across
organizations. In that scenario is common that shared component libraries are
used by teams to create an homogeneous look and feel or just to avoid creating
the same components several times, but as those libraries evolve name collision
problems between different versions of the same library appear because teams are
not able to evolve their code at the same velocity. That causes bottlenecks in
software delivery that should be managed by the teams and complex build systems
trying to alleviate the problem.

[Scoped Custom Element Registries](https://github.com/w3c/webcomponents/issues/716)
is a proposal that will solve this problem, but until it is ready or we could
use a polyfill, we have to scope the custom element tag names if we want to use
different versions of them in our code. This package allows you to forget about
how custom elements are defined, registering and scoping their tag names if it is
necessary, avoiding the name collision problem.

## Installation

```bash
npm i --save @open-wc/scoped-elements
```

## How it works

`createScopedHtml` is going to define the custom element classes and creates a
unique scoped tag for each of them if needed. In case those classes were
previously defined then it's going to return the previous defined tag.

Then, the `html` function provided by the `createScopedHtml` method is going to
transform the template literal into another one replacing the tags used by the
user by the ones defined by the custom elements. Finally, the transformed
template literal is going to be processed by `lit-html`.

`<my-button>${this.text}</my-button>` --> `<my-button-3>${this.text}</my-button-3>`

## How to use it

1. Import the `createScopedHtml` from `@open-wc/scoped-elements`.

   ```js
   import { createScopedHtml } from '@open-wc/scoped-elements';
   ```

2. Import the classes of the components you want to use.

   ```js
   import MyButton from './MyButton.js';
   import MyPanel from './MyPanel.js';
   ```

3. Create the `html` function defining the tags you want to use for the
   components.

   ```js
   const html = createScopedHtml({
     'my-button': MyButton,
     'my-panel': MyPanel,
   });
   ```

4. Use your components in your html.

   ```js
   render() {
     return html`
       <my-panel class="my-panel">
         <my-button>${this.text}</my-button>
       </my-panel}>
     `;
   }
   ```

### Complete example

```js
import { css, LitElement } from 'lit-element';
import { createScopedHtml } from '@open-wc/scoped-elements';
import MyButton from './MyButton.js';
import MyPanel from './MyPanel.js';

const html = createScopedHtml({
  'my-button': MyButton, // <-- bind the element with a tag in your html
  'my-panel': MyPanel,
});

export default class MyElement extends LitElement {
  static get styles() {
    return css`
      .my-panel {
        padding: 10px;
        background-color: grey;
      }
    `;
  }

  static get properties() {
    return {
      text: String,
    };
  }

  render() {
    return html`
      <my-panel class="my-panel">
        <my-button>${this.text}</my-button>
      </my-panel}>
    `;
  }
}
```

## When to use it

If you are creating a custom element that depend on other custom elements then
you should use `@open-wc/scoped-elements` to forget about how those custom
elements are defined in the registry and which tags are using.

```js
// MyElement.js
import { LitElement } from 'lit-element';
import { createScopedHtml } from '@open-wc/scoped-elements'; // <-- import the autoDefine and html functions
import MyButton from './MyButton.js'; // your custom element depends on it

const html = createScopedHtml({ 'my-button': MyButton });

export default class MyElement extends LitElement {
  render() {
    return html`
      <my-button>Click me!</my-button>
    `;
  }
}
```

## When not to use it

If you are developing a custom element that doesn't depend on other custom
elements then you shouldn't use it. The reason for that is because there is a
small performance penalty for using it, and it's better to avoid it if you can.

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

## Performance

We are using [Tachometer](https://github.com/Polymer/tachometer) to measure the
performance penalty of using the scoped elements feature. The chosen test
application is a slight variation of [Polymer Shop Application](https://shop.polymer-project.org).

This is an example of the results obtained running the performance test.

```
⠋ Auto-sample 150 (timeout in 13m37s)

┌─────────────┬──────────────┐
│     Version │ <none>       │
├─────────────┼──────────────┤
│     Browser │ chrome       │
│             │ 79.0.3945.88 │
├─────────────┼──────────────┤
│ Sample size │ 200          │
└─────────────┴──────────────┘

┌─────────────────┬────────────┬─────────────────────┬─────────────────┬────────────────────┐
│ Benchmark       │ Bytes      │            Avg time │  vs lit-element │ vs scoped-elements │
├─────────────────┼────────────┼─────────────────────┼─────────────────┼────────────────────┤
│ lit-element     │ 185.99 KiB │ 110.89ms - 117.84ms │                 │             faster │
│                 │            │                     │        -        │            0% - 8% │
│                 │            │                     │                 │     0.13ms - 9.6ms │
├─────────────────┼────────────┼─────────────────────┼─────────────────┼────────────────────┤
│ scoped-elements │ 190.12 KiB │ 116.02ms - 122.44ms │          slower │                    │
│                 │            │                     │         0% - 8% │           -        │
│                 │            │                     │ 0.13ms - 9.60ms │                    │
└─────────────────┴────────────┴─────────────────────┴─────────────────┴────────────────────┘
```

## Special thanks

This package was initially inspired by [carehtml](https://github.com/bashmish/carehtml) and I would like to
thank [@bashmish](https://github.com/bashmish) for his work on it.
Also I would thank [@daKmoR](https://github.com/daKmoR) and [@LarsDenBakker](https://github.com/LarsDenBakker)
by their support and patience.

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
