/**
 * Enables the nofity option for properties to fire change notification events
 */
export function ReadOnlyPropertiesMixin(superclass) {
  const _readOnlyPropertyNamesMap = new Map();

  return class ReadOnlyPropertiesClass extends superclass {
    constructor() {
      super();
      this._readOnlyPropertyInitializedMap = new Map();
    }

    static createProperty(name, options) {
      let finalOptions = options;

      if (options.readOnly) {
        const privateName = Symbol(name);

        _readOnlyPropertyNamesMap.set(name, privateName);

        Object.defineProperty(this.prototype, name, {
          get() {
            return this[privateName];
          },

          set(value) {
            // allow for class field initialization
            /* istanbul ignore if */
            if (this._readOnlyPropertyInitializedMap.get(name)) return;
            this[privateName] = value;
            this._readOnlyPropertyInitializedMap.set(name, true);
          },
        });

        finalOptions = { ...options, noAccessor: true };
      }
      // It seems like there's really no good way to extend a class and its
      // static members in typescript
      // @ts-ignore
      super.createProperty(name, finalOptions);
    }

    /**
     * Set read-only properties
     */
    async setReadOnlyProperties(props) {
      await Promise.all(
        Object.entries(props).map(([name, newVal]) => {
          const privateName = _readOnlyPropertyNamesMap.get(name);
          const oldVal = this[privateName];
          this[privateName] = newVal;
          return this.requestUpdate(name, oldVal);
        }),
      );
    }
  };
}
