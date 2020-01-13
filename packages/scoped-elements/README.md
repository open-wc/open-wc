# Scoped elements

[//]: # 'AUTO INSERT HEADER PREPUBLISH'

:::warning
This is an experimental feature use it at your own risk and be sure to understand it's [limitations](#limitations).
No bigger applications is using `scoped-elements` - so there is no prove yet if it works in production.
This page focuses a lot on in depth explanations as it should help foster a discussion on scoping.
:::

Complex Web Component applications often are developed by several teams across organizations.
In that scenario is common that shared component libraries are used by teams to create an
homogeneous look and feel or just to avoid creating the same components several times,
but as those libraries evolve problems between different versions of the same library appear
as teams are not able to evolve their code at the same velocity.
That causes bottlenecks in software delivery that should be managed by the teams and complex
build systems trying to alleviate the problem.

[Scoped Custom Element Registries](https://github.com/w3c/webcomponents/issues/716) is a proposal that will solve this problem,
but until it is ready or we could use a polyfill, we have to scope the custom element tag names if we want to use different versions of them in our code.
This package allows you to forget about how custom elements are defined, registering and scoping their tag names if it is necessary, avoiding the name collision problem.

## Installation

```bash
npm i --save @open-wc/scoped-elements
```

## Use case and demos

Consider the following setup

- Team Blue own Page A
- Team Green own Page B
- Team Black own Feature A & B

1. Everything is good and [your app is live](https://open-wc.org/scoped-elements/demo/before-nesting/) [[code](https://github.com/open-wc/open-wc/tree/master/packages/scoped-elements/demo/before-nesting)] with both pages.
2. Team Black releases a new version (2.x) of Feature B which unfortunately needs to be breaking in order to support new use-cases.
3. Team Blue (on Page A) does not use any of those new use cases and they have a tight deadline to meet so they can not update right now.
4. Team Green (on Page B) has to deliver an important functionality to your end users but they need to upgrade to Feature B 2.x as it can only be solved with this new version.
5. As Feature A 1x & 2x are both used in the same app it will get installed nested which will lead to [catastrophic failure]https://open-wc.org/scoped-elements./demo/no-scoping/) [[code](https://github.com/open-wc/open-wc/tree/master/packages/scoped-elements/demo/no-scope)]. Two possible solutions come to mind:
   1. Synchronizing updates of shared dependencies - e.g. make sure Team Blue & Green always us the same version when releasing. This can be a viable solution however it comes with a high organizational overhead and is hard to scale up (for 10+ teams)
   2. Temporarily (!) allow to ship similar source code (most breaking releases are not a total rewrite) and scope them via `@open-wc/scoped-elements` => see "fixed" [with-scope](https://open-wc.org/scoped-elements/demo/with-scoping/) [[code](https://github.com/open-wc/open-wc/tree/master/packages/scoped-elements/demo/with-scope)] running with nested dependencies.

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

So there are 3 demos:

1. [before-nesting](https://open-wc.org/scoped-elements/demo/before-nesting/) [[code](https://github.com/open-wc/open-wc/tree/master/packages/scoped-elements/demo/before-nesting)] everything fine as Page A/B both are using the same version of Feature A

2. [no-scope](https://open-wc.org/scoped-elements/demo/no-scoping/) [[code](https://github.com/open-wc/open-wc/tree/master/packages/scoped-elements/demo/no-scope)] Feature A version 1.x and 2.x are imported via self registering entry points which leads to the following error message as "feature-a" tries to register multiple times

   ```
   Uncaught DOMException: Failed to execute 'define' on 'CustomElementRegistry': the name "feature-a" has already been used with this registry
     at [...]/node_modules/page-b/node_modules/feature-a/feature-a.js:3:16
   ```

3. [with-scope](https://open-wc.org/scoped-elements/demo/with-scoping/) [[code](https://github.com/open-wc/open-wc/tree/master/packages/scoped-elements/demo/with-scope)] Successfully "fixing" the demo by using `createScopedHtml` on Page A/B.

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
       <my-panel class="panel">
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

1. Components imported via npm **MUST NOT** be self registering components
   If a shared component (on npm) does not offer an export to the class alone, without the registration side effect, then this component can not be used. e.g. every component
   that calls `customElement.define`

   ```js
   export class MyEl { ... }
   customElement.define('my-el', MyEl);
   ```

   or uses the typescript decorator `customElement`

   ```ts
   @customElement('my-el')
   export class MyEl { ... }
   ```

   only side effects free class exports may be used

   ```js
   export class MyEl { ... }
   ```

   Note: not share or components withing the main app shell are exempted from this rule.

2. Every (!!!) component with sub component needs to use `scoped-elements`
   Any import to a self registering component can result in a browser exception - completely breaking the full app.

3. For now only `lit-html` is supported (other rendering engines could be incorporated)

4. You can not use tag selectors in css

   ```css
   🚫 my-panel {
     width: 300px;
   }
   ✅ .panel {
     width: 300px;
   }
   ```

5. You can not use tag selectors in javascript querySelectors

   ```js
   🚫 this.shadowRoot.querySelector('my-panel');
   ✅ this.shadowRoot.querySelector('.panel');
   ```

6. Using `scoped-elements` may result in up to 8% of performance degradation
7. Loading of duplicate/similar source code (most breaking releases are not a total rewrite) should always be a temporary solution
8. A lot of times temporary solutions become more permanent 🙈 Be sure to focus on keeping the time of nested dependencies short.

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
        editLink.href = url.substr(0, url.indexOf('/master/')) + '/master/packages/scoped-elements/README.md';
      }
    }
  }
</script>
