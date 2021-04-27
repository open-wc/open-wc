// @ts-nocheck
/* eslint-disable */
/**
 * Needs a fork until https://github.com/webcomponents/polyfills/issues/438 & https://github.com/webcomponents/polyfills/issues/440 is resolved.
 */

if (!ShadowRoot.prototype.createElement) {
  /**
   * @license
   * Copyright (c) 2020 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */

  const NativeHTMLElement = window.HTMLElement;
  const nativeDefine = window.customElements.define;
  const nativeGet = window.customElements.get;
  const nativeRegistry = window.customElements;

  const definitionForElement = new WeakMap();
  const pendingRegistryForElement = new WeakMap();
  const globalDefinitionForConstructor = new WeakMap();
  // TBD: This part of the spec proposal is unclear:
  // > Another option for looking up registries is to store an element's
  // > originating registry with the element. The Chrome DOM team was concerned
  // > about the small additional memory overhead on all elements. Looking up the
  // > root avoids this.
  const scopeForElement = new WeakMap();

  // Constructable CE registry class, which uses the native CE registry to
  // register stand-in elements that can delegate out to CE classes registered
  // in scoped registries
  window.CustomElementRegistry = class {
    constructor() {
      this._definitionsByTag = new Map();
      this._definitionsByClass = new Map();
      this._definedPromises = new Map();
      this._definedResolvers = new Map();
      this._awaitingUpgrade = new Map();
    }

    define(tagName, elementClass) {
      tagName = tagName.toLowerCase();
      if (this._getDefinition(tagName) !== undefined) {
        throw new DOMException(
          `Failed to execute 'define' on 'CustomElementRegistry': the name "${tagName}" has already been used with this registry`,
        );
      }
      if (this._definitionsByClass.get(elementClass) !== undefined) {
        throw new DOMException(
          `Failed to execute 'define' on 'CustomElementRegistry': this constructor has already been used with this registry`,
        );
      }
      // Since observedAttributes can't change, we approximate it by patching
      // set/removeAttribute on the user's class
      const attributeChangedCallback = elementClass.prototype.attributeChangedCallback;
      const observedAttributes = new Set(elementClass.observedAttributes || []);
      patchAttributes(elementClass, observedAttributes, attributeChangedCallback);
      patchHTMLElement(elementClass);
      // Register the definition
      const definition = {
        elementClass,
        connectedCallback: elementClass.prototype.connectedCallback,
        disconnectedCallback: elementClass.prototype.disconnectedCallback,
        adoptedCallback: elementClass.prototype.adoptedCallback,
        attributeChangedCallback,
        observedAttributes,
      };
      this._definitionsByTag.set(tagName, definition);
      this._definitionsByClass.set(elementClass, definition);
      // Register a stand-in class which will handle the registry lookup & delegation
      let standInClass = nativeGet.call(nativeRegistry, tagName);
      if (!standInClass) {
        standInClass = createStandInElement(tagName);
        nativeDefine.call(nativeRegistry, tagName, standInClass);
      }
      if (this === window.customElements) {
        globalDefinitionForConstructor.set(elementClass, definition);
        definition.standInClass = standInClass;
      }
      // Upgrade any elements created in this scope before define was called
      const awaiting = this._awaitingUpgrade.get(tagName);
      if (awaiting) {
        this._awaitingUpgrade.delete(tagName);
        for (const element of awaiting) {
          pendingRegistryForElement.delete(element);
          upgrade(element, definition);
        }
      }
      // Flush whenDefined callbacks
      const resolver = this._definedResolvers.get(tagName);
      if (resolver) {
        resolver();
      }
      return elementClass;
    }

    upgrade() {
      creationContext.push(this);
      nativeRegistry.upgrade.apply(nativeRegistry, arguments);
      creationContext.pop();
    }

    get(tagName) {
      const definition = this._definitionsByTag.get(tagName);
      return definition?.elementClass;
    }

    _getDefinition(tagName) {
      return this._definitionsByTag.get(tagName);
    }

    whenDefined(tagName) {
      let promise = this._definedPromises.get(tagName);
      if (!promise) {
        let resolve;
        promise = new Promise(r => (resolve = r));
        this._definedPromises.set(tagName, promise);
        this._definedResolvers.set(tagName, resolve);
      }
      return promise;
    }

    _upgradeWhenDefined(element, tagName, shouldUpgrade) {
      let awaiting = this._awaitingUpgrade.get(tagName);
      if (!awaiting) {
        this._awaitingUpgrade.set(tagName, (awaiting = new Set()));
      }
      if (shouldUpgrade) {
        awaiting.add(element);
      } else {
        awaiting.delete(element);
      }
    }
  };

  // User extends this HTMLElement, which returns the CE being upgraded
  let upgradingInstance;
  window.HTMLElement = function HTMLElement() {
    // Upgrading case: the StandInElement constructor was run by the browser's
    // native custom elements and we're in the process of running the
    // "constructor-call trick" on the natively constructed instance, so just
    // return that here
    let instance = upgradingInstance;
    if (instance) {
      upgradingInstance = undefined;
      return instance;
    }
    // Construction case: we need to construct the StandInElement and return
    // it; note the current spec proposal only allows new'ing the constructor
    // of elements registered with the global registry
    const definition = globalDefinitionForConstructor.get(this.constructor);
    if (!definition) {
      throw new TypeError(
        'Illegal constructor (custom element class must be registered with global customElements registry to be newable)',
      );
    }
    instance = Reflect.construct(NativeHTMLElement, [], definition.standInClass);
    Object.setPrototypeOf(instance, this.constructor.prototype);
    definitionForElement.set(instance, definition);
    return instance;
  };
  window.HTMLElement.prototype = NativeHTMLElement.prototype;

  // Helpers to return the scope for a node where its registry would be located
  const isValidScope = node => node === document || node instanceof ShadowRoot;
  const registryForNode = node => {
    // TODO: the algorithm for finding the scope is a bit up in the air; assigning
    // a one-time scope at creation time would require walking every tree ever
    // created, which is avoided for now
    let scope = node.getRootNode();
    // If we're not attached to the document (i.e. in a disconnected tree or
    // fragment), we need to get the scope from the creation context; that should
    // be a Document or ShadowRoot, unless it was created via innerHTML
    if (!isValidScope(scope)) {
      const context = creationContext[creationContext.length - 1];
      // When upgrading via registry.upgrade(), the registry itself is put on the
      // creationContext stack
      if (context instanceof CustomElementRegistry) {
        return context;
      }
      // Otherwise, get the root node of the element this was created from
      scope = context.getRootNode();
      // The creation context wasn't a Document or ShadowRoot or in one; this
      // means we're being innerHTML'ed into a disconnected element; for now, we
      // hope that root node was created imperatively, where we stash _its_
      // scopeForElement. Beyond that, we'd need more costly tracking.
      if (!isValidScope(scope)) {
        scope = scopeForElement.get(scope)?.getRootNode() || document;
      }
    }
    return scope.customElements;
  };

  // Helper to create stand-in element for each tagName registered that delegates
  // out to the registry for the given element
  const createStandInElement = tagName => {
    return class ScopedCustomElementBase {
      constructor() {
        // Create a raw HTMLElement first
        const instance = Reflect.construct(NativeHTMLElement, [], this.constructor);
        // We need to install the minimum HTMLElement prototype so that
        // scopeForNode can use DOM API to determine our construction scope;
        // upgrade will eventually install the full CE prototype
        Object.setPrototypeOf(instance, HTMLElement.prototype);
        // Get the node's scope, and its registry (falls back to global registry)
        const registry = registryForNode(instance) || window.customElements;
        const definition = registry._getDefinition(tagName);
        if (definition) {
          upgrade(instance, definition);
        } else {
          pendingRegistryForElement.set(instance, registry);
        }
        return instance;
      }

      connectedCallback() {
        const definition = definitionForElement.get(this);
        if (definition) {
          // Delegate out to user callback
          definition.connectedCallback && definition.connectedCallback.apply(this, arguments);
        } else {
          // Register for upgrade when defined (only when connected, so we don't leak)
          pendingRegistryForElement.get(this)._upgradeWhenDefined(this, tagName, true);
        }
      }

      disconnectedCallback() {
        const definition = definitionForElement.get(this);
        if (definition) {
          // Delegate out to user callback
          definition.disconnectedCallback && definition.disconnectedCallback.apply(this, arguments);
        } else {
          // Un-register for upgrade when defined (so we don't leak)
          pendingRegistryForElement.get(this)._upgradeWhenDefined(this, tagName, false);
        }
      }

      adoptedCallback() {
        const definition = definitionForElement.get(this);
        definition?.adoptedCallback?.apply(this, arguments);
      }
      // no attributeChangedCallback or observedAttributes since these
      // are simulated via setAttribute/removeAttribute patches
    };
  };

  // Helper to patch CE class setAttribute/getAttribute to implement
  // attributeChangedCallback
  const patchAttributes = (elementClass, observedAttributes, attributeChangedCallback) => {
    if (observedAttributes.size === 0 || attributeChangedCallback === undefined) {
      return;
    }
    const setAttribute = elementClass.prototype.setAttribute;
    if (setAttribute) {
      elementClass.prototype.setAttribute = function (name, value) {
        if (observedAttributes.has(name)) {
          const old = this.getAttribute(name);
          setAttribute.call(this, name, value);
          attributeChangedCallback.call(this, name, old, value);
        } else {
          setAttribute.call(this, name, value);
        }
      };
    }
    const removeAttribute = elementClass.prototype.removeAttribute;
    if (removeAttribute) {
      elementClass.prototype.removeAttribute = function (name) {
        if (observedAttributes.has(name)) {
          const old = this.getAttribute(name);
          removeAttribute.call(this, name);
          attributeChangedCallback.call(this, name, old, null);
        } else {
          removeAttribute.call(this, name);
        }
      };
    }
  };

  const patchHTMLElement = elementClass => {
    const parentClass = Object.getPrototypeOf(elementClass);

    if (parentClass !== window.HTMLElement) {
      if (parentClass === NativeHTMLElement) {
        return Object.setPrototypeOf(elementClass, window.HTMLElement);
      }

      return patchHTMLElement(parentClass);
    }
  };

  // Helper to upgrade an instance with a CE definition using "constructor call trick"
  const upgrade = (instance, definition) => {
    Object.setPrototypeOf(instance, definition.elementClass.prototype);
    definitionForElement.set(instance, definition);
    upgradingInstance = instance;
    new definition.elementClass();
    // Approximate observedAttributes from the user class, since the stand-in element had none
    definition.observedAttributes.forEach(attr => {
      if (instance.hasAttribute(attr)) {
        definition.attributeChangedCallback.call(instance, attr, null, instance.getAttribute(attr));
      }
    });
  };

  // Patch attachShadow to set customElements on shadowRoot when provided
  const nativeAttachShadow = Element.prototype.attachShadow;
  Element.prototype.attachShadow = function (init) {
    const shadowRoot = nativeAttachShadow.apply(this, arguments);
    if (init.customElements) {
      shadowRoot.customElements = init.customElements;
    }
    return shadowRoot;
  };

  // Install scoped creation API on Element & ShadowRoot
  let creationContext = [document];
  const installScopedCreationMethod = (ctor, method, from) => {
    const native = (from ? Object.getPrototypeOf(from) : ctor.prototype)[method];
    ctor.prototype[method] = function () {
      creationContext.push(this);
      const ret = native.apply(from || this, arguments);
      scopeForElement.set(ret, this);
      creationContext.pop();
      return ret;
    };
  };
  installScopedCreationMethod(ShadowRoot, 'createElement', document);
  installScopedCreationMethod(ShadowRoot, 'importNode', document);
  installScopedCreationMethod(Element, 'insertAdjacentHTML');

  // Install scoped innerHTML on Element & ShadowRoot
  const installScopedCreationSetter = (ctor, name) => {
    const descriptor = Object.getOwnPropertyDescriptor(ctor.prototype, name);
    Object.defineProperty(ctor.prototype, name, {
      ...descriptor,
      set(value) {
        creationContext.push(this);
        descriptor.set.call(this, value);
        creationContext.pop();
      },
    });
  };
  installScopedCreationSetter(Element, 'innerHTML');
  installScopedCreationSetter(ShadowRoot, 'innerHTML');

  // Install global registry
  Object.defineProperty(window, 'customElements', {
    value: new CustomElementRegistry(),
    configurable: true,
    writable: true,
  });
}
