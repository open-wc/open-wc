# Scoped elements

[//]: # 'AUTO INSERT HEADER PREPUBLISH'

:::warning
This is an experimental feature, use it at your own risk and be sure to understand its [limitations](#limitations).
No big applications are using `scoped-elements` yet - so there is no proof yet if it works in production.
This page focuses on in depth explanations as it should help [foster a discussion on scoping](https://github.com/open-wc/open-wc/issues/1262).
:::

Complex Web Component applications are often developed by several teams across organizations. In that scenario it is common that shared component libraries are used by teams to create a homogeneous look and feel or just to avoid creating the same components multiple times, but as those libraries evolve problems between different versions of the same library may appear, as teams may not be able to evolve and update their code at the same velocity. This causes bottlenecks in software delivery that should be managed by the teams and complex build systems, to try to alleviate the problem.

[Scoped Custom Element Registries](https://github.com/w3c/webcomponents/issues/716) is a proposal that will solve this problem, but until it is ready, or a polyfill becomes available, we have to _scope_ custom element tag names if we want to use different versions of those custom elements in our code. This package allows you to forget about how custom elements are defined, registered and scopes their tag names if it is necessary, and avoids the name collision problem.

## Installation

```bash
npm i --save @open-wc/scoped-elements
```

## Use case and demos

Consider the following setup

- **Team Blue** owns **Page A**
- **Team Green** owns **Page B**
- **Team Black** owns **Feature A & B**

1. Everything is good and [your app is live](https://open-wc.org/scoped-elements/demo/before-nesting/) [[code](https://github.com/open-wc/open-wc/tree/master/packages/scoped-elements/demo/before-nesting)] with both pages.
2. **Team Black** releases a new version (**2.x**) of **Feature B** which unfortunately needs to be breaking in order to support new use-cases.
3. **Team Blue** (on **Page A**) does not use any of those new use cases, and they have a tight deadline to meet, so they cannot update right now.
4. **Team Green** (on **Page B**) has to deliver an important functionality to your end users, but they need to upgrade to **Feature B 2.x** since it can only be solved with this new version.
5. Since **Feature A 1.x & 2.x** are both used in the same app, this will lead to nested dependencies, which then will lead to [catastrophic failure, and errors](https://open-wc.org/scoped-elements/demo/no-scope/) [[code](https://github.com/open-wc/open-wc/tree/master/packages/scoped-elements/demo/no-scope)].

Two possible solutions come to mind:

1.  Temporarily (!) allow shipping similar source code (most breaking releases are not a total rewrite) and scope them via `@open-wc/scoped-elements`; see the "fixed" example [with-scope](https://open-wc.org/scoped-elements/demo/with-scope/) [[code](https://github.com/open-wc/open-wc/tree/master/packages/scoped-elements/demo/with-scope)] running with nested dependencies.
2.  Synchronizing updates of shared dependencies - e.g. make sure **Team Blue** & **Team Green** always use the same version when releasing. This can be a viable solution however it comes with a high organizational overhead and is hard to scale up (for 10+ teams)

#### Technical explanation of scenario

The simplified app has the following dependencies

- app
  - page-a
    - feature-a 1.x
    - feature-b 1.x
  - page-b
    - feature-a 2.x
    - feature-b 1.x

which leads to the following node_modules tree

```
├── node_modules
│   ├── feature-a
│   ├── feature-b
│   ├── page-a
│   └── page-b
│       └── node_modules
│           └── feature-a
├── demo-app.js
└── index.html
```

To demonstrate, we made three demos:

1. [before-nesting](https://open-wc.org/scoped-elements/demo/before-nesting/) [[code](https://github.com/open-wc/open-wc/tree/master/packages/scoped-elements/demo/before-nesting)] In this demo, everything works fine as **Page A and B** both are using the same version of **Feature A**

2. [no-scope](https://open-wc.org/scoped-elements/demo/no-scope/) [[code](https://github.com/open-wc/open-wc/tree/master/packages/scoped-elements/demo/no-scope)] **Feature A** version **1.x** and **2.x** are imported via self registering entry points which leads to the following error message, because the `feature-a` component tries to register multiple times:

   ```
   Uncaught DOMException: Failed to execute 'define' on 'CustomElementRegistry': the name "feature-a" has already been used with this registry
     at [...]/node_modules/page-b/node_modules/feature-a/feature-a.js:3:16
   ```

3. [with-scope](https://open-wc.org/scoped-elements/demo/with-scope/) [[code](https://github.com/open-wc/open-wc/tree/master/packages/scoped-elements/demo/with-scope)] This example successfully fixes the problem by using `ScopedElementsMixin` on both **Page A** and **Page B**.

## How it works

`ScopedElementsMixin` is mixed into your LitElement and via `static get scopedElements()` you define the tags and classes you wanna use in your elements template.
Under the hood it changes your template so `<my-button>${this.text}</my-button>` becomes `<my-button-2748>${this.text}</my-button-2748>`.

Every auto-defined scoped elements gets a random\* 4 digit number suffix. This suffix changes every time to make sure developers are not inclined to use it the generated tag name as a styling hook. Additionally the suffix allows scoped-elements and traditional self-defined elements to coexist, avoiding name collision.

\* it is actually a global counter that gets initialized with a random starting number on load

## Usage

1. Import `ScopedElementsMixin` from `@open-wc/scoped-elements`.

   ```js
   import { ScopedElementsMixin } from '@open-wc/scoped-elements';
   ```

2. Import the classes of the components you want to use.

   ```js
   import MyButton from './MyButton.js';
   import MyPanel from './MyPanel.js';
   ```

3. Apply `ScopedElementsMixin` and define the tags you want to use for your components.

   ```js
   class MyElement extends ScopedElementsMixin(LitElement) {
     static get scopedElements() {
       return {
         'my-button': MyButton,
         'my-panel': MyPanel,
       };
     }
   }
   ```

4. Use your components in your html.

   ```js
   render() {
     return html`
       <my-panel class="panel">
         <my-button>${this.text}</my-button>
       </my-panel>
     `;
   }
   ```

### Complete example

```js
import { css, LitElement } from 'lit-element';
import { ScopedElementsMixin } from '@open-wc/scoped-elements';
import MyButton from './MyButton.js';
import MyPanel from './MyPanel.js';

export class MyElement extends ScopedElementsMixin(LitElement) {
  static get scopedElements() {
    return {
      'my-button': MyButton,
      'my-panel': MyPanel,
    };
  }

  static get styles() {
    return css`
      .panel {
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
      <my-panel class="panel">
        <my-button>${this.text}</my-button>
      </my-panel}>
    `;
  }
}
```

## Limitations

1. Components imported via npm **SHOULD NOT** be self registering components. If a shared component (installed from npm) does not offer an export to the class alone, without the registration side effect, then this component may not be used. E.g. every component that calls `customElement.define`.

   ```js
   export class MyEl { ... }
   customElement.define('my-el', MyEl);
   ```

   Or uses the `customElement` typescript decorator

   ```ts
   @customElement('my-el')
   export class MyEl { ... }
   ```

   Only side effects free class exports may be used

   ```js
   export class MyEl { ... }
   ```

2. Every component that uses sub components should use `scoped-elements`. Any import to a self registering component can potentially result in a browser exception - completely breaking the whole application.

3. Imported elements should be fully side effect free (not only element registration)

4. Currently, only `lit-element` is supported (though other elements/rendering engines could be incorporated in the future).

5. You cannot use tag selectors in css, but you could use an id, a class name or even a property instead.

   ```css
   🚫 my-panel {
     width: 300px;
   }
   ✅ .panel {
     width: 300px;
   }
   ```

6. You cannot use tag names using javascript querySelectors, but you could use an id, a class name or even a property instead.

   ```js
   🚫 this.shadowRoot.querySelector('my-panel');
   ✅ this.shadowRoot.querySelector('.panel');
   ```

7. Using `scoped-elements` may result in a performance degradation of up to 8%.
8. Loading of duplicate/similar source code (most breaking releases are not a total rewrite) should always be a temporary solution.
9. Often, temporary solutions tend to become more permanent. Be sure to focus on keeping the lifecycle of nested dependencies short.

## Performance

We are using [Tachometer](https://github.com/Polymer/tachometer) to measure the performance penalty of using the scoped elements feature. The chosen test application is a slight variation of the [Polymer Shop Application](https://shop.polymer-project.org).

This is an example of the results obtained running the performance test.

```
⠋ Auto-sample 560 (timeout in 16m27s)
┌─────────────┬───────────────┐
│     Version │ <none>        │
├─────────────┼───────────────┤
│     Browser │ chrome        │
│             │ 80.0.3987.106 │
├─────────────┼───────────────┤
│ Sample size │ 610           │
└─────────────┴───────────────┘
┌─────────────────────────────┬────────────┬─────────────────────┬─────────────────┬──────────────────────────┐
│ Benchmark                   │ Bytes      │            Avg time │  vs lit-element │ vs scoped-elements-mixin │
├─────────────────────────────┼────────────┼─────────────────────┼─────────────────┼──────────────────────────┤
│ lit-element                 │ 281.24 KiB │ 285.72ms - 286.69ms │                 │                   faster │
│                             │            │                     │        -        │                  2% - 2% │
│                             │            │                     │                 │           5.68ms - 7.1ms │
├─────────────────────────────┼────────────┼─────────────────────┼─────────────────┼──────────────────────────┤
│ scoped-elements-mixin       │ 283.21 KiB │ 292.08ms - 293.11ms │          slower │                          │
│                             │            │                     │         2% - 2% │                 -        │
│                             │            │                     │ 5.68ms - 7.10ms │                          │
└─────────────────────────────┴────────────┴─────────────────────┴─────────────────┴──────────────────────────┘
```

## Special thanks

This package was initially inspired by [carehtml](https://github.com/bashmish/carehtml) and we would like to thank [@bashmish](https://github.com/bashmish) for his work on it.

<script>
  export default {
    mounted() {
      const editLink = document.querySelector('.edit-link a');
      if (editLink) {
        const url = editLink.href;
        editLink.href = url.substr(0, url.indexOf('/master/')) + '/master/packages/scoped-elements/README.md';
      }
    }
  }
</script>
