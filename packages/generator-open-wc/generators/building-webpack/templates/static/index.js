import loadPolyfills from '@open-wc/polyfills-loader';

loadPolyfills().then(() => {
  import('./my-app.js');
});