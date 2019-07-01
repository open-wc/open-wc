export const createDeferredPromise = () => {
  const deferredPromise = {};
  deferredPromise.promise = new Promise((resolve, reject) => {
    deferredPromise.resolve = resolve;
    deferredPromise.reject = reject;
  });
  return deferredPromise;
};

export class AsyncStream {
  constructor(stream) {
    this.stream = stream;
    this.responses = [];
    this._cursor = -1;
    this._onData = this._onData.bind(this);

    stream.body.addListener('data', this._onData);
  }

  next() {
    this._cursor += 1;

    if (this._cursor < this.responses.length) {
      console.log('respond directly');
      return Promise.resolve(this.responses[this._cursor]);
    }

    this._deferred = createDeferredPromise();
    return this._deferred.promise;
  }

  _onData(data) {
    this.responses.push(data.toString('utf-8'));

    if (this._deferred) {
      this._deferred.resolve(this.responses[this._cursor]);
      this._deferred = null;
    }
  }

  close() {
    this.stream.body.removeListener('data', this._onData);
  }
}

export const timeout = ms => new Promise(resolve => setTimeout(resolve, ms));
