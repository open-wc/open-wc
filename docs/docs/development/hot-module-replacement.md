# Development >> Hot Module Replacement ||50

> This project is currently experimental. Try it out and let us know what you think!

[@web/dev-server](https://modern-web.dev/docs/dev-server/overview/) plugin for "hot module replacement" or "fast refresh" with web components.

Keeps track of web component definitions in your code, and updates them at runtime on change. This is faster than a full page reload and preserves the page's state.

HMR requires the web component base class to implement a `hotReplaceCallback`.

## Installation

> Make sure you have [@web/dev-server](https://modern-web.dev/docs/dev-server/overview/) installed.

Install the package:

```
npm i --save-dev @open-wc/dev-server-hmr
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

Pick one of the presets below if needed, then start the dev server like normal. There are no code modifications needed. If a component or one of it's dependencies is changed, the component is replaced. Otherwise the page is reloaded.

> Make sure to start the dev server without `watch` mode, as this always forces a page reload on change.

## Implementations

### Vanilla

For vanilla web component projects that don't implement any base class or library this plugin should detect your components correctly. Read more below on how to implement the `hotReplaceCallback`.

### LitElement

LitElement v2 supports HMR with a small code patch included in the preset. There is no support yet for the v3 prerelease.

```js
import { hmrPlugin, presets } from '@open-wc/dev-server-hmr';

export default {
  plugins: [
    hmrPlugin({
      include: ['src/**/*'],
      presets: [presets.litElement],
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

### Other libraries

If you know any other libraries that work correctly with HMR we can add presets for them here. Presets help by configuring the detection of base classes, decorators, and/or runtime code patches.

## Detecting web components

To "hot replace" an edited web component we have to be able to detect component definitions in your code. By default we look for usage of `customElements.define` and extending from `HTMLElement`.

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

We don't currently support function based web components. Let us know if you have ideas on how this could work!

## Limitations

HMR workflows are not perfect. We're overwriting and moving around code at runtime. It breaks assumptions you normally make about your code. We recommended periodically doing a full refresh of the page, especially when you encounter strange behavior.

The following limitations should be kept in mind when working with open-wc HMR:

- Modules containing web components are re-imported under a new name and only the web component class is replaced. Side effects are triggered again but exported symbols are not updated.
- Constructors for already created elements are not re-run when a class is replaced. Otherwise it would reset the properties of your element. This does mean that newly added properties don't show up.
- Instance class fields act like properties defined in a constructor, and newly added or changed class fields are not hot replaced.
- Newly created elements do use the new constructors and class fields.

> Did you run into other limitations? Let us know so we can improve this list.

## Implementing HMR

When hot replacing a web component class we can't replace the actual class. The custom element registry doesn't allow re-registration and we want to preserve the state of already rendered components. Instead, we patch the initial class with the properties from the updates class.

This updating logic can be different for each base class, and it can be implemented using the `hotReplaceCallback`.

This is the default implementation:

```js
function updateObjectMembers(currentObj, newObj) {
  const currentProperties = new Set(Object.getOwnPropertyNames(hmrClass));
  const newProperties = new Set(Object.getOwnPropertyNames(newClass));

  // add new and overwrite existing properties/methods
  for (const prop of Object.getOwnPropertyNames(newClass)) {
    const descriptor = Object.getOwnPropertyDescriptor(newClass, prop);
    if (descriptor && descriptor.configurable) {
      Object.defineProperty(hmrClass, prop, descriptor);
    }
  }

  // delete removed properties
  for (const existingProp of currentProperties) {
    if (!newProperties.has(existingProp)) {
      try {
        delete hmrClass[existingProp];
      } catch {}
    }
  }
}

class MyElement extends HTMLElement {
  // static callback, called once when a class updates
  static hotReplaceCallback(newClass) {
    updateObjectMembers(this, newClass);
    updateObjectMembers(this.prototype, newClass.prototype);
  }

  // instance callback, called for each connected element
  hotReplaceCallback() {
    // this should kick off re-rendering
    this.update();
  }
}
```

### Static callback

The static `hotReplaceCallback` callback is called once for each replacement on the initial class of the component. This is where you can copy over properties from the new class to the existing class.

Implementing this callback is not mandatory, by default we copy over properties of the new class to the existing class. If this is not sufficient, you can customize this logic.

### Instance callback

The instance callback is called on each connected element implementing the replaced class. Implementing this is necessary to do some work at the instance level, such as trigger a re-render or style update.

When the instance callback is called, all the class members (properties, methods, etc.) have already been updated. So it could be as simple as kicking off the regular updating/rendering pipeline.

### Patching

If you don't want to include the HMR code in your production code, you could patch in the callbacks externally:

```js
import { MyElement } from 'my-element';

MyElement.hotReplaceCallback = function hotReplaceCallback(newClass) {
  // code for the static callback
};

MyElement.prototype.hotReplaceCallback = function hotReplaceCallback(newClass) {
  // code for the instance callback
};
```

Make sure this code is loaded before any of your components are loaded. You could also do this using the `patch` option in the config:

```js
import { hmrPlugin } from '@open-wc/dev-server-hmr';

const myElementPatch = `
import { MyElement } from 'my-element';

MyElement.hotReplaceCallback = function hotReplaceCallback(newClass) {
  // code for the static callback
};

MyElement.prototype.hotReplaceCallback = function hotReplaceCallback(newClass) {
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
