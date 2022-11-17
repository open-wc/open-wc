# Development >> Scoped Elements ||40

Scope element tag names avoiding naming collision and allowing to use different versions of the same web component in your code.

## Installation

```bash
npm i --save @open-wc/scoped-elements@next
```

<inline-notification type="warning">

Version 2 of Scoped Elements only supports [lit](https://lit.dev/) with `lit-element 3.x`. If you need to support `lit-element 2.x` be sure to use [version 1](https://www.npmjs.com/package/@open-wc/scoped-elements/v/1.3.3) of Scoped Elements.

</inline-notification>

## Usage

1. Import `ScopedElementsMixin` from `@open-wc/scoped-elements`.

   ```js
   import { ScopedElementsMixin } from '@open-wc/scoped-elements';
   ```

2. Import the classes of the components you want to use.

   ```js
   import { MyButton } from './MyButton.js';
   import { MyPanel } from './MyPanel.js';
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

   <inline-notification type="warning">

   If you are going to use elements that are globally defined you have to declare them in `scopedElements` as well. This is required because we are trying to work as close as possible to the future Scoped Custom Element Registries feature and, by the moment, there is not going to be inheritance between registries.
   You can declare them like in the following example:

   ```js
   static get scopedElements() {
     return {
       'old-button': customElements.get('old-button'),
       'my-panel': MyPanel,
     };
   }
   ```

   </inline-notification>

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

5. (optional) load the polyfill if you need scoping

   Defining sub elements via `scopedElements` is very useful on its own as it makes it clear what your element requires. However, if you need the actual scoping feature for example to use two major version or two different classes with the same tag name ,then you will need to load a polyfill.

   We recommend [@webcomponents/scoped-custom-element-registry](https://github.com/webcomponents/polyfills/tree/master/packages/scoped-custom-element-registry).

   You need to load the polyfill before any other web component gets registered.

   It may look something like this in your HTML

   ```html
   <script src="/node_modules/@webcomponents/scoped-custom-element-registry/scoped-custom-element-registry.min.js"></script>
   ```

   or if you have an SPA you can load it at the top of your app shell code

   ```js
   import '@webcomponents/scoped-custom-element-registry';
   ```

   <inline-notification type="tip">

   As long as you only use one version of a web component ScopeElementsMixin will work without the polyfill. So start of without the polyfill. Once you need it, ScopeElementsMixin will log an error.

   ```
   You are trying to re-register the "feature-a" custom element with a different class via ScopedElementsMixin.
   This is only possible with a CustomElementRegistry.
   Your browser does not support this feature so you will need to load a polyfill for it.
   Load "@webcomponents/scoped-custom-element-registry" before you register ANY web component to the global customElements registry.
   e.g. add "<script src="/node_modules/@webcomponents/scoped-custom-element-registry/scoped-custom-element-registry.min.js"></script>" as your first script tag.
   For more details you can visit https://open-wc.org/docs/development/scoped-elements/
   ```

   </inline-notification>

### Complete example

```js
import { css, LitElement } from 'lit';
import { ScopedElementsMixin } from '@open-wc/scoped-elements';
import { MyButton } from './MyButton.js';
import { MyPanel } from './MyPanel.js';

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

### Creating elements

If you use the `render` function of your lit component then it will automatically use the scoped registry as it will be defined within its shadow root.

```js
render() {
  return html`
    <my-button>${this.text}</my-button>
  `;
}
```

When creating components outside of the render function you will need to be explicit in which scope you want to define it.

```js
initElements() {
  // creating a `my-button` element in the global scope
  const myButton = document.createElement('my-button');
  //                                       👆 may fail if my-button is only registered in the scoped registry

  // create a `my-button` element in the local scope
  const myButton = this.shadowRoot.createElement('my-button');
  //                              👆 this only works with the polyfill

  this.appendChild(myButton);
}
```

Additionally when using the ScopedElementMixin it may use the global or local scope depending on if the polyfill is loaded.
We added a helper `createScopedElement` you can use to create scoped elements.

```js
initElements() {
  const myButton = this.createScopedElement('my-button');
  this.appendChild(myButton);
}
```

### Lazy scoped components

In some situations may happen that you want to use a component in your templates that is not already loaded at the moment of defining the scoped elements map. The `ScopedElementsMixin` provides the `defineScopedElement` method to define scoped elements at any time.

```js
import { LitElement } from 'lit';
import { ScopedElementsMixin } from '@open-wc/scoped-elements';
import { MyPanel } from './MyPanel.js';

export class MyElement extends ScopedElementsMixin(LitElement) {
  static get scopedElements() {
    return {
      'my-panel': MyPanel,
    };
  }

  constructor() {
    super();

    import('./MyButton.js').then(({ MyButton }) => this.defineScopedElement('my-button', MyButton));
  }

  render() {
    return html`
      <my-panel class="panel">
        <my-button>${this.text}</my-button>
      </my-panel>
    `;
  }
}
```

### Using a registry per component instance

By default, `ScopedElementsMixin` shares the same `CustomElementsRegistry` instance between all the instances of the same component class. There are some use cases in which you need to have just one registry instance per component instance. For those cases, you can override the `get` and `set` methods for the registry assigning and retrieving it from the component instance.

```js
import { LitElement } from 'lit';
import { ScopedElementsMixin } from '@open-wc/scoped-elements';
import { MyPanel } from './MyPanel.js';

export class MyElement extends ScopedElementsMixin(LitElement) {
  static get scopedElements() {
    return {
      'my-panel': MyPanel,
    };
  }

  get registry() {
    return this.__registry;
  }

  set registry(registry) {
    this.__registry = registry;
  }

  constructor() {
    super();

    import('./MyButton.js').then(({ MyButton }) => this.defineScopedElement('my-button', MyButton));
  }

  render() {
    return html`
      <my-panel class="panel">
        <my-button>${this.text}</my-button>
      </my-panel>
    `;
  }
}
```

## Motivation

Complex Web Component applications are often developed by several teams across organizations. In that scenario it is common that shared component libraries are used by teams to create a homogeneous look and feel or just to avoid creating the same components multiple times, but as those libraries evolve problems between different versions of the same library may appear, as teams may not be able to evolve and update their code at the same velocity. This causes bottlenecks in software delivery that should be managed by the teams and complex build systems, to try to alleviate the problem.

[Scoped Custom Element Registries](https://github.com/w3c/webcomponents/issues/716) is a proposal that will solve this problem, but until it is ready, or a polyfill becomes available, we have to _scope_ custom element tag names if we want to use different versions of those custom elements in our code. This package allows you to forget about how custom elements are defined, registered and scopes their tag names if it is necessary, and avoids the name collision problem.

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

## Limitations

1. Components imported via npm **SHOULD NOT** be self registering components. If a shared component (installed from npm) does not offer an export to the class alone, without the registration side effect, then this component may not be used. E.g. every component that calls `customElement.define`

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

2. Every component that uses sub components should use `scoped-elements`. Any import to a self registering component can potentially result in a browser exception - completely breaking the whole application
3. Imported elements should be fully side effect free (not only element registration)
4. Using the `scoped registry polyfill` may result in a small performance degradation
5. Loading of duplicate/similar source code (most breaking releases are not a total rewrite) should always be a temporary solution
6. Often, temporary solutions tend to become more permanent. Be sure to focus on keeping the lifecycle of nested dependencies short

```js script
import '@rocket/launch/inline-notification/inline-notification.js';
```
