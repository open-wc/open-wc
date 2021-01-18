// @ts-nocheck
/* eslint-disable no-param-reassign, no-console */

// override global define to allow double registrations
const originalDefine = window.customElements.define;
window.customElements.define = (name, ...rest) => {
  if (!window.customElements.get(name)) {
    originalDefine.call(window.customElements, name, ...rest);
  }
};

const proxiesForKeys = new Map();
const keysForClasses = new Map();

function trackConnectedElements(hmrClass) {
  const connectedElements = new Set();
  const originalCb = hmrClass.prototype.connectedCallback;
  hmrClass.prototype.connectedCallback = function connectedCallback(...args) {
    if (originalCb) {
      originalCb.call(this, ...args);
    }
    connectedElements.add(this);
  };

  const originalDcb = hmrClass.prototype.disconnectedCallback;
  hmrClass.prototype.disconnectedCallback = function disconnectedCallback(...args) {
    if (originalDcb) {
      originalDcb.call(this, ...args);
    }
    connectedElements.delete(this);
  };
  return connectedElements;
}

const proxyMethods = [
  'construct',
  'defineProperty',
  'deleteProperty',
  'getOwnPropertyDescriptor',
  'getPrototypeOf',
  'setPrototypeOf',
  'isExtensible',
  'ownKeys',
  'preventExtensions',
  'has',
  'get',
  'set',
];

/**
 * Creates a proxy for the given target, and fowards any calls to the most up to the latest
 * version of the target. (ex. the latest hot replaced class).
 */
function createProxy(originalTarget, getCurrentTarget) {
  const proxyHandler = {};
  for (const method of proxyMethods) {
    proxyHandler[method] = (_, ...args) => {
      if (method === 'get' && args[0] === 'prototype') {
        // prototype must always return original target value
        return Reflect[method](_, ...args);
      }
      return Reflect[method](getCurrentTarget(), ...args);
    };
  }
  return new Proxy(originalTarget, proxyHandler);
}

/**
 * Replaces all prototypes in the inheritance chain with a proxy
 * that references the latest implementation
 */
function replacePrototypesWithProxies(instance) {
  let previous = instance;
  let proto = Object.getPrototypeOf(instance);

  while (proto && proto.constructor !== HTMLElement) {
    const key = keysForClasses.get(proto.constructor);
    if (key) {
      // this is a prototype that might be hot-replaced later
      const getCurrentProto = () => proxiesForKeys.get(key).currentClass.prototype;
      Object.setPrototypeOf(previous, createProxy(proto, getCurrentProto));
    }

    previous = proto;
    proto = Object.getPrototypeOf(proto);
  }
}

export class WebComponentHmr extends HTMLElement {
  constructor(...args) {
    super(...args);
    const key = keysForClasses.get(this.constructor);
    // check if the constructor is registered
    if (key) {
      const p = proxiesForKeys.get(key);
      // replace the constructor with a proxy that references the latest implementation of this class
      this.constructor = p.currentProxy;
    }
    // replace prototype chain with a proxy to the latest prototype implementation
    replacePrototypesWithProxies(this);
  }
}

window.WebComponentHmr = WebComponentHmr;

/**
 * Injects the WebComponentHmr class into the inheritance chain
 */
function injectInheritsHmrClass(clazz) {
  let parent = clazz;
  let proto = Object.getPrototypeOf(clazz);
  // walk prototypes until we reach HTMLElement
  while (proto && proto !== HTMLElement) {
    parent = proto;
    proto = Object.getPrototypeOf(proto);
  }

  if (proto !== HTMLElement) {
    // not a web component
    return;
  }
  if (parent === WebComponentHmr) {
    // class already inherits WebComponentHmr
    return;
  }
  Object.setPrototypeOf(parent, WebComponentHmr);
}

/**
 * Registers a web component class. Triggers a hot replacement if the
 * class was already registered before.
 */
export function register(importMeta, name, clazz) {
  const key = `${new URL(importMeta.url).pathname}:${name}`;
  const existing = proxiesForKeys.get(key);
  if (!existing) {
    // this class was not yet registered,

    // create a proxy that will forward to the latest implementation
    const proxy = createProxy(clazz, () => proxiesForKeys.get(key).currentClass);
    // inject a HMR class into the inheritance chain
    injectInheritsHmrClass(clazz);
    // keep track of all connected elements for this class
    const connectedElements = trackConnectedElements(clazz);

    proxiesForKeys.set(key, {
      originalProxy: proxy,
      currentProxy: proxy,
      originalClass: clazz,
      currentClass: clazz,
      connectedElements,
    });
    keysForClasses.set(clazz, key);
    return proxy;
  }
  // class was already registered before

  // register new class, all calls will be proxied to this class
  const previousProxy = existing.currentProxy;
  const currentProxy = createProxy(clazz, () => proxiesForKeys.get(key).currentClass);
  existing.currentClass = clazz;
  existing.currentProxy = currentProxy;

  Promise.resolve().then(() => {
    // call optional HMR on the class if they exist, after next microtask to ensure
    // module bodies have executed fully
    if (clazz.hotReplacedCallback) {
      try {
        clazz.hotReplacedCallback();
      } catch (error) {
        console.error(error);
      }
    }

    for (const element of existing.connectedElements) {
      if (element.constructor === previousProxy) {
        // we need to update the constructor of the element to match to newly created proxy
        // but we should only do this for elements that was directly created with this class
        // and not for elements that extend this
        element.constructor = currentProxy;
      }

      if (element.hotReplacedCallback) {
        try {
          element.hotReplacedCallback();
        } catch (error) {
          console.error(error);
        }
      }
    }
  });

  // the original proxy already forwards to the new class but we're return a new proxy
  // because access to `prototype` must return the original value and we need to be able to
  // manipulate the prototype on the new class
  return currentProxy;
}
