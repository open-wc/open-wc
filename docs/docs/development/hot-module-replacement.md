# Development >> Hot Module Replacement ||50

> This project is currently experimental. Try it out and let us know what you think!

[@web/dev-server](https://modern-web.dev/docs/dev-server/overview/) plugin for "hot module replacement" or "fast refresh" with web components and es modules.

Keeps track of web component definitions in your code, and updates them at runtime on change. This is faster than a full page reload and preserves the page's state.

HMR requires the web component base class to implement a `hotReplacedCallback`.

## Installation

First, install [@web/dev-server](https://modern-web.dev/docs/dev-server/overview/) if you don't already have this installed in your project.

Install the package:

```
npm i --save-dev @open-wc/dev-server-hmr@next
```

Add the plugin to your `web-dev-server-config.mjs`:

```js
import { hmrPlugin } from '@open-wc/dev-server-hmr';

export default {
  plugins: [
    hmrPlugin({
      include: ['src/**/*'],
    }),
  ],
};
```

Pick one of the presets below if needed, then start the dev server like normal. You don't need to make any changes to your code. If a component or one of its dependencies is changed, the component is replaced. Otherwise, the page is reloaded.

> Make sure to start the dev server without `watch` mode, as this always forces a page to reload on change.

## Implementations

### Vanilla

For vanilla web component projects that don't implement any base class or library this plugin should detect your components automatically. You need to implement a `hotReplacedCallback` on your element to trigger a re-render, read more about that below.

### Lit & LitElement

LitElement v2 and Lit v2 (which is LitElement v3) need different "patches" to support HMR.
To distinguish between v2 and v3 we take the import as a hint.

```js
// v2 patch
import { LitElement } from 'lit-element';
// v3 patch
import { LitElement } from 'lit';
```

<inline-notification type="warning">

If you mix LitElement v2 and LitElement v3 in the same app be sure to import v2 from 'lit-element' and v3 from 'lit';

</inline-notification>

```js
import { hmrPlugin, presets } from '@open-wc/dev-server-hmr';

export default {
  plugins: [
    hmrPlugin({
      include: ['src/**/*'],
      // only v3
      presets: [presets.lit],
      // only v2
      presets: [presets.litElement],
      // both v3 & v2
      presets: [presets.lit, presets.litElement],
    }),
  ],
};
```

### FAST Element

We have experimental support for FAST element using a small code patch included in the preset. This might not cover all use cases yet, let us know if you run into any issues!

```js
import { hmrPlugin, presets } from '@open-wc/dev-server-hmr';

export default {
  plugins: [
    hmrPlugin({
      include: ['src/**/*'],
      presets: [presets.fastElement],
    }),
  ],
};
```

### Haunted

We have experimental support for Haunted using a small code patch included in the preset. This might not cover all use cases yet, let us know if you run into any issues!

```js
import { hmrPlugin, presets } from '@open-wc/dev-server-hmr';

export default {
  plugins: [
    hmrPlugin({
      include: ['src/**/*'],
      presets: [presets.haunted],
    }),
  ],
};
```

### Other libraries

If you know any other libraries that work correctly with HMR we can add presets for them here. Presets help by configuring the detection of base classes, decorators, and/or runtime code patches.

## How it works

Web component HMR works by replacing class references and instance prototype chains with proxies. Whenever a class or a property on the prototype chain is accessed, the proxy will forward to the latest implementation of the web component class.

After updating a web component class, newly created elements will use the latest class and things work as expected from there.

For existing elements, the prototype chain is updated to reference the new class. This means that things like class methods are updated, but local class fields or properties are not. This is a feature because it retains component state, but also a limitation because newly added fields/properties are not available. The constructor is also not re-run for existing elements.

Web component HMR works best when editing HTML and CSS. Because we're overwriting and moving around code at runtime, assumptions you can normally make about how your code runs is broken. It's recommended to periodically do a full refresh of the page.

### Limitations

The following limitations should be kept in mind when working with open-wc HMR:

- For existing elements, constructors are not re-run when updating a class.
- For existing elements, newly added fields/properties are not available.
- A web component's `observedAttributes` list cannot be updated over time. Updates require a refresh.

> Did you run into other limitations? Let us know so we can improve this list.

## Detecting web components

To "hot replace" an edited web component we have to be able to detect component definitions in your code. By default we look for usage of `customElements.define` and/or classes that from `HTMLElement` directly.

For other use cases, you can specify base classes or decorators to indicate component definitions.

> If you are using a preset, the detection will already be configured correctly.

### Base classes

The base class option detects web components that extend a specific base class. The base class can be matched by name, or as an import from a specific module.

```js
hmrPlugin({
  include: ['src/**/*'],
  baseClasses: [
    // anything that extends a class called MyElement
    { name: 'MyElement' },
    // anything that extends a class called MyElement imported from 'my-element'
    { name: 'MyElement', import: 'my-element' },
    // anything that extends a class called MyElement imported from './src/MyElement.js' (relative to current working directory)
    { name: 'MyElement', import: './src/MyElement.js' },
    // anything that extends a default importeded class from 'my-element'
    { name: 'default', import: 'my-element' },
  ],
});
```

### Decorator

The plugin can also detect web components defined using decorators. The decorators can be matched by name, or as an import from a specific module.

```js
hmrPlugin({
  include: ['src/**/*'],
  decorators: [
    // any class that uses a decorator called customElement
    { name: 'customElement' },
    // any class that uses a decorator called customElement imported from 'my-element'
    { name: 'customElement', import: 'my-element' },
    // any class that uses a decorator called customElement imported from './src/MyElement.js' (relative to current working directory)
    { name: 'customElement', import: './src/MyElement.js' },
    // any class that uses a decorator default imported from 'my-element'
    { name: 'default', import: 'my-element' },
  ],
});
```

### Functions

Some libraries create the web component class definition from a function. The functions can be matched by name, or as an import from a specific module.

```js
hmrPlugin({
  include: ['src/**/*'],
  functions: [
    // any class that uses a function called component
    { name: 'component' },
    // any class that uses a function called component imported from 'my-element'
    { name: 'component', import: 'my-element' },
    // any class that uses a function called component imported from './src/MyElement.js' (relative to current working directory)
    { name: 'component', import: './src/MyElement.js' },
    // any class that uses a function default imported from 'my-element'
    { name: 'default', import: 'my-element' },
  ],
});
```

## Implementing HMR

To implement HMR your element or element's base class should implement one of the `hotReplacedCallback` methods. In your method
you can do custom updating logic, and kick off re-rendering of your element.

```js
class MyElement extends HTMLElement {
  // static callback, called once when a class updates
  static hotReplacedCallback() {
    this.update();
  }

  // instance callback, called for each connected element
  hotReplacedCallback() {
    // this should kick off re-rendering
    this.rerender();
  }
}
```

This plugin currently only works for Web Dev Server. The approach should be compatible with other ESM-HMR implementations in other dev servers. This is something that can be explored.

Compatibility with non es modules HMR, such as webpack, is not currently a goal.

### Patching

If you don't want to include the HMR code in your production code, you could patch in the callbacks externally:

```js
import { MyElement } from 'my-element';

MyElement.hotReplacedCallback = function hotReplacedCallback() {
  // code for the static callback
};

MyElement.prototype.hotReplacedCallback = function hotReplacedCallback() {
  // code for the instance callback
};
```

Make sure this code is loaded before any of your components are loaded. You could also do this using the `patch` option in the config:

```js
import { hmrPlugin } from '@open-wc/dev-server-hmr';

const myElementPatch = `
import { MyElement } from 'my-element';

MyElement.hotReplacedCallback = function hotReplacedCallback() {
  // code for the static callback
};

MyElement.prototype.hotReplacedCallback = function hotReplacedCallback() {
  // code for the instance callback
};
`;

export default {
  plugins: [
    hmrPlugin({
      include: ['src/**/*'],
      baseClasses: [{ name: 'MyElement', import: 'my-element' }],
      patches: [myElementPatch],
    }),
  ],
};
```

```js script
import '@rocket/launch/inline-notification/inline-notification.js';
```
