const wcHmrRuntime = `
// override global define to allow double registrations
const originalDefine = window.customElements.define;
window.customElements.define = (name, ...rest) => {
  if (!window.customElements.get(name)) {
    originalDefine.call(window.customElements, name, ...rest);
  }
};

const registry = new Map();

function createClassKey(importMetaUrl, className) {
  const modulePath = new URL(importMetaUrl).pathname;
  return \`\${modulePath}:\${className}\`;
}

export function register(importMetaUrl, hmrClass) {
  const key = createClassKey(importMetaUrl, hmrClass.name);
  const hotReplaceCallback = registry.get(key);
  if (hotReplaceCallback) {
    // class is already registered, call the replace function registered below
    hotReplaceCallback(hmrClass);
    return;
  }
  // class is not yet registered, set it up and register an update callback
  const connectedElements = trackConnectedElements(hmrClass);

  // register a callback for this class later patch in updates to the class
  registry.set(key, async newClass => {
    // wait 1 microtask to allow the class definition to propagate
    await 0;

    if (hmrClass.hotReplaceCallback) {
      // class has implemented a callback, use that
      hmrClass.hotReplaceCallback(newClass);
    } else {
      // otherwise apply default update
      updateClassMembers(hmrClass, newClass);
    }

    for (const element of connectedElements) {
      if (element.hotReplaceCallback) {
        element.hotReplaceCallback(newClass);
      }
    }
  });
}

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

const preserved = ['connectedCallback', 'disconnectedCallback', 'observedAttributes'];

export function updateClassMembers(hmrClass, newClass) {
  updateObjectMembers(hmrClass, newClass);
  updateObjectMembers(hmrClass.prototype, newClass.prototype);
}

export function updateObjectMembers(hmrClass, newClass) {
  const currentProperties = new Set(Object.getOwnPropertyNames(hmrClass));
  const newProperties = new Set(Object.getOwnPropertyNames(newClass));

  for (const prop of Object.getOwnPropertyNames(newClass)) {
    const descriptor = Object.getOwnPropertyDescriptor(newClass, prop);
    if (descriptor && descriptor.configurable) {
      Object.defineProperty(hmrClass, prop, descriptor);
    }
  }

  for (const existingProp of currentProperties) {
    if (!preserved.includes(existingProp) && !newProperties.has(existingProp)) {
      try {
        delete hmrClass[existingProp];
      } catch {}
    }
  }
}`;

module.exports = { wcHmrRuntime };
