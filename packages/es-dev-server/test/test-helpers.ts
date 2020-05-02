export interface DeferredPromise<T> {
  promise: Promise<T>;
  resolve: () => void;
  reject: () => void;
}

export const createDeferredPromise = <T>() => {
  const deferredPromise: Partial<DeferredPromise<T>> = {};
  deferredPromise.promise = new Promise((resolve, reject) => {
    deferredPromise.resolve = resolve;
    deferredPromise.reject = reject;
  });
  return deferredPromise as DeferredPromise<T>;
};

export const timeout = ms => new Promise(resolve => setTimeout(resolve, ms));

export function createMockFileWatcher() {
  return {
    watchedFiles: [],

    listeners: new Map(),

    close() {},

    add(file) {
      this.watchedFiles.push(file);
    },

    addListener(event, callback) {
      let listenersForEvent = this.listeners.get(event);
      if (!listenersForEvent) {
        listenersForEvent = [];
        this.listeners.set(event, listenersForEvent);
      }
      listenersForEvent.push(callback);
    },

    dispatchEvent(name, payload) {
      const listenersForEvent = this.listeners.get(name);
      if (!listenersForEvent) {
        throw new Error(`No listeners for event ${name}`);
      }

      listenersForEvent.forEach(callback => {
        callback(payload);
      });
    },
  };
}
